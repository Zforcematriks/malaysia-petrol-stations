'use client';

import React, { useState } from 'react';

export default function ApiTestPage() {
  const [results, setResults] = useState<any>({});
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

  const testEndpoints = [
    {
      name: 'Fuel Prices',
      url: `${baseUrl}/api/fuel-prices`,
      description: 'Get current fuel prices'
    },
    {
      name: 'All Stations',
      url: `${baseUrl}/api/stations?limit=5`,
      description: 'Get first 5 stations'
    },
    {
      name: 'Brands',
      url: `${baseUrl}/api/stations/brands`,
      description: 'Get stations grouped by brand'
    },
    {
      name: 'Areas',
      url: `${baseUrl}/api/stations/areas`,
      description: 'Get stations grouped by area'
    },
    {
      name: 'Statistics',
      url: `${baseUrl}/api/stations/stats`,
      description: 'Get station statistics'
    },
    {
      name: 'Search',
      url: `${baseUrl}/api/stations/search?q=petronas&limit=3`,
      description: 'Search for Petronas stations'
    }
  ];

  const testEndpoint = async (endpoint: any) => {
    setLoading(endpoint.name);
    setError(null);
    
    try {
      const response = await fetch(endpoint.url);
      const data = await response.json();
      
      setResults(prev => ({
        ...prev,
        [endpoint.name]: {
          status: response.status,
          data: data,
          timestamp: new Date().toLocaleTimeString()
        }
      }));
    } catch (err) {
      setError(`Error testing ${endpoint.name}: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(null);
    }
  };

  const testAllEndpoints = async () => {
    setLoading('all');
    setError(null);
    
    for (const endpoint of testEndpoints) {
      try {
        const response = await fetch(endpoint.url);
        const data = await response.json();
        
        setResults(prev => ({
          ...prev,
          [endpoint.name]: {
            status: response.status,
            data: data,
            timestamp: new Date().toLocaleTimeString()
          }
        }));
      } catch (err) {
        setResults(prev => ({
          ...prev,
          [endpoint.name]: {
            status: 'ERROR',
            data: { error: err instanceof Error ? err.message : 'Unknown error' },
            timestamp: new Date().toLocaleTimeString()
          }
        }));
      }
    }
    setLoading(null);
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-blue-800 mb-8" style={{ fontFamily: 'var(--font-audiowide)' }}>
        API Test Page
      </h1>

      <div className="mb-8">
        <button
          onClick={testAllEndpoints}
          disabled={loading === 'all'}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 ease-in-out hover:shadow-lg disabled:opacity-50"
          style={{ fontFamily: 'var(--font-exo)' }}
        >
          {loading === 'all' ? 'Testing All...' : 'Test All Endpoints'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800" style={{ fontFamily: 'var(--font-exo)' }}>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {testEndpoints.map((endpoint, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'var(--font-exo)' }}>
                  {endpoint.name}
                </h3>
                <p className="text-gray-600 text-sm" style={{ fontFamily: 'var(--font-exo)' }}>
                  {endpoint.description}
                </p>
              </div>
              <button
                onClick={() => testEndpoint(endpoint)}
                disabled={loading === endpoint.name}
                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition-all duration-300 ease-in-out disabled:opacity-50"
                style={{ fontFamily: 'var(--font-exo)' }}
              >
                {loading === endpoint.name ? 'Testing...' : 'Test'}
              </button>
            </div>
            
            <div className="bg-gray-50 p-3 rounded border mb-4">
              <code className="text-sm font-mono break-all">
                {endpoint.url}
              </code>
            </div>

            {results[endpoint.name] && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    results[endpoint.name].status === 200 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    Status: {results[endpoint.name].status}
                  </span>
                  <span className="text-xs text-gray-500">
                    {results[endpoint.name].timestamp}
                  </span>
                </div>
                
                <div className="bg-gray-50 p-3 rounded border max-h-64 overflow-y-auto">
                  <pre className="text-xs">
                    <code>{JSON.stringify(results[endpoint.name].data, null, 2)}</code>
                  </pre>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-blue-800 mb-4" style={{ fontFamily: 'var(--font-exo)' }}>
          Test Results Summary
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {testEndpoints.map((endpoint, index) => (
            <div key={index} className="text-center">
              <div className={`w-4 h-4 rounded-full mx-auto mb-2 ${
                results[endpoint.name]?.status === 200 
                  ? 'bg-green-500' 
                  : results[endpoint.name] 
                    ? 'bg-red-500' 
                    : 'bg-gray-300'
              }`}></div>
              <span className="text-sm text-gray-600" style={{ fontFamily: 'var(--font-exo)' }}>
                {endpoint.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 