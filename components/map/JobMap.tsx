'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
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
};

export default function JobMap({
  jobs,
  center = [40.6331, -89.3985],
  zoom = 7
}: JobMapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Fix Leaflet icon paths
    const L = require('leaflet');
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-[600px] bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-gray-500">Loading map...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-[600px] rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {jobs.map((job) => {
          if (!job.latitude || !job.longitude) return null;

          return (
            <Marker
              key={job.id}
              position={[job.latitude, job.longitude]}
            >
              <Popup maxWidth={350}>
                <div className="p-2">
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
                  {job.postLink && (
                    <a
                      href={job.postLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                    >
                      View Job
                    </a>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
