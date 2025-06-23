const fs = require('fs');
const file = './public/stations.json';
const stations = JSON.parse(fs.readFileSync(file, 'utf-8'));
stations.forEach(station => {
  if (station.rating === undefined) station.rating = 4.0;
  if (station.operator === undefined) station.operator = '';
  if (station.details === undefined) station.details = '';
});
fs.writeFileSync(file, JSON.stringify(stations, null, 2), 'utf-8');
console.log('All stations updated!'); 