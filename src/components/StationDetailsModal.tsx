'use client';

import Image from "next/image";
import React, { useState } from "react";
import { FaStar, FaMapMarkerAlt, FaRegCopy, FaEllipsisH } from "react-icons/fa";

interface Station {
  name: string;
  address: string;
  photoUrl?: string;
  brand?: string;
  _distance?: number;
  service_types?: string[];
  rating?: number;
  directionsUrl?: string;
  isOpen?: boolean;
  location?: { lat: number; lng: number };
}

interface Props {
  station: Station | null;
  onClose: () => void;
}

// 判断字符串是否包含中文
function isChinese(str: string) {
  return /[\u4e00-\u9fa5]/.test(str);
}

const StationDetailsModal: React.FC<Props> = ({ station, onClose }) => {
  const [showNavOptions, setShowNavOptions] = useState(false);
  const [showEtc, setShowEtc] = useState(false);
  const [copied, setCopied] = useState(false);
  if (!station) return null;

  // 生成导航链接（只用油站名字）
  const gmaps = station.name ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(station.name)}` : undefined;
  const waze = station.name ? `https://waze.com/ul?q=${encodeURIComponent(station.name)}&navigate=yes` : undefined;

  // 过滤掉所有中文服务标签
  const englishServices = (station.service_types || []).filter(s => !isChinese(s));

  // 复制油站名字和地址
  const handleCopy = async () => {
    if (station.name || station.address) {
      await navigator.clipboard.writeText(`${station.name || ''} ${station.address || ''}`.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadein p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-xs w-full mx-auto overflow-hidden transform transition-all duration-300 ease-out-quad animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        <div className="relative">
          <Image 
            src={`/brands/${station.brand}-600x200.jpg`}
            alt={station.name}
            width={600}
            height={200}
            className="w-full h-32 object-cover"
            onError={(e) => { e.currentTarget.src = '/brands/default-600x200.jpg'; }}
          />
        </div>
        
        <div className="p-4">
          <h2 className="text-lg font-bold text-gray-800 mb-2 leading-tight" style={{ fontFamily: 'var(--font-audiowide)' }}>
            {station.name}
          </h2>
          <p className="text-gray-600 mb-3 text-xs" style={{ fontFamily: 'var(--font-exo)' }}>
            {station.address}
          </p>

          <div className="flex items-center justify-between mb-3 text-xs text-gray-700">
            <div className="flex items-center gap-1">
              <FaStar className="text-yellow-400" />
              <span className="font-semibold">{station.rating || 'N/A'} / 5</span>
            </div>
            <div className="flex items-center gap-1">
              <FaMapMarkerAlt className="text-blue-500" />
              <span className="font-semibold">
                {station._distance != null ? `${station._distance.toFixed(1)} km` : 'Unknown'}
              </span>
            </div>
            <div 
              className={`px-2 py-0.5 rounded-full font-semibold ${
                station.isOpen !== false
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {station.isOpen !== false ? 'OPEN' : 'CLOSED'}
            </div>
          </div>
          
          <div className="mb-3">
            <h3 className="font-semibold text-gray-700 mb-1.5 text-xs" style={{ fontFamily: 'var(--font-exo)' }}>Services</h3>
            <div className="flex flex-wrap gap-1.5">
              {englishServices.length > 0 ? (
                englishServices.slice(0, 5).map(service => (
                  <span key={service} className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
                    {service}
                  </span>
                ))
              ) : (
                <p className="text-xs text-gray-500">No services listed.</p>
              )}
            </div>
          </div>

          {/* Directions 按钮和弹窗 */}
          <div className="mb-1">
            <button
              className="block w-full text-center bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-base"
              style={{ fontFamily: 'var(--font-exo)' }}
              onClick={() => setShowNavOptions(true)}
            >
              Directions
            </button>
            {showNavOptions && (
              <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40" onClick={() => setShowNavOptions(false)}>
                <div className="bg-white rounded-xl shadow-lg p-6 w-64 flex flex-col gap-4" onClick={e => e.stopPropagation()}>
                  <h4 className="text-base font-bold mb-2 text-gray-800">Choose Navigation App</h4>
                  <button
                    className="w-full py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
                    onClick={() => { window.open(gmaps, '_blank'); setShowNavOptions(false); }}
                    disabled={!gmaps}
                  >
                    Google Maps
                  </button>
                  <button
                    className="w-full py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
                    onClick={() => { window.open(waze, '_blank'); setShowNavOptions(false); }}
                    disabled={!waze}
                  >
                    Waze
                  </button>
                  <button
                    className="w-full py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition flex items-center justify-center gap-2"
                    onClick={() => setShowEtc(true)}
                  >
                    <FaRegCopy /> Etc
                  </button>
                </div>
              </div>
            )}
            {/* Etc弹窗：显示油站名字和地址，并有Copy Name & Address按钮 */}
            {showEtc && (
              <div className="fixed inset-0 z-70 flex items-center justify-center bg-black/40" onClick={() => setShowEtc(false)}>
                <div className="bg-white rounded-xl shadow-lg p-6 w-72 flex flex-col gap-4" onClick={e => e.stopPropagation()}>
                  <h4 className="text-base font-bold mb-2 text-gray-800">Copy Station Name & Address</h4>
                  <div className="bg-gray-100 rounded p-3 text-xs text-gray-700 break-words select-all">
                    {station.name}<br/>{station.address}
                  </div>
                  <button
                    className="w-full py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
                    onClick={handleCopy}
                  >
                    <FaRegCopy /> {copied ? 'Copied!' : 'Copy Name & Address'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StationDetailsModal; 