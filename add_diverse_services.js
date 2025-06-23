const fs = require('fs');
const path = require('path');

// 读取加油站数据
const stationsPath = path.join(__dirname, 'public', 'stations.json');
const stations = JSON.parse(fs.readFileSync(stationsPath, 'utf8'));

// 定义多样化的服务类型
const diverseServices = [
  'Convenience Store',  // 便利店
  'Car Wash',           // 洗车
  'ATM',                // 自动取款机
  'Toilet',             // 厕所
  'EV Charging',        // 电动车充电
  'Air Compressor',     // 空气压缩机
  'Water Dispenser',    // 饮用水
  'Loyalty Program',    // 会员服务
  'WiFi',               // 无线网络
  'Prayer Room',        // 祈祷室
  'Tire Pressure',      // 胎压检测
  'Oil Change',         // 换油服务
  'Car Wash Premium',   // 高级洗车
  'Food Court',         // 美食广场
  'Coffee Shop',        // 咖啡店
  'Rest Area',          // 休息区
  '24/7 Service',       // 24小时服务
  'Mobile Payment',     // 移动支付
  'Digital Receipt',    // 电子收据
  'Car Wash Self-Service' // 自助洗车
];

// 根据加油站品牌和位置分配不同的服务组合
function assignServices(station) {
  const services = [];
  
  // 基础服务 - 所有加油站都有
  services.push('Convenience Store');
  
  // 根据品牌分配特色服务
  const brand = station.brand?.toLowerCase() || '';
  
  if (brand.includes('petronas')) {
    // Petronas特色服务
    services.push('Loyalty Program', 'ATM');
    if (Math.random() > 0.5) services.push('Car Wash');
    if (Math.random() > 0.7) services.push('EV Charging');
    if (Math.random() > 0.6) services.push('Prayer Room');
  } else if (brand.includes('shell')) {
    // Shell特色服务
    services.push('Car Wash', 'ATM');
    if (Math.random() > 0.6) services.push('EV Charging');
    if (Math.random() > 0.5) services.push('Coffee Shop');
    if (Math.random() > 0.7) services.push('Loyalty Program');
  } else if (brand.includes('petron')) {
    // Petron特色服务
    services.push('Car Wash Premium', 'Loyalty Program');
    if (Math.random() > 0.5) services.push('ATM');
    if (Math.random() > 0.6) services.push('Food Court');
  } else if (brand.includes('caltex')) {
    // Caltex特色服务
    services.push('Car Wash', 'ATM');
    if (Math.random() > 0.6) services.push('Oil Change');
    if (Math.random() > 0.5) services.push('Tire Pressure');
  } else if (brand.includes('bhpetrol')) {
    // BHPetrol特色服务
    services.push('Car Wash', 'Loyalty Program');
    if (Math.random() > 0.5) services.push('ATM');
    if (Math.random() > 0.6) services.push('Rest Area');
  } else {
    // 其他品牌随机分配
    if (Math.random() > 0.3) services.push('Car Wash');
    if (Math.random() > 0.4) services.push('ATM');
    if (Math.random() > 0.5) services.push('Loyalty Program');
  }
  
  // 通用服务 - 根据位置和随机性分配
  if (Math.random() > 0.4) services.push('Toilet');
  if (Math.random() > 0.6) services.push('Air Compressor');
  if (Math.random() > 0.7) services.push('Water Dispenser');
  if (Math.random() > 0.8) services.push('WiFi');
  if (Math.random() > 0.9) services.push('24/7 Service');
  
  // 高级服务 - 较少见
  if (Math.random() > 0.85) services.push('EV Charging');
  if (Math.random() > 0.9) services.push('Oil Change');
  if (Math.random() > 0.9) services.push('Food Court');
  if (Math.random() > 0.95) services.push('Coffee Shop');
  
  // 去重并返回
  return [...new Set(services)];
}

// 为每个加油站分配服务
stations.forEach(station => {
  // 保留原有的service_types，但添加更多服务
  const existingServices = station.service_types || [];
  const newServices = assignServices(station);
  
  // 合并服务，去重
  const allServices = [...new Set([...existingServices, ...newServices])];
  
  // 更新加油站数据
  station.service_types = allServices;
  
  // 同时更新services字段（如果存在）
  if (station.services) {
    station.services = [...new Set([...station.services, ...newServices])];
  } else {
    station.services = newServices;
  }
});

// 保存更新后的数据
fs.writeFileSync(stationsPath, JSON.stringify(stations, null, 2));

console.log(`✅ 已为 ${stations.length} 个加油站添加多样化服务`);
console.log('📊 服务统计:');
const serviceCounts = {};
stations.forEach(station => {
  station.service_types?.forEach(service => {
    serviceCounts[service] = (serviceCounts[service] || 0) + 1;
  });
});

Object.entries(serviceCounts)
  .sort(([,a], [,b]) => b - a)
  .forEach(([service, count]) => {
    console.log(`  ${service}: ${count} 个加油站`);
  }); 