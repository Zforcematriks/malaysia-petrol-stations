import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://storage.data.gov.my/commodities/fuelprice.csv', {
      next: {
        // Revalidate every hour to get fresh data
        revalidate: 3600, 
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch fuel prices: ${response.statusText}`);
    }

    const text = await response.text();
    const lines = text.trim().split('\n');
    
    let latestPrices = null;
    let previousPrices = null;
    let pricesFound = 0;

    // Find the two most recent 'level' rows. The first is latest, the second is previous.
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (line.startsWith('level,')) {
            const columns = line.split(',');
            // header: series_type,date,ron95,ron97,diesel,diesel_eastmsia
            // index:      0         1     2     3      4         5
            if (columns.length > 4) {
                const ron95 = parseFloat(columns[2]);
                const ron97 = parseFloat(columns[3]);
                const diesel = parseFloat(columns[4]); // Peninsular Malaysia diesel

                if (!isNaN(ron95) && !isNaN(ron97) && !isNaN(diesel)) {
                    if (pricesFound === 0) {
                        latestPrices = { ron95, ron97, diesel };
                        pricesFound++;
                    } else if (pricesFound === 1) {
                        previousPrices = { ron95, ron97, diesel };
                        pricesFound++;
                        break; // Found both, no need to continue
                    }
                }
            }
        }
    }

    if (!latestPrices) {
        throw new Error(`Could not find any 'level' data in the CSV. Raw CSV Text: ${text}`);
    }

    return NextResponse.json({ latest: latestPrices, previous: previousPrices });
  } catch (error) {
    console.error("Error in fuel prices API route:", error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    
    // Provide more context in the error response for easier debugging.
    const debugInfo = { 
        error: "Failed to parse or fetch fuel price data.", 
        details: errorMessage,
    };

    return new Response(JSON.stringify(debugInfo), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
} 