'use client';
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "../../components/BottomNav";

const brands = [
  {
    name: "Petronas",
    logo: "/brands/petronas.png",
    desc: "Malaysia's national oil company and the largest fuel retailer in the country.",
    details: [
      "Founded in 1974 by the Malaysian government as Petroliam Nasional Berhad (Petronas).",
      "Wholly owned by the Government of Malaysia and ranked among the Fortune Global 500's largest corporations.",
      "Operates more than 1,000 petrol stations nationwide, making it the largest fuel retailer in Malaysia.",
      "Petronas is not only a leader in the domestic market but also a global player, with operations in over 50 countries.",
      "The company is known for its involvement in Formula One as the title sponsor of the Mercedes-AMG Petronas F1 Team, and for its iconic Petronas Twin Towers in Kuala Lumpur.",
      "Petronas has played a crucial role in Malaysia's economic development, investing heavily in education, technology, and community outreach programs."
    ],
  },
  {
    name: "Shell",
    logo: "/brands/shell.png",
    desc: "A global energy company with a strong presence in Malaysia.",
    details: [
      "Shell entered Malaysia in 1891, making it one of the oldest oil companies in the country.",
      "Shell Malaysia is a subsidiary of Royal Dutch Shell, founded by Marcus Samuel in the late 19th century.",
      "Operates over 950 stations nationwide, providing a wide range of fuels and services.",
      "Shell is recognized for its innovation in fuels and lubricants, and for introducing the Shell V-Power brand.",
      "The company has a long history of supporting local communities, education, and environmental initiatives in Malaysia.",
      "Shell's iconic yellow and red logo is one of the most recognized fuel brands in the world."
    ],
  },
  {
    name: "Petron",
    logo: "/brands/petron.png",
    desc: "A major fuel provider in Malaysia, formerly known as Esso.",
    details: [
      "Petron Malaysia is part of Petron Corporation, the largest oil company in the Philippines.",
      "Entered Malaysia in 2012 after acquiring ExxonMobil's downstream business, including the Esso and Mobil brands.",
      "Operates over 600 stations in Malaysia, offering a variety of fuels and convenience services.",
      "Petron is known for its commitment to customer service and for its Petron Miles loyalty program.",
      "The company invests in community development, road safety campaigns, and environmental sustainability."
    ],
  },
  {
    name: "Caltex",
    logo: "/brands/caltex.png",
    desc: "A well-known fuel brand operated by Chevron in Malaysia.",
    details: [
      "Caltex is a petroleum brand of Chevron, founded in 1936 as the California Texas Oil Company.",
      "Present in Malaysia for decades, Caltex has built a reputation for quality fuels and customer service.",
      "Operates more than 420 stations nationwide, providing Techron®-enhanced fuels.",
      "Caltex is committed to innovation, safety, and environmental responsibility.",
      "The brand is recognized for its star logo and its long-standing presence in the Asia-Pacific region."
    ],
  },
  {
    name: "BHPetrol",
    logo: "/brands/bhpetrol.png",
    desc: "A local Malaysian fuel brand with a growing network of stations.",
    details: [
      "Boustead Petroleum Marketing Sdn Bhd (BHPetrol) was established in 2006 as a subsidiary of Boustead Holdings Berhad.",
      "Operates over 400 stations across Malaysia, focusing on high-performance fuels and customer experience.",
      "BHPetrol is known for its Infiniti fuels, which are formulated for better engine performance and efficiency.",
      "The company is active in community engagement, road safety, and environmental initiatives.",
      "BHPetrol's orange branding and modern station designs are easily recognizable throughout Malaysia."
    ],
  },
  {
    name: "PetroGreen",
    logo: "/brands/petrogreen.png",
    desc: "A newer, eco-friendly fuel brand in Malaysia.",
    details: [
      "PetroGreen is a recent entrant in the Malaysian fuel market, focusing on environmentally friendly fuels and sustainable practices.",
      "The brand is expanding its network of stations, especially in urban areas and green corridors.",
      "PetroGreen invests in renewable energy, carbon offset programs, and green technology.",
      "The company aims to set new standards for sustainability and customer experience in the fuel industry."
    ],
  },
  {
    name: "Mobil",
    logo: "/brands/mobil.png",
    desc: "A historic global fuel brand, formerly present in Malaysia.",
    details: [
      "Mobil was a major international oil company, originally known as the Socony-Vacuum Oil Company.",
      "Mobil operated many stations in Malaysia before merging with Esso and later being acquired by ExxonMobil.",
      "The Mobil brand is now less common in Malaysia but remains globally recognized for its fuels and lubricants.",
      "Mobil is known for its innovation in synthetic lubricants and its iconic Pegasus logo.",
      "Mobil's history in Malaysia dates back to the early 20th century, playing a key role in the country's fuel retail sector for decades."
    ],
  },
  {
    name: "Esso",
    logo: "/brands/esso.png",
    desc: "A classic fuel brand, now part of Petron in Malaysia.",
    details: [
      "Esso was the brand name of ExxonMobil's downstream operations in Malaysia for decades.",
      "In 2012, Petron acquired Esso Malaysia Berhad, and most Esso stations were rebranded as Petron.",
      "Esso is still recognized for its heritage and the 'Put a Tiger in Your Tank' campaign.",
      "Globally, Esso remains a key brand under ExxonMobil.",
      "Esso's presence in Malaysia began in the early 1900s, contributing to the country's fuel infrastructure and economic growth.",
      "The brand was known for its high-quality fuels, innovative marketing, and community engagement.",
      "Esso's legacy continues through Petron's operations and the continued use of Esso-branded lubricants in the region."
    ],
  },
  {
    name: "Projet",
    logo: "/brands/projet.png",
    desc: "A former Malaysian fuel brand, now part of Shell.",
    details: [
      "Projet was a local Malaysian fuel brand established in the 1990s.",
      "In 2007, Shell acquired Projet and rebranded all Projet stations to Shell.",
      "Projet was known for its competitive pricing and simple station design.",
      "The brand is now part of Malaysia's fuel retail history.",
      "Projet played a role in increasing competition and driving innovation in the Malaysian fuel market during its existence.",
      "The brand was recognized for its distinctive green and white color scheme and straightforward service offerings.",
      "Many former Projet stations are now modern Shell outlets, continuing to serve communities across Malaysia."
    ],
  },
  {
    name: "KPD",
    logo: "/brands/kpd.png",
    desc: "A regional fuel brand in East Malaysia.",
    details: [
      "KPD is a local fuel brand operating mainly in Sabah, East Malaysia.",
      "It is managed by Koperasi Pembangunan Desa (KPD), a rural development cooperative.",
      "KPD stations serve rural and semi-urban communities, supporting local economic growth.",
      "The brand is recognized for its community focus and regional presence.",
      "KPD was established to improve fuel accessibility and affordability in less urbanized areas of Sabah.",
      "The cooperative model allows KPD to reinvest profits into local development and social programs.",
      "KPD continues to expand its network, providing essential services to remote and underserved communities."
    ],
  },
];

