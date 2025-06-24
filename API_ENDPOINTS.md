# Malaysia Petrol Stations API Endpoints

This document lists all available public API endpoints for the Malaysia Petrol Stations application.

## Base URL
```
https://your-domain.com/api
```

## Available Endpoints

### 1. Fuel Prices
**GET** `/api/fuel-prices`

Get current fuel prices in Malaysia from the official government data source.

**Response:**
```json
{
  "latest": {
    "ron95": 2.05,
    "ron97": 2.35,
    "diesel": 2.15
  },
  "previous": {
    "ron95": 2.05,
    "ron97": 2.35,
    "diesel": 2.15
  }
}
```

**Example:**
```bash
curl https://your-domain.com/api/fuel-prices
```

### 2. All Stations
**GET** `/api/stations`

Get all petrol stations with optional filtering and pagination.

**Parameters:**
- `brand` (string) - Filter by brand (e.g., petronas, shell, caltex)
- `area` (string) - Filter by area name
- `limit` (number) - Number of results to return
- `offset` (number) - Number of results to skip

**Response:**
```json
{
  "success": true,
  "data": [...],
  "total": 5000,
  "limit": 10,
  "offset": 0,
  "filters": {
    "brand": "petronas",
    "area": null
  }
}
```

**Examples:**
```bash
# Get all stations
curl https://your-domain.com/api/stations

# Get Petronas stations only
curl https://your-domain.com/api/stations?brand=petronas

# Get first 10 stations in Kuala Lumpur
curl https://your-domain.com/api/stations?area=kuala%20lumpur&limit=10
```

### 3. Brands
**GET** `/api/stations/brands`

Get stations grouped by brand with counts and sample stations.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "brand": "Petronas",
      "count": 1500,
      "stations": [...]
    },
    {
      "brand": "Shell",
      "count": 1200,
      "stations": [...]
    }
  ],
  "total": 5000,
  "totalBrands": 8
}
```

**Example:**
```bash
curl https://your-domain.com/api/stations/brands
```

### 4. Areas
**GET** `/api/stations/areas`

Get stations grouped by area with counts and sample stations.

**Parameters:**
- `state` (string) - Filter by state
- `city` (string) - Filter by city

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "area": "Kuala Lumpur",
      "count": 500,
      "stations": [...]
    },
    {
      "area": "Petaling Jaya",
      "count": 300,
      "stations": [...]
    }
  ],
  "total": 5000,
  "totalAreas": 150,
  "filters": {
    "state": "selangor",
    "city": null
  }
}
```

**Examples:**
```bash
# Get all areas
curl https://your-domain.com/api/stations/areas

# Get areas in Selangor
curl https://your-domain.com/api/stations/areas?state=selangor
```

### 5. Statistics
**GET** `/api/stations/stats`

Get overall statistics about petrol stations.

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 5000,
    "open": 4800,
    "closed": 200,
    "withPhotos": 3000,
    "topBrands": [
      { "brand": "Petronas", "count": 1500 },
      { "brand": "Shell", "count": 1200 }
    ],
    "topAreas": [
      { "area": "Kuala Lumpur", "count": 500 },
      { "area": "Petaling Jaya", "count": 300 }
    ],
    "brandCount": 8,
    "areaCount": 150
  }
}
```

**Example:**
```bash
curl https://your-domain.com/api/stations/stats
```

### 6. Search
**GET** `/api/stations/search`

Search stations by name, address, or brand with optional location-based filtering.

**Parameters:**
- `q` (string, required) - Search query
- `lat` (number) - Latitude for distance calculation
- `lng` (number) - Longitude for distance calculation
- `radius` (number) - Search radius in km (default: 50)
- `limit` (number) - Number of results (default: 50)

**Response:**
```json
{
  "success": true,
  "data": [...],
  "total": 25,
  "limit": 50,
  "query": "kuala lumpur",
  "filters": {
    "lat": 3.1390,
    "lng": 101.6869,
    "radius": 10
  }
}
```

**Examples:**
```bash
# Search for stations with "kuala lumpur"
curl "https://your-domain.com/api/stations/search?q=kuala%20lumpur"

# Search for stations near specific coordinates
curl "https://your-domain.com/api/stations/search?q=petronas&lat=3.1390&lng=101.6869&radius=10"
```

## Usage Examples

### JavaScript/Fetch
```javascript
// Get all Petronas stations
fetch('https://your-domain.com/api/stations?brand=petronas')
  .then(response => response.json())
  .then(data => console.log(data));

// Search for stations near Kuala Lumpur
fetch('https://your-domain.com/api/stations/search?q=kuala lumpur&lat=3.1390&lng=101.6869&radius=10')
  .then(response => response.json())
  .then(data => console.log(data));

// Get fuel prices
fetch('https://your-domain.com/api/fuel-prices')
  .then(response => response.json())
  .then(data => console.log(data.latest));
```

### Python/Requests
```python
import requests

# Get station statistics
response = requests.get('https://your-domain.com/api/stations/stats')
stats = response.json()
print(f"Total stations: {stats['data']['total']}")

# Search for Shell stations
response = requests.get('https://your-domain.com/api/stations/search', params={
    'q': 'shell',
    'limit': 20
})
stations = response.json()
print(f"Found {stations['total']} Shell stations")
```

### cURL
```bash
# Get fuel prices
curl "https://your-domain.com/api/fuel-prices"

# Get all brands
curl "https://your-domain.com/api/stations/brands"

# Search for stations in Petaling Jaya
curl "https://your-domain.com/api/stations/search?q=petaling%20jaya&limit=10"
```

## Response Format

All API endpoints return JSON responses with a consistent format:

**Success Response:**
```json
{
  "success": true,
  "data": {...},
  "total": 5000,
  "limit": 10,
  "offset": 0
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message",
  "details": "Detailed error information"
}
```

## Rate Limiting

Currently, there are no rate limits on the API endpoints. However, please use the API responsibly and avoid making excessive requests.

## Data Sources

- **Fuel Prices**: Official Malaysia government data from `storage.data.gov.my`
- **Station Data**: Compiled from various sources including Google Places API and manual verification

## Support

For questions or support regarding the API, please refer to the project documentation or create an issue in the project repository. 