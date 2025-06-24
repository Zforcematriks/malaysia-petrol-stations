import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Read the stations data
    const stationsPath = path.join(process.cwd(), 'public', 'stations.json');
    const stationsData = await fs.readFile(stationsPath, 'utf-8');
    const stations = JSON.parse(stationsData);

    // Group stations by brand
    const brandGroups: { [key: string]: any[] } = {};
    
    stations.forEach((station: any) => {
      const brand = station.brand?.toLowerCase() || 'unknown';
      if (!brandGroups[brand]) {
        brandGroups[brand] = [];
      }
      brandGroups[brand].push(station);
    });

    // Convert to array format with counts
    const brandStats = Object.entries(brandGroups).map(([brand, stations]) => ({
      brand: brand.charAt(0).toUpperCase() + brand.slice(1),
      count: stations.length,
      stations: stations.slice(0, 10) // Limit to first 10 stations per brand
    }));

    // Sort by count descending
    brandStats.sort((a, b) => b.count - a.count);

    return NextResponse.json({
      success: true,
      data: brandStats,
      total: stations.length,
      totalBrands: brandStats.length
    });
  } catch (error) {
    console.error("Error in brands API route:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to fetch brands data",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 