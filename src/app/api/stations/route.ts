import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const brand = searchParams.get('brand');
    const area = searchParams.get('area');
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');

    // Read the stations data
    const stationsPath = path.join(process.cwd(), 'public', 'stations.json');
    const stationsData = await fs.readFile(stationsPath, 'utf-8');
    let stations = JSON.parse(stationsData);

    // Apply filters
    if (brand) {
      stations = stations.filter((station: any) => 
        station.brand?.toLowerCase() === brand.toLowerCase()
      );
    }

    if (area) {
      const searchTerm = area.toLowerCase();
      stations = stations.filter((station: any) =>
        station.address?.toLowerCase().includes(searchTerm) ||
        station.name?.toLowerCase().includes(searchTerm)
      );
    }

    // Apply pagination
    const limitNum = limit ? parseInt(limit) : stations.length;
    const offsetNum = offset ? parseInt(offset) : 0;
    const paginatedStations = stations.slice(offsetNum, offsetNum + limitNum);

    return NextResponse.json({
      success: true,
      data: paginatedStations,
      total: stations.length,
      limit: limitNum,
      offset: offsetNum,
      filters: {
        brand: brand || null,
        area: area || null
      }
    });
  } catch (error) {
    console.error("Error in stations API route:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to fetch stations data",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 