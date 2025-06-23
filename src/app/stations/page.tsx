'use client';
export const dynamic = "force-dynamic";
import Image from "next/image";
import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import BottomNav from "../../components/BottomNav";
import StationDetailsModal from "../../components/StationDetailsModal";

function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const PAGE_SIZE = 5;

function capitalizeBrand(brand: string) {
  if (!brand) return '';
  return brand.charAt(0).toUpperCase() + brand.slice(1).toLowerCase();
}

function getFullStationName(station: any) {
  if (!station) return '';
  if (!station.brand) return station.name;
  const brand = capitalizeBrand(station.brand.trim());
  if (
    station.name.trim().toLowerCase() === station.brand.trim().toLowerCase() &&
    station.address
  ) {
    return `${brand} ${station.address.split(',')[0]}`;
  }
  return station.name && !station.name.toLowerCase().includes(station.brand.toLowerCase())
    ? `${brand} ${station.name}`
    : station.name;
}

export default function StationsPage() {
  const [allStations, setAllStations] = useState<any[]>([]);
  const [displayedStations, setDisplayedStations] = useState<any[]>([]);
  const [searchArea, setSearchArea] = useState("");
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [loadedCount, setLoadedCount] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(true);
  const [selectedStation, setSelectedStation] = useState<any | null>(null);

  const searchParams = useSearchParams();
  const brandFilter = searchParams.get('brand');

  useEffect(() => {
    setLoading(true);
    fetch('/stations.json')
      .then(res => res.json())
      .then((data) => {
        setAllStations(data);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        err => {
          setUserLocation(null);
          alert('Unable to get your location. Please enable location for accurate distance.');
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  }, []);

  const filteredAndSortedStations = useMemo(() => {
    let processed = [...allStations];
    if (brandFilter) {
      processed = processed.filter(s => s.brand?.toLowerCase() === brandFilter.toLowerCase());
    }
    if (searchArea.trim()) {
      const searchTerm = searchArea.toLowerCase();
      processed = processed.filter(s =>
        s.address?.toLowerCase().includes(searchTerm) ||
        s.name?.toLowerCase().includes(searchTerm)
      );
    }
    if (userLocation) {
      processed = processed.map(s => ({
        ...s,
        _distance: s.location?.lat && s.location?.lng
          ? getDistanceFromLatLonInKm(userLocation.lat, userLocation.lng, s.location.lat, s.location.lng)
          : null,
      })).sort((a, b) => {
        if (a._distance === null) return 1;
        if (b._distance === null) return -1;
        return a._distance - b._distance;
      });
    }
    return processed;
  }, [allStations, searchArea, brandFilter, userLocation]);

  useEffect(() => {
    setLoadedCount(PAGE_SIZE);
  }, [searchArea, brandFilter]);

  useEffect(() => {
    setDisplayedStations(filteredAndSortedStations.slice(0, loadedCount));
  }, [filteredAndSortedStations, loadedCount]);

  const handleLoadMore = () => {
    setLoadedCount(prev => prev + PAGE_SIZE);
  };
  
  const handleSearch = () => {};

  const hasMoreToLoad = displayedStations.length < filteredAndSortedStations.length;
  const noResults = !loading && filteredAndSortedStations.length === 0;
  const allResultsLoaded = !loading && filteredAndSortedStations.length > 0 && !hasMoreToLoad;

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 pb-32">
      <h1 className="text-2xl font-bold text-blue-800 mb-6" style={{ fontFamily: 'var(--font-audiowide)' }}>
        {brandFilter ? `${brandFilter} Stations` : 'Petrol Stations'}
      </h1>
      <div className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Please enter area"
            value={searchArea}
            onChange={(e) => setSearchArea(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            style={{ fontFamily: 'var(--font-exo)' }}
          />
          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 ease-in-out hover:shadow-lg"
            style={{ fontFamily: 'var(--font-exo)' }}
          >
            Search
          </button>
        </div>
      </div>
      {loading ? (
        <div className="text-center py-8 text-gray-400">Loading stations...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4">
            {displayedStations.map((station, idx) => (
              <div
                key={station.place_id || station.name + idx}
                className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition-all duration-300 ease-in-out cursor-pointer"
                onClick={() => setSelectedStation(station)}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <Image 
                      src={station.photoUrl || `/brands/${station.brand?.toLowerCase() || 'petronas'}.png`} 
                      alt={station.brand || 'brand'} 
                      width={60} 
                      height={60} 
                      className="rounded-lg"
                      onError={(e) => { e.currentTarget.src = '/brands/default.png'; }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1" style={{ fontFamily: 'var(--font-exo)' }}>
                      {getFullStationName(station)}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2" style={{ fontFamily: 'var(--font-exo)' }}>
                      {station.address}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500" style={{ fontFamily: 'var(--font-exo)' }}>
                        {userLocation
                          ? (station._distance != null ? `${station._distance.toFixed(1)} km away` : 'Distance unknown')
                          : 'Enable location for accurate distance'}
                      </span>
                      <span 
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          station.isOpen !== false
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                        style={{ fontFamily: 'var(--font-exo)' }}
                      >
                        {station.isOpen !== false ? 'OPEN' : 'CLOSED'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {noResults && (
            <div className="text-center py-8">
              <p className="text-gray-500" style={{ fontFamily: 'var(--font-exo)' }}>
                No stations found.
              </p>
            </div>
          )}

          {hasMoreToLoad && (
            <div className="flex justify-center mt-6">
              <button
                onClick={handleLoadMore}
                className="px-8 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all duration-300 ease-in-out"
                style={{ fontFamily: 'var(--font-exo)' }}
              >
                Load More
              </button>
            </div>
          )}

          {allResultsLoaded && (
            <div className="text-center py-6 text-gray-500" style={{ fontFamily: 'var(--font-exo)' }}>
              No more stations found.
            </div>
          )}
        </>
      )}
      <BottomNav />
      
      <StationDetailsModal 
        station={selectedStation} 
        onClose={() => setSelectedStation(null)} 
      />
    </div>
  );
} 