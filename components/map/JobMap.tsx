'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import type { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

const ZoomControl = dynamic(
  () => import('react-leaflet').then((mod) => mod.ZoomControl),
  { ssr: false }
);

export type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  employmentType: string;
  seniorityLevel?: string;
  postLink?: string;
  latitude?: number;
  longitude?: number;
};

type JobMapProps = {
  jobs: Job[];
  center?: [number, number];
  zoom?: number;
  fullScreen?: boolean;
  onApply?: (job: Job) => void;
};

export default function JobMap({
  jobs,
  center = [40.6331, -89.3985],
  zoom = 7,
  fullScreen = false,
  onApply
}: JobMapProps) {
  const [mounted, setMounted] = useState(false);
  const [greenIcon, setGreenIcon] = useState<Icon | null>(null);

  useEffect(() => {
    setMounted(true);

    // Import Leaflet only on client side
    import('leaflet').then((L) => {
      const customGreenIcon = new L.Icon({
      iconUrl: 'data:image/svg+xml;base64,' + btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="36" height="36">
          <path fill="#22c55e" stroke="#16a34a" stroke-width="1.5" d="M12 0C7.802 0 4 3.403 4 7.602C4 11.8 7.469 16.812 12 24C16.531 16.812 20 11.8 20 7.602C20 3.403 16.199 0 12 0z"/>
          <circle cx="12" cy="8" r="3" fill="white"/>
        </svg>
      `),
      iconSize: [36, 36],
      iconAnchor: [18, 36],
      popupAnchor: [0, -36],
      });

      setGreenIcon(customGreenIcon);
    });
  }, []);

  if (!mounted) {
    return (
      <div className={`w-full ${fullScreen ? 'h-screen' : 'h-[600px]'} bg-gray-900 flex items-center justify-center`}>
        <div className="text-gray-400">Loading map...</div>
      </div>
    );
  }

  const heightClass = fullScreen ? 'h-screen' : 'h-[600px]';

  return (
    <div className={`w-full ${heightClass} overflow-hidden`}>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        className="h-full w-full"
        zoomControl={false}
      >
        {/* Dark theme tile layer */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* Custom positioned zoom control */}
        <ZoomControl position="bottomleft" />

        {jobs.map((job) => {
          if (!job.latitude || !job.longitude || !greenIcon) return null;

          return (
            <Marker
              key={job.id}
              position={[job.latitude, job.longitude]}
              icon={greenIcon}
            >
              <Popup maxWidth={350}>
                <div className="p-3 bg-white rounded-lg">
                  <h3 className="font-bold text-green-700 text-lg mb-2">
                    {job.title}
                  </h3>
                  <p className="text-sm mb-1">
                    <strong>Company:</strong> {job.company}
                  </p>
                  <p className="text-sm mb-1">
                    <strong>Location:</strong> {job.location}
                  </p>
                  <p className="text-sm mb-1">
                    <strong>Type:</strong> {job.employmentType}
                  </p>
                  {job.seniorityLevel && (
                    <p className="text-sm mb-2">
                      <strong>Level:</strong> {job.seniorityLevel}
                    </p>
                  )}
                  <div className="max-h-32 overflow-y-auto mb-3 text-xs text-gray-700">
                    {job.description.substring(0, 200)}...
                  </div>
                  <div className="flex gap-2">
                    {onApply && (
                      <button
                        onClick={() => onApply(job)}
                        className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition font-semibold"
                      >
                        Apply with Green Rangers
                      </button>
                    )}
                    {job.postLink && (
                      <a
                        href={job.postLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700 transition font-semibold text-center"
                      >
                        View on LinkedIn
                      </a>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
