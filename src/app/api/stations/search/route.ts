import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q'); // Search query
    const lat = searchParams.get('lat'); // Latitude for distance calculation
    const lng = searchParams.get('lng'); // Longitude for distance calculation
    const radius = searchParams.get('radius'); // Search radius in km
    const limit = searchParams.get('limit') || '50';

    if (!q) {
      return NextResponse.json(
        { success: false, error: "Search query 'q' is required" },
        { status: 400 }
      );
    }

    // Read the stations data
    const stationsPath = path.join(process.cwd(), 'public', 'stations.json');
    const stationsData = await fs.readFile(stationsPath, 'utf-8');
    let stations = JSON.parse(stationsData);

    // Search function
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

    // Filter stations based on search query
    const searchTerm = q.toLowerCase();
    let filteredStations = stations.filter((station: any) => {
      const nameMatch = station.name?.toLowerCase().includes(searchTerm);
      const addressMatch = station.address?.toLowerCase().includes(searchTerm);
      const brandMatch = station.brand?.toLowerCase().includes(searchTerm);
      return nameMatch || addressMatch || brandMatch;
    });

    // Calculate distances if coordinates provided
    if (lat && lng) {
      const userLat = parseFloat(lat);
      const userLng = parseFloat(lng);
      const radiusKm = radius ? parseFloat(radius) : 50; // Default 50km radius

      filteredStations = filteredStations
        .map((station: any) => {
          if (station.location?.lat && station.location?.lng) {
            const distance = getDistanceFromLatLonInKm(
              userLat, userLng, 
              station.location.lat, station.location.lng
            );
            return { ...station, _distance: distance };
          }
          return { ...station, _distance: null };
        })
        .filter((station: any) => {
          if (station._distance === null) return true; // Include stations without location
          return station._distance <= radiusKm;
        })
        .sort((a: any, b: any) => {
          if (a._distance === null && b._distance === null) return 0;
          if (a._distance === null) return 1;
          if (b._distance === null) return -1;
          return a._distance - b._distance;
        });
    }

    // Apply limit
    const limitNum = parseInt(limit);
    const limitedStations = filteredStations.slice(0, limitNum);

    return NextResponse.json({
      success: true,
      data: limitedStations,
      total: filteredStations.length,
      limit: limitNum,
      query: q,
      filters: {
        lat: lat || null,
        lng: lng || null,
        radius: radius || null
      }
    });
  } catch (error) {
    console.error("Error in search API route:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to search stations",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 