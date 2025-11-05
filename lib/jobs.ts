import { Job } from '@/components/map/JobMap';

// Mock geocoding - in production you'd use a real geocoding service
const locationCoordinates: Record<string, [number, number]> = {
  'Chicago': [41.8781, -87.6298],
  'Springfield': [39.7817, -89.6501],
  'Rockford': [42.2711, -89.0940],
  'Peoria': [40.6936, -89.5890],
  'Champaign': [40.1164, -88.2434],
  'Aurora': [41.7606, -88.3201],
  'Joliet': [41.5250, -88.0817],
  'Naperville': [41.7508, -88.1535],
  'Evanston': [42.0451, -87.6877],
  'Bloomington': [40.4842, -88.9937],
  'Decatur': [39.8403, -88.9548],
  'Elgin': [42.0354, -88.2826],
  'Waukegan': [42.3636, -87.8448],
  'Cicero': [41.8456, -87.7539],
  'Schaumburg': [42.0334, -88.0834],
  'Oak Lawn': [41.7195, -87.7479],
  'Des Plaines': [42.0334, -87.8834],
  'Mount Prospect': [42.0664, -87.9373],
  'Wheaton': [41.8661, -88.1070],
  'Normal': [40.5142, -88.9906],
  'Bolingbrook': [41.6986, -88.0684],
  'Palatine': [42.1103, -88.0343],
  'Skokie': [42.0324, -87.7417],
  'Orland Park': [41.6303, -87.8539],
};

// Add offset to prevent marker stacking and avoid water
function addOffset(lat: number, lng: number, offsetIndex: number): [number, number] {
  // Create a spiral pattern with larger spacing
  const angle = offsetIndex * 0.8; // Rotate around
  const distance = 0.03 * (1 + offsetIndex * 0.15); // Larger base distance

  // For Chicago area (near lake), bias offsets to the west/south to avoid Lake Michigan
  const isChicagoArea = lat > 41.6 && lat < 42.2 && lng > -88 && lng < -87.5;

  let latOffset = Math.cos(angle) * distance;
  let lngOffset = Math.sin(angle) * distance;

  if (isChicagoArea) {
    // Bias westward and southward to avoid lake
    lngOffset = Math.abs(lngOffset) * -1; // Force west
    if (latOffset > 0) latOffset *= 0.5; // Reduce north movement
  }

  return [lat + latOffset, lng + lngOffset];
}

// Track how many jobs have been placed at each coordinate
const coordinateUsage = new Map<string, number>();

// Parse location string and get coordinates
function getCoordinates(location: string): [number, number] | null {
  const locationLower = location.toLowerCase();

  // Try to find a city match (case-insensitive)
  for (const [city, coords] of Object.entries(locationCoordinates)) {
    if (locationLower.includes(city.toLowerCase())) {
      return coords;
    }
  }

  // If it's an Illinois job but city not in our list, use Chicago as default
  // This ensures ALL Illinois jobs appear on the map
  if (locationLower.includes('il') || locationLower.includes('illinois')) {
    console.log(`📍 Using Chicago coords for: ${location}`);
    return [41.8781, -87.6298]; // Chicago
  }

  return null;
}

// Parse CSV line (handles quoted fields with embedded commas and newlines)
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      // Handle escaped quotes ("")
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++; // Skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

// Load jobs from CSV file
export async function loadJobsFromCSV(): Promise<Job[]> {
  try {
    const response = await fetch('/jobs.csv');
    const text = await response.text();

    // Parse CSV properly handling multi-line fields
    const rows: string[] = [];
    let currentRow = '';
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];

      if (char === '"') {
        inQuotes = !inQuotes;
        currentRow += char;
      } else if (char === '\n' && !inQuotes) {
        if (currentRow.trim()) {
          rows.push(currentRow);
        }
        currentRow = '';
      } else {
        currentRow += char;
      }
    }
    if (currentRow.trim()) {
      rows.push(currentRow);
    }

    // Skip header
    const dataLines = rows.slice(1);

    const jobs: Job[] = [];

    // Reset coordinate usage tracking
    coordinateUsage.clear();

    for (let i = 0; i < dataLines.length; i++) {
      const columns = parseCSVLine(dataLines[i]);

      // CSV structure: Position, Title, Logo, Post Link, Company, Company Profile, Location, Actively Status, Description, Seniority level, Employment type, Job function, Industries, Time ago
      if (columns.length >= 7) {
        const location = columns[6] || 'Unknown';
        const locationLower = location.toLowerCase();

        // Only include Illinois jobs (more lenient check)
        if (!locationLower.includes('il') &&
            !locationLower.includes('illinois') &&
            !locationLower.includes('chicago')) {
          continue;
        }

        const coords = getCoordinates(location);

        if (coords) {
          // Track coordinate usage and add offset if needed
          const coordKey = `${coords[0]},${coords[1]}`;
          const usageCount = coordinateUsage.get(coordKey) || 0;
          coordinateUsage.set(coordKey, usageCount + 1);

          // Add offset for overlapping markers (after the first one)
          const [finalLat, finalLng] = usageCount > 0
            ? addOffset(coords[0], coords[1], usageCount)
            : coords;

          // Always add the job even if we don't have exact coordinates
          // getCoordinates will default Illinois jobs to Chicago
          jobs.push({
            id: `job-${i}`,
            title: columns[1] || 'Untitled Position',
            company: columns[4] || 'Company Name Not Listed',
            location: location,
            description: columns[8] || 'No description available',
            employmentType: columns[10] || 'Not specified',
            seniorityLevel: columns[9],
            postLink: columns[3],
            latitude: finalLat,
            longitude: finalLng,
          });
        }
      }
    }

    console.log(`✅ Loaded ${jobs.length} Illinois renewable energy jobs`);
    console.log(`📊 Jobs with coordinates: ${jobs.filter(j => j.latitude && j.longitude).length}`);
    return jobs;
  } catch (error) {
    console.error('Error loading jobs:', error);
    return [];
  }
}

// Generate sample jobs for testing (in case CSV fails)
export function getSampleJobs(): Job[] {
  return [
    {
      id: '1',
      title: 'Solar Installation Technician',
      company: 'Green Energy Solutions',
      location: 'Chicago, IL',
      description: 'Install and maintain solar panel systems for residential and commercial properties. NABCEP certification preferred.',
      employmentType: 'Full-time',
      seniorityLevel: 'Entry level',
      postLink: '#',
      latitude: 41.8781,
      longitude: -87.6298,
    },
    {
      id: '2',
      title: 'Solar Project Manager',
      company: 'SunPower Illinois',
      location: 'Springfield, IL',
      description: 'Manage solar installation projects from design through completion. 3+ years experience required.',
      employmentType: 'Full-time',
      seniorityLevel: 'Mid-Senior level',
      postLink: '#',
      latitude: 39.7817,
      longitude: -89.6501,
    },
    {
      id: '3',
      title: 'Renewable Energy Consultant',
      company: 'Midwest Solar Consulting',
      location: 'Naperville, IL',
      description: 'Provide expert consultation on solar energy solutions for commercial clients.',
      employmentType: 'Contract',
      seniorityLevel: 'Senior level',
      postLink: '#',
      latitude: 41.7508,
      longitude: -88.1535,
    },
  ];
}
