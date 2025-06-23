// 批量为每个油站获取Google照片链接并写入photoUrl字段
const fs = require('fs');
const fetch = require('node-fetch');

const API_KEY = 'AIzaSyBt-TRRDiaKsU2URRLCaJaMcwkgfMprIBE';
const INPUT_PATH = '../public/stations.json';
const OUTPUT_PATH = '../public/stations.json';

async function getPlaceId(station) {
  // 只用品牌+地名+Malaysia
  // 尝试用品牌+name的第一个词+Malaysia，品牌+name+Malaysia，品牌+Malaysia
  const nameMain = station.name.split(' ')[0];
  const queries = [
    `${station.brand} ${nameMain} Malaysia`,
    `${station.brand} ${station.name} Malaysia`,
    `${station.brand} Malaysia`
  ];
  for (let query of queries) {
    const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(query)}&inputtype=textquery&fields=place_id&key=${API_KEY}`;
    console.log('  尝试关键词:', query);
    const res = await fetch(url);
    const data = await res.json();
    if (data.candidates && data.candidates.length > 0) {
      return data.candidates[0].place_id;
    }
  }
  return null;
}

async function getPhotoReference(placeId) {
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=photo&key=${API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.result && data.result.photos && data.result.photos.length > 0) {
    return data.result.photos[0].photo_reference;
  }
  return null;
}

function getPhotoUrl(photoReference) {
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${API_KEY}`;
}

async function main() {
  let stations = JSON.parse(fs.readFileSync(INPUT_PATH, 'utf-8'));
  for (let i = 0; i < stations.length; i++) {
    const station = stations[i];
    if (station.photoUrl) continue; // 已有照片跳过
    try {
      console.log(`查找: ${station.name} ${station.address || ''}`);
      const placeId = await getPlaceId(station);
      if (placeId) {
        const photoRef = await getPhotoReference(placeId);
        if (photoRef) {
          station.photoUrl = getPhotoUrl(photoRef);
          console.log(`  √ 获取到照片`);
        } else {
          console.log('  × 没有照片');
        }
      } else {
        console.log('  × 没有找到place_id');
      }
    } catch (e) {
      console.log('  × 错误:', e.message);
    }
    // 可选：每10个保存一次，防止中断丢失
    if (i % 10 === 0) {
      fs.writeFileSync(OUTPUT_PATH, JSON.stringify(stations, null, 2));
    }
  }
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(stations, null, 2));
  console.log('全部完成！');
}

main(); 