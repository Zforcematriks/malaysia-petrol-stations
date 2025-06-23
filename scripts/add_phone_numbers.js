const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

// Your Google Places API Key
const API_KEY = 'AIzaSyBt-TRRDiaKsU2URRLCaJaMcwkgfMprIBE';
const INPUT_FILE = path.join(__dirname, '..', 'public', 'stations.json');
const OUTPUT_FILE = path.join(__dirname, '..', 'public', 'stations.json'); // Overwrite the existing file

async function fetchPhoneNumber(placeId) {
    if (!placeId) {
        return null;
    }
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=formatted_phone_number,international_phone_number&key=${API_KEY}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.result) {
            return data.result.international_phone_number || data.result.formatted_phone_number || null;
        }
        return null;
    } catch (error) {
        console.error(`Error fetching details for place_id ${placeId}:`, error);
        return null;
    }
}

async function processStations() {
    console.log(`Reading stations from: ${INPUT_FILE}`);
    const stations = JSON.parse(fs.readFileSync(INPUT_FILE, 'utf-8'));
    const total = stations.length;
    let updatedCount = 0;
    let foundCount = 0;

    console.log(`Starting to process ${total} stations...`);

    for (let i = 0; i < total; i++) {
        const station = stations[i];
        // Process only if phone number is not already present
        if (!station.phone) {
            const phoneNumber = await fetchPhoneNumber(station.place_id);
            if (phoneNumber) {
                station.phone = phoneNumber;
                foundCount++;
                console.log(`[${i + 1}/${total}] Found phone for ${station.name}: ${phoneNumber}`);
            } else {
                // Add null to avoid re-fetching next time
                station.phone = null;
            }
            updatedCount++;
        }
        // Small delay to avoid hitting API rate limits too hard
        if (i > 0 && i % 10 === 0) {
            await new Promise(resolve => setTimeout(resolve, 50));
        }
    }

    console.log(`\nFinished processing.`);
    console.log(`- Stations checked: ${updatedCount}`);
    console.log(`- Phone numbers found: ${foundCount}`);

    console.log(`\nWriting updated data to: ${OUTPUT_FILE}`);
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(stations, null, 2));
    console.log('Successfully updated stations file with phone numbers.');
}

processStations().catch(console.error); 