export default function BrandPage() {
  const [selected, setSelected] = useState<null | typeof brands[0]>(null);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const router = useRouter();

  // Get user location
  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        err => setUserLocation(null),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  }, []);

  // Handle Stations Near Me click
  const handleStationsNearMe = (brandName: string) => {
    // Navigate using URL query parameters
    router.push(`/stations?brand=${brandName}`);
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 pb-32">
      <h1 className="text-2xl font-bold text-blue-800 mb-6" style={{ fontFamily: 'var(--font-audiowide)' }}>Major Petrol Brands in Malaysia</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {brands.map((brand) => (
          <button
            key={brand.name}
            className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center border border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-105 hover:border-blue-200 cursor-pointer transform active:scale-95 card-hover ripple-effect"
            onClick={() => setSelected(brand)}
            tabIndex={0}
          >
            <Image src={brand.logo} alt={brand.name} width={80} height={80} className="mb-2" />
            <div className="text-gray-600 text-sm text-center" style={{ fontFamily: 'var(--font-exo)' }}>{brand.desc}</div>
          </button>
        ))}
      </div>
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 pb-20 sm:pb-32"
          onClick={() => setSelected(null)}
        >
          <div
            className="backdrop-blur-lg bg-white/60 border border-white/40 shadow-2xl max-w-md w-full mx-4 p-6 relative rounded-2xl transition-all duration-1000 ease-out animate-fadein"
            style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)', marginTop: '16px' }}
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-white bg-blue-700/90 hover:bg-blue-900/90 rounded-full w-10 h-10 flex items-center justify-center text-3xl font-bold shadow-lg transition"
              onClick={() => setSelected(null)}
              aria-label="Close"
              style={{ lineHeight: 1 }}
            >
              ×
            </button>
            <div className="flex flex-col items-center">
              <Image src={selected.logo} alt={selected.name} width={80} height={80} className="mb-2" />
              <ul className="text-gray-700 text-sm text-left list-disc pl-6 whitespace-pre-line mb-4" style={{ fontFamily: 'var(--font-exo)' }}>
                {selected.details.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
              {/* Stations Near Me 按钮 */}
              <button
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-105 card-hover"
                onClick={() => handleStationsNearMe(selected.name)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/>
                </svg>
                Stations Near Me
              </button>
            </div>
          </div>
        </div>
      )}
      <BottomNav />
    </div>
  );
} 