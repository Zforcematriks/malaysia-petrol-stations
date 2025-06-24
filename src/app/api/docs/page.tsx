'use client';

import React from 'react';

export default function ApiDocsPage() {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://your-domain.com';
  
  const apiEndpoints = [
    {
      name: 'Fuel Prices',
      description: 'Get current fuel prices in Malaysia',
      endpoint: `${baseUrl}/api/fuel-prices`,
      method: 'GET',
      response: {
        latest: { ron95: 2.05, ron97: 2.35, diesel: 2.15 },
        previous: { ron95: 2.05, ron97: 2.35, diesel: 2.15 }
      }
    },
    {
      name: 'All Stations',
      description: 'Get all petrol stations with optional filtering',
      endpoint: `${baseUrl}/api/stations`,
      method: 'GET',
      params: [
        { name: 'brand', type: 'string', description: 'Filter by brand (e.g., petronas, shell)' },
        { name: 'area', type: 'string', description: 'Filter by area name' },
        { name: 'limit', type: 'number', description: 'Number of results to return' },
        { name: 'offset', type: 'number', description: 'Number of results to skip' }
      ],
      example: `${baseUrl}/api/stations?brand=petronas&limit=10`
    },
    {
      name: 'Brands',
      description: 'Get stations grouped by brand with counts',
      endpoint: `${baseUrl}/api/stations/brands`,
      method: 'GET',
      response: {
        data: [
          { brand: 'Petronas', count: 1500, stations: [...] },
          { brand: 'Shell', count: 1200, stations: [...] }
        ]
      }
    },
    {
      name: 'Areas',
      description: 'Get stations grouped by area with counts',
      endpoint: `${baseUrl}/api/stations/areas`,
      method: 'GET',
      params: [
        { name: 'state', type: 'string', description: 'Filter by state' },
        { name: 'city', type: 'string', description: 'Filter by city' }
      ],
      example: `${baseUrl}/api/stations/areas?state=selangor`
    },
    {
      name: 'Statistics',
      description: 'Get overall statistics about petrol stations',
      endpoint: `${baseUrl}/api/stations/stats`,
      method: 'GET',
      response: {
        total: 5000,
        open: 4800,
        closed: 200,
        withPhotos: 3000,
        topBrands: [...],
        topAreas: [...]
      }
    },
    {
      name: 'Search',
      description: 'Search stations by name, address, or brand with optional location-based filtering',
      endpoint: `${baseUrl}/api/stations/search`,
      method: 'GET',
      params: [
        { name: 'q', type: 'string', required: true, description: 'Search query' },
        { name: 'lat', type: 'number', description: 'Latitude for distance calculation' },
        { name: 'lng', type: 'number', description: 'Longitude for distance calculation' },
        { name: 'radius', type: 'number', description: 'Search radius in km (default: 50)' },
        { name: 'limit', type: 'number', description: 'Number of results (default: 50)' }
      ],
      example: `${baseUrl}/api/stations/search?q=kuala lumpur&lat=3.1390&lng=101.6869&radius=10`
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-blue-800 mb-8" style={{ fontFamily: 'var(--font-audiowide)' }}>
        Malaysia Petrol Stations API Documentation
      </h1>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-blue-800 mb-4" style={{ fontFamily: 'var(--font-exo)' }}>
          Base URL
        </h2>
        <code className="bg-white px-3 py-2 rounded border text-sm font-mono">
          {baseUrl}/api
        </code>
      </div>

      <div className="space-y-8">
        {apiEndpoints.map((endpoint, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                endpoint.method === 'GET' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {endpoint.method}
              </span>
              <h3 className="text-xl font-semibold text-gray-900" style={{ fontFamily: 'var(--font-exo)' }}>
                {endpoint.name}
              </h3>
            </div>
            
            <p className="text-gray-600 mb-4" style={{ fontFamily: 'var(--font-exo)' }}>
              {endpoint.description}
            </p>
            
            <div className="bg-gray-50 p-4 rounded border mb-4">
              <code className="text-sm font-mono break-all">
                {endpoint.endpoint}
              </code>
            </div>

            {endpoint.params && (
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-2" style={{ fontFamily: 'var(--font-exo)' }}>
                  Parameters:
                </h4>
                <div className="space-y-2">
                  {endpoint.params.map((param, paramIndex) => (
                    <div key={paramIndex} className="flex items-start gap-2">
                      <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">
                        {param.name}
                        {param.required && <span className="text-red-500 ml-1">*</span>}
                      </code>
                      <span className="text-gray-500 text-sm">({param.type})</span>
                      <span className="text-gray-600 text-sm">{param.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {endpoint.example && (
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-2" style={{ fontFamily: 'var(--font-exo)' }}>
                  Example:
                </h4>
                <div className="bg-gray-50 p-3 rounded border">
                  <code className="text-sm font-mono break-all">
                    {endpoint.example}
                  </code>
                </div>
              </div>
            )}

            {endpoint.response && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2" style={{ fontFamily: 'var(--font-exo)' }}>
                  Response:
                </h4>
                <pre className="bg-gray-50 p-3 rounded border text-sm overflow-x-auto">
                  <code>{JSON.stringify(endpoint.response, null, 2)}</code>
                </pre>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-12 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-yellow-800 mb-4" style={{ fontFamily: 'var(--font-exo)' }}>
          Usage Examples
        </h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2" style={{ fontFamily: 'var(--font-exo)' }}>
              JavaScript/Fetch
            </h3>
            <pre className="bg-white p-3 rounded border text-sm overflow-x-auto">
              <code>{`// Get all Petronas stations
fetch('${baseUrl}/api/stations?brand=petronas')
  .then(response => response.json())
  .then(data => console.log(data));

// Search for stations near Kuala Lumpur
fetch('${baseUrl}/api/stations/search?q=kuala lumpur&lat=3.1390&lng=101.6869&radius=10')
  .then(response => response.json())
  .then(data => console.log(data));`}</code>
            </pre>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-2" style={{ fontFamily: 'var(--font-exo)' }}>
              cURL
            </h3>
            <pre className="bg-white p-3 rounded border text-sm overflow-x-auto">
              <code>{`# Get fuel prices
curl "${baseUrl}/api/fuel-prices"

# Get station statistics
curl "${baseUrl}/api/stations/stats"`}</code>
            </pre>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center text-gray-500 text-sm" style={{ fontFamily: 'var(--font-exo)' }}>
        <p>All API endpoints return JSON responses with a consistent format.</p>
        <p>For support or questions, please refer to the project documentation.</p>
      </div>
    </div>
  );
} 