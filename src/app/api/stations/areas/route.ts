import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const state = searchParams.get('state');
    const city = searchParams.get('city');

    // Read the stations data
    const stationsPath = path.join(process.cwd(), 'public', 'stations.json');
    const stationsData = await fs.readFile(stationsPath, 'utf-8');
    let stations = JSON.parse(stationsData);

    // Filter by state if provided
    if (state) {
      stations = stations.filter((station: any) => 
        station.address?.toLowerCase().includes(state.toLowerCase())
      );
    }

    // Filter by city if provided
    if (city) {
      stations = stations.filter((station: any) => 
        station.address?.toLowerCase().includes(city.toLowerCase())
      );
    }

    // Extract areas from addresses
    const areaGroups: { [key: string]: any[] } = {};
    
    stations.forEach((station: any) => {
      if (station.address) {
        // Extract the first part of the address (usually city/area)
        const addressParts = station.address.split(',');
        const area = addressParts[0]?.trim() || 'Unknown Area';
        
        if (!areaGroups[area]) {
          areaGroups[area] = [];
        }
        areaGroups[area].push(station);
      }
    });

    // Convert to array format with counts
    const areaStats = Object.entries(areaGroups).map(([area, stations]) => ({
      area,
      count: stations.length,
      stations: stations.slice(0, 10) // Limit to first 10 stations per area
    }));

    // Sort by count descending
    areaStats.sort((a, b) => b.count - a.count);

    return NextResponse.json({
      success: true,
      data: areaStats,
      total: stations.length,
      totalAreas: areaStats.length,
      filters: {
        state: state || null,
        city: city || null
      }
    });
  } catch (error) {
    console.error("Error in areas API route:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to fetch areas data",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 