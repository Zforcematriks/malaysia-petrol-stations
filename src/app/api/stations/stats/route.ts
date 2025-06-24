import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Read the stations data
    const stationsPath = path.join(process.cwd(), 'public', 'stations.json');
    const stationsData = await fs.readFile(stationsPath, 'utf-8');
    const stations = JSON.parse(stationsData);

    // Calculate statistics
    const totalStations = stations.length;
    
    // Brand statistics
    const brandCounts: { [key: string]: number } = {};
    stations.forEach((station: any) => {
      const brand = station.brand?.toLowerCase() || 'unknown';
      brandCounts[brand] = (brandCounts[brand] || 0) + 1;
    });

    // Area statistics
    const areaCounts: { [key: string]: number } = {};
    stations.forEach((station: any) => {
      if (station.address) {
        const addressParts = station.address.split(',');
        const area = addressParts[0]?.trim() || 'Unknown Area';
        areaCounts[area] = (areaCounts[area] || 0) + 1;
      }
    });

    // Open/Closed statistics
    const openStations = stations.filter((station: any) => station.isOpen !== false).length;
    const closedStations = totalStations - openStations;

    // Top brands
    const topBrands = Object.entries(brandCounts)
      .map(([brand, count]) => ({ brand: brand.charAt(0).toUpperCase() + brand.slice(1), count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Top areas
    const topAreas = Object.entries(areaCounts)
      .map(([area, count]) => ({ area, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Stations with photos
    const stationsWithPhotos = stations.filter((station: any) => station.photoUrl).length;

    return NextResponse.json({
      success: true,
      data: {
        total: totalStations,
        open: openStations,
        closed: closedStations,
        withPhotos: stationsWithPhotos,
        topBrands,
        topAreas,
        brandCount: Object.keys(brandCounts).length,
        areaCount: Object.keys(areaCounts).length
      }
    });
  } catch (error) {
    console.error("Error in stats API route:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to fetch statistics",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 