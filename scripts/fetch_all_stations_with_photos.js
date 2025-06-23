const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

// Google Places API (New) Key
const API_KEY = 'AIzaSyBt-TRRDiaKsU2URRLCaJaMcwkgfMprIBE';

// 经纬度范围（西马+东马），西马南界收紧到1.4，避开新加坡
const AREAS = [
  // 西马
  { minLat: 1.4, maxLat: 6.7, minLng: 99.6, maxLng: 104.6 },
  // 东马
  { minLat: 0.8, maxLat: 7.5, minLng: 109.5, maxLng: 119.5 },
];
const STEP = 0.1; // 网格步长，度
const RADIUS = 8000; // 搜索半径，米
const MAX_RESULTS = 20; // 每次最多20个

const OUTPUT_PATH = path.join(__dirname, '../public/stations.json');
const REPORT_WITH_PHOTOS = path.join(__dirname, '../public/stations_with_photos.json');
const REPORT_WITHOUT_PHOTOS = path.join(__dirname, '../public/stations_without_photos.json');

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getDirectionsUrl(lat, lng) {
  return '';
}

function getPhotoUrl(photo) {
  if (!photo || !photo.name) return '';
  // 新版API的照片URL格式
  return `https://places.googleapis.com/v1/${photo.name}/media?maxWidthPx=800&key=${API_KEY}`;
}

async function fetchNearbyStations(lat, lng) {
  const url = 'https://places.googleapis.com/v1/places:searchNearby';
  const body = {
    includedTypes: ['gas_station'],
    maxResultCount: MAX_RESULTS,
    locationRestriction: {
      circle: {
        center: { latitude: lat, longitude: lng },
        radius: RADIUS
      }
    }
  };
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': API_KEY,
      'X-Goog-FieldMask': 'places.id,places.displayName,places.location,places.formattedAddress,places.types,places.photos,places.editorialSummary,places.regularOpeningHours,places.primaryTypeDisplayName,places.primaryType,places.shortFormattedAddress,places.formattedPhoneNumber'
    },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  console.log('API返回:', JSON.stringify(data));
  return data.places || [];
}

function extractServiceTypes(place) {
  const types = place.types || [];
  const result = [];
  if (types.includes('convenience_store')) result.push('便利店');
  if (types.includes('car_wash')) result.push('洗车');
  // 新版API暂时没有更细致服务类型
  return result;
}

function normalizeBrand(name) {
  if (!name) return '';
  const n = name.toLowerCase();
  if (n.includes('petronas')) return 'Petronas';
  if (n.includes('shell')) return 'Shell';
  if (n.includes('petron')) return 'Petron';
  if (n.includes('bhpetrol') || n.includes('bh petrol')) return 'BHPetrol';
  if (n.includes('caltex')) return 'Caltex';
  if (n.includes('esso')) return 'Esso';
  if (n.includes('mobil')) return 'Mobil';
  if (n.includes('projet')) return 'Projet';
  if (n.includes('kpd')) return 'KPD';
  if (n.includes('petrogreen')) return 'Petrogreen';
  return '';
}

function isRealStationName(name) {
  if (!name) return false;
  const n = name.toLowerCase();
  if (/mart|kedai|shop|store|minimart/.test(n)) return false;
  return true;
}

function isNotSingaporeStation(station) {
  const fields = [
    station.formattedAddress,
    station.shortFormattedAddress,
    station.displayName && station.displayName.text,
    station.operator,
    station.brand,
    station.name
  ];
  const combined = fields.filter(Boolean).map(s => s.toLowerCase().replace(/\s+/g, ' ')).join(' ');
  // Singapore典型关键词和邮编6开头
  const sgKeywords = [
    'singapore', 'sg ', 'jurong', 'woodlands', 'tuas', 'yishun', 'sengkang', 'ang mo kio',
    'telok blangah', 'changi', 'bishan', 'serangoon', 'clementi', 'bedok', 'bukit batok', 'bukit timah', 'geylang', 'novena', 'pasir ris', 'punggol', 'queenstown', 'simei', 'toh tuck', 'toa payoh', 'hougang', 'kallang', 'redhill', 'tampines', 'tanjong pagar', 'upper thomson', 'whampoa'
  ];
  for (const kw of sgKeywords) {
    if (combined.includes(kw)) return false;
  }
  // 邮编6开头（如 6xxxx 或 6数字）
  if (/\b6\d{4,}\b/.test(combined)) return false;
  // 必须包含malaysia
  return combined.includes('malaysia');
}

async function main() {
  const allStations = new Map(); // id -> station
  for (const area of AREAS) {
    for (let lat = area.minLat; lat < area.maxLat; lat += STEP) {
      for (let lng = area.minLng; lng < area.maxLng; lng += STEP) {
        console.log(`搜索: ${lat.toFixed(3)},${lng.toFixed(3)}`);
        try {
          const places = await fetchNearbyStations(lat, lng);
          for (const p of places) {
            if (!p.id) continue;
            if (allStations.has(p.id)) continue;
            if (!isRealStationName(p.displayName && p.displayName.text)) continue;
            if (!isNotSingaporeStation(p)) continue;
            const addr = (p.formattedAddress || p.shortFormattedAddress || '').toLowerCase();
            const brandName = (p.displayName && p.displayName.text ? p.displayName.text : '').toLowerCase();
            const brand = (normalizeBrand(p.displayName && p.displayName.text) || '').toLowerCase();
            if (!addr.includes('malaysia')) continue;
            const photoUrl = p.photos && p.photos.length > 0 ? getPhotoUrl(p.photos[0]) : '';
            const service_types = extractServiceTypes(p);
            const station = {
              name: p.displayName ? p.displayName.text : '',
              brand: brand || '',
              address: p.formattedAddress || p.shortFormattedAddress || '',
              photoUrl: photoUrl,
              place_id: p.id,
              location: {
                lat: p.location.latitude,
                lng: p.location.longitude,
              },
              directionsUrl: getDirectionsUrl(p.location.latitude, p.location.longitude),
              details: p.editorialSummary ? p.editorialSummary.text : '',
              service_types: service_types,
              opening_hours: p.regularOpeningHours ? p.regularOpeningHours.weekdayDescriptions : undefined,
              phone: p.formattedPhoneNumber || '',
              operator: undefined, // 新版API暂时无operator字段
            };
            allStations.set(p.id, station);
            // 实时写入
            fs.writeFileSync(OUTPUT_PATH, JSON.stringify(Array.from(allStations.values()), null, 2));
            console.log('已抓取油站:', station.name, station.address);
            await sleep(100); // 限速
          }
        } catch (e) {
          console.error('抓取失败:', e);
        }
      }
    }
  }
  // 输出主数据
  const stationsArr = Array.from(allStations.values());
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(stationsArr, null, 2));
  // 输出报告
  const withPhotos = stationsArr.filter(s => s.photoUrl);
  const withoutPhotos = stationsArr.filter(s => !s.photoUrl);
  fs.writeFileSync(REPORT_WITH_PHOTOS, JSON.stringify(withPhotos, null, 2));
  fs.writeFileSync(REPORT_WITHOUT_PHOTOS, JSON.stringify(withoutPhotos, null, 2));
  console.log(`总油站数: ${stationsArr.length}, 有照片: ${withPhotos.length}, 无照片: ${withoutPhotos.length}`);
}

main(); 