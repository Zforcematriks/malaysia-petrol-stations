'use client';
import React, { useState, useEffect } from "react";
import BottomNav from "../../components/BottomNav";
import Image from "next/image";

type FuelPrice = {
  ron95: number;
  ron97: number;
  diesel: number;
};

type PriceData = {
  latest: FuelPrice | null;
  previous: FuelPrice | null;
};

type FuelProduct = {
  name: string;
  type: 'ron97' | 'ron95' | 'diesel' | 'ron100';
  price?: number;
};

type Brand = {
  name: string;
  logo: string;
  color: string;
  textColor: string;
  products: FuelProduct[];
};

const PriceFluctuation = ({ productType, prices }: { productType: FuelProduct['type'], prices: PriceData | null }) => {
  if (!prices || !prices.latest || !prices.previous || productType === 'ron100') {
    return <div className="w-16 h-4"></div>; // Keep space consistent for layout
  }

  // Ensure the keys exist before trying to access them
  const latestPrice = productType in prices.latest ? prices.latest[productType as keyof FuelPrice] : undefined;
  const previousPrice = productType in prices.previous ? prices.previous[productType as keyof FuelPrice] : undefined;
  
  if (latestPrice === undefined || previousPrice === undefined) {
    return <div className="w-16 h-4"></div>;
  }

  const diff = latestPrice - previousPrice;

  // If difference is negligible (floating point errors)
  if (Math.abs(diff) < 0.001) {
    return <div className="w-16 h-4"></div>; // Return an empty placeholder
  }

  const isIncrease = diff > 0;
  const color = isIncrease ? 'text-red-300' : 'text-green-300';
  const arrow = isIncrease ? '▲' : '▼';

  return (
    <div className={`flex items-center text-sm font-semibold ${color} bg-black/20 px-2 py-0.5 rounded-md`}>
        <span>{arrow}</span>
        <span className="ml-1">{Math.abs(diff).toFixed(2)}</span>
    </div>
  );
};

const brandsData: Brand[] = [
  {
    name: "Petronas",
    logo: "/brands/petronas.png",
    color: "rgba(0, 128, 128, 0.9)",
    textColor: "text-white",
    products: [
      { name: "PRIMAX 97", type: "ron97" },
      { name: "PRIMAX 95", type: "ron95" },
      { name: "Dynamic Diesel", type: "diesel" },
    ],
  },
  {
    name: "Shell",
    logo: "/brands/shell.png",
    color: "rgba(255, 215, 0, 0.9)",
    textColor: "text-black",
    products: [
      { name: "V-Power 97", type: "ron97" },
      { name: "FuelSave 95", type: "ron95" },
      { name: "FuelSave Diesel", type: "diesel" },
    ],
  },
  {
    name: "Petron",
    logo: "/brands/petron.png",
    color: "rgba(0, 56, 168, 0.9)",
    textColor: "text-white",
    products: [
      { name: "Blaze 100", type: "ron100", price: 5.00 }, // RON100 is not regulated, price is an example
      { name: "Blaze 97", type: "ron97" },
      { name: "Blaze 95", type: "ron95" },
      { name: "Turbo Diesel", type: "diesel" },
    ],
  },
  {
    name: "Caltex",
    logo: "/brands/caltex.png",
    color: "rgba(227, 24, 55, 0.9)",
    textColor: "text-white",
    products: [
      { name: "Techron 97", type: "ron97" },
      { name: "Techron 95", type: "ron95" },
      { name: "Power Diesel", type: "diesel" },
    ],
  },
  {
    name: "BHPetrol",
    logo: "/brands/bhpetrol.png",
    color: "rgba(255, 102, 0, 0.9)",
    textColor: "text-white",
    products: [
      { name: "Infiniti RON97", type: "ron97" },
      { name: "Infiniti RON95", type: "ron95" },
      { name: "Infiniti Diesel", type: "diesel" },
    ],
  },
];

export default function PricesPage() {
  const [prices, setPrices] = useState<PriceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/fuel-prices')
      .then(response => {
        if (!response.ok) {
          return response.json().then(err => { throw err; });
        }
        return response.json();
      })
      .then(data => {
        if (data.error) {
          throw data;
        }
        setPrices(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching fuel prices. API responded with:", error);
        setLoading(false);
      });
  }, []);

  const getPriceForProduct = (product: FuelProduct) => {
    if (product.price) return product.price.toFixed(2);
    if (!prices || !prices.latest) return "N/A";
    switch (product.type) {
      case "ron95": return prices.latest.ron95.toFixed(2);
      case "ron97": return prices.latest.ron97.toFixed(2);
      case "diesel": return prices.latest.diesel.toFixed(2);
      default: return "N/A";
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 pb-32">
      <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'var(--font-audiowide)' }}>
        Fuel Prices
      </h1>
      <p className="text-sm text-gray-600 mb-8">
        Live weekly fuel prices for major petrol brands in Malaysia.
      </p>

      {loading ? (
        <div className="text-center text-gray-500">Loading latest prices...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {brandsData.map((brand) => (
            <div
              key={brand.name}
              className="rounded-2xl shadow-lg overflow-hidden"
              style={{ backgroundColor: brand.color }}
            >
              <div className="p-6 flex items-center justify-between bg-black/10">
                <h2 className={`text-2xl font-bold ${brand.textColor}`}>{brand.name}</h2>
                <Image src={brand.logo} alt={`${brand.name} logo`} width={60} height={60} className="rounded-full bg-white p-1" />
              </div>
              <div className="p-6">
                <ul className="space-y-4">
                  {brand.products.map((product) => (
                    <li key={product.name} className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="font-bold text-lg text-white">{product.name}</div>
                        <span className="ml-2 text-xs uppercase font-semibold bg-white/20 text-white px-2 py-1 rounded-full">
                          {product.type}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-baseline bg-black/20 px-3 py-1 rounded-lg">
                            <span className="text-lg font-bold font-mono text-white/90 mr-1">RM</span>
                            <span className="text-2xl font-bold font-mono text-white">{getPriceForProduct(product)}</span>
                            <span className="text-base font-mono text-white/70 ml-1">/L</span>
                        </div>
                        <PriceFluctuation productType={product.type} prices={prices} />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
      <BottomNav />
    </div>
  );
} 