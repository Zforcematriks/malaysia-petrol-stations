const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

(async () => {
  const stations = JSON.parse(fs.readFileSync(path.join(__dirname, '../public/stations.json'), 'utf-8'));
  const invalid = [];
  let checked = 0;
  for (const s of stations) {
    if (!s.photoUrl || !s.photoUrl.trim()) continue;
    try {
      const res = await fetch(s.photoUrl, { method: 'HEAD' });
      if (!res.ok) {
        invalid.push({ name: s.name, address: s.address, photoUrl: s.photoUrl, status: res.status });
        console.log('无效图片:', s.name, s.photoUrl, res.status);
      }
    } catch (e) {
      invalid.push({ name: s.name, address: s.address, photoUrl: s.photoUrl, error: e.message });
      console.log('无效图片:', s.name, s.photoUrl, e.message);
    }
    checked++;
    if (checked % 50 === 0) console.log(`已检测${checked}条...`);
  }
  fs.writeFileSync(path.join(__dirname, '../public/invalid_photos_report.json'), JSON.stringify(invalid, null, 2));
  console.log('检测完成，无效图片数:', invalid.length);
})(); 