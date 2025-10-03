import { Job } from '@/components/map/JobMap';

// Mock geocoding - in production you'd use a real geocoding service
const locationCoordinates: Record<string, [number, number]> = {
  'Chicago, IL': [41.8781, -87.6298],
  'Springfield, IL': [39.7817, -89.6501],
  'Rockford, IL': [42.2711, -89.0940],
  'Peoria, IL': [40.6936, -89.5890],
  'Champaign, IL': [40.1164, -88.2434],
  'Aurora, IL': [41.7606, -88.3201],
  'Joliet, IL': [41.5250, -88.0817],
  'Naperville, IL': [41.7508, -88.1535],
  'Evanston, IL': [42.0451, -87.6877],
  'Bloomington, IL': [40.4842, -88.9937],
};

// Parse location string and get coordinates
function getCoordinates(location: string): [number, number] | null {
  // Try exact match first
  if (locationCoordinates[location]) {
    return locationCoordinates[location];
  }

  // Try to find a city match
  for (const [key, coords] of Object.entries(locationCoordinates)) {
    if (location.includes(key.split(',')[0])) {
      return coords;
    }
  }

  // Default to Chicago if no match
  if (location.toLowerCase().includes('il') || location.toLowerCase().includes('illinois')) {
    return [40.6331, -89.3985]; // Illinois center
  }

  return null;
}

// Parse CSV line (basic CSV parser)
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
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
    const response = await fetch('/data/jobs.csv');
    const text = await response.text();
    const lines = text.split('\n').filter(line => line.trim());

    // Skip header
    const dataLines = lines.slice(1);

    const jobs: Job[] = [];

    for (let i = 0; i < dataLines.length; i++) {
      const columns = parseCSVLine(dataLines[i]);

      // Assuming CSV structure: Title, Company, Location, Description, Employment Type, Seniority, Post Link
      if (columns.length >= 3) {
        const location = columns[2] || 'Unknown';

        // Only include Illinois jobs
        if (!location.toLowerCase().includes('il') && !location.toLowerCase().includes('illinois')) {
          continue;
        }

        const coords = getCoordinates(location);

        jobs.push({
          id: `job-${i}`,
          title: columns[0] || 'Untitled Position',
          company: columns[1] || 'Company Name Not Listed',
          location: location,
          description: columns[3] || 'No description available',
          employmentType: columns[4] || 'Not specified',
          seniorityLevel: columns[5],
          postLink: columns[6],
          latitude: coords?.[0],
          longitude: coords?.[1],
        });
      }
    }

    console.log(`✅ Loaded ${jobs.length} Illinois solar jobs`);
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
