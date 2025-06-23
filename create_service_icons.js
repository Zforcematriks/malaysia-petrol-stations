const fs = require('fs');
const path = require('path');

// 服务图标定义
const serviceIcons = {
  // 基础服务
  'Convenience Store': `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="8" width="24" height="20" rx="2" stroke="#374151" stroke-width="2" fill="none"/>
    <rect x="8" y="12" width="4" height="4" fill="#374151"/>
    <rect x="14" y="12" width="4" height="4" fill="#374151"/>
    <rect x="20" y="12" width="4" height="4" fill="#374151"/>
    <rect x="8" y="18" width="4" height="4" fill="#374151"/>
    <rect x="14" y="18" width="4" height="4" fill="#374151"/>
    <rect x="20" y="18" width="4" height="4" fill="#374151"/>
    <path d="M4 8h24" stroke="#374151" stroke-width="2"/>
  </svg>`,
  
  'Car Wash': `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="10" width="20" height="12" rx="2" stroke="#374151" stroke-width="2" fill="none"/>
    <circle cx="10" cy="16" r="2" fill="#374151"/>
    <circle cx="22" cy="16" r="2" fill="#374151"/>
    <path d="M8 6l2 4M16 6l2 4M24 6l2 4" stroke="#374151" stroke-width="2"/>
  </svg>`,
  
  'ATM': `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="6" width="16" height="20" rx="2" stroke="#374151" stroke-width="2" fill="none"/>
    <rect x="12" y="10" width="8" height="6" fill="#374151"/>
    <circle cx="16" cy="20" r="1" fill="#374151"/>
  </svg>`,
  
  'Toilet': `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="8" width="16" height="16" rx="2" stroke="#374151" stroke-width="2" fill="none"/>
    <circle cx="16" cy="12" r="2" fill="#374151"/>
    <rect x="12" y="16" width="8" height="4" fill="#374151"/>
  </svg>`,
  
  'EV Charging': `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="8" width="20" height="16" rx="2" stroke="#374151" stroke-width="2" fill="none"/>
    <path d="M12 12l4-4v6l4-4" stroke="#374151" stroke-width="2" fill="none"/>
    <path d="M8 20h16" stroke="#374151" stroke-width="2"/>
  </svg>`,
  
  'Air Compressor': `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="8" stroke="#374151" stroke-width="2" fill="none"/>
    <path d="M16 8v16M8 16h16" stroke="#374151" stroke-width="2"/>
  </svg>`,
  
  'Water Dispenser': `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="12" y="6" width="8" height="20" rx="1" stroke="#374151" stroke-width="2" fill="none"/>
    <path d="M14 12h4M14 16h4M14 20h4" stroke="#374151" stroke-width="2"/>
  </svg>`,
  
  'Loyalty Program': `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="10" width="16" height="12" rx="2" stroke="#374151" stroke-width="2" fill="none"/>
    <path d="M12 14h8M12 18h6" stroke="#374151" stroke-width="2"/>
    <circle cx="20" cy="18" r="1" fill="#374151"/>
  </svg>`,
  
  'WiFi': `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 20c4-4 12-4 16 0" stroke="#374151" stroke-width="2" fill="none"/>
    <path d="M12 16c2-2 6-2 8 0" stroke="#374151" stroke-width="2" fill="none"/>
    <circle cx="16" cy="24" r="1" fill="#374151"/>
  </svg>`,
  
  'Prayer Room': `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="8" width="20" height="16" rx="2" stroke="#374151" stroke-width="2" fill="none"/>
    <path d="M16 8v16M10 12h12" stroke="#374151" stroke-width="2"/>
  </svg>`,
  
  'Tire Pressure': `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="8" stroke="#374151" stroke-width="2" fill="none"/>
    <path d="M16 8v16M8 16h16" stroke="#374151" stroke-width="2"/>
    <circle cx="16" cy="16" r="2" fill="#374151"/>
  </svg>`,
  
  'Oil Change': `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="12" width="16" height="8" rx="1" stroke="#374151" stroke-width="2" fill="none"/>
    <path d="M12 8l8 4v8l-8 4" stroke="#374151" stroke-width="2" fill="none"/>
  </svg>`,
  
  'Car Wash Premium': `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="10" width="20" height="12" rx="2" stroke="#374151" stroke-width="2" fill="none"/>
    <circle cx="10" cy="16" r="2" fill="#374151"/>
    <circle cx="22" cy="16" r="2" fill="#374151"/>
    <path d="M8 6l2 4M16 6l2 4M24 6l2 4" stroke="#374151" stroke-width="2"/>
    <path d="M6 26l20 0" stroke="#374151" stroke-width="2"/>
  </svg>`,
  
  'Food Court': `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="8" width="24" height="16" rx="2" stroke="#374151" stroke-width="2" fill="none"/>
    <rect x="8" y="12" width="4" height="4" fill="#374151"/>
    <rect x="14" y="12" width="4" height="4" fill="#374151"/>
    <rect x="20" y="12" width="4" height="4" fill="#374151"/>
    <path d="M8 20h16" stroke="#374151" stroke-width="2"/>
  </svg>`,
  
  'Coffee Shop': `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="10" width="16" height="12" rx="2" stroke="#374151" stroke-width="2" fill="none"/>
    <path d="M12 14h8M12 18h6" stroke="#374151" stroke-width="2"/>
    <path d="M24 12l2 2v4l-2 2" stroke="#374151" stroke-width="2" fill="none"/>
  </svg>`,
  
  'Rest Area': `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="8" width="20" height="16" rx="2" stroke="#374151" stroke-width="2" fill="none"/>
    <rect x="10" y="12" width="4" height="4" fill="#374151"/>
    <rect x="18" y="12" width="4" height="4" fill="#374151"/>
    <path d="M10 20h12" stroke="#374151" stroke-width="2"/>
  </svg>`,
  
  '24/7 Service': `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="8" stroke="#374151" stroke-width="2" fill="none"/>
    <path d="M16 8v8l6 6" stroke="#374151" stroke-width="2" fill="none"/>
    <path d="M8 16h16" stroke="#374151" stroke-width="2"/>
  </svg>`,
  
  'Mobile Payment': `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="8" width="16" height="16" rx="2" stroke="#374151" stroke-width="2" fill="none"/>
    <rect x="12" y="12" width="8" height="4" fill="#374151"/>
    <circle cx="16" cy="20" r="1" fill="#374151"/>
  </svg>`,
  
  'Digital Receipt': `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="6" width="16" height="20" rx="1" stroke="#374151" stroke-width="2" fill="none"/>
    <path d="M12 12h8M12 16h6M12 20h8" stroke="#374151" stroke-width="2"/>
  </svg>`,
  
  'Car Wash Self-Service': `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="10" width="20" height="12" rx="2" stroke="#374151" stroke-width="2" fill="none"/>
    <circle cx="10" cy="16" r="2" fill="#374151"/>
    <circle cx="22" cy="16" r="2" fill="#374151"/>
    <path d="M8 6l2 4M16 6l2 4M24 6l2 4" stroke="#374151" stroke-width="2"/>
    <path d="M12 24l8 0" stroke="#374151" stroke-width="2"/>
  </svg>`
};

// 创建amenities图标
const amenitiesPath = path.join(__dirname, 'public', 'amenities');
Object.entries(serviceIcons).forEach(([service, svg]) => {
  const filename = service.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '') + '.svg';
  const filepath = path.join(amenitiesPath, filename);
  fs.writeFileSync(filepath, svg);
  console.log(`✅ Created: amenities/${filename}`);
});

// 创建products图标（复制amenities的图标）
const productsPath = path.join(__dirname, 'public', 'products');
Object.entries(serviceIcons).forEach(([service, svg]) => {
  const filename = service.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '') + '.svg';
  const filepath = path.join(productsPath, filename);
  fs.writeFileSync(filepath, svg);
  console.log(`✅ Created: products/${filename}`);
});

console.log('\n🎉 All service icons created successfully!');
console.log(`📁 Created ${Object.keys(serviceIcons).length} icons in amenities/ and products/ folders`); 