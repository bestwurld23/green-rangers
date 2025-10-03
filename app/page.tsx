'use client';

import { useEffect, useState } from 'react';
import JobMap, { Job } from '@/components/map/JobMap';
import { loadJobsFromCSV, getSampleJobs } from '@/lib/jobs';

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    async function fetchJobs() {
      try {
        const jobData = await loadJobsFromCSV();
        
        // If CSV loading fails, use sample data
        if (jobData.length === 0) {
          console.log('Using sample data');
          setJobs(getSampleJobs());
        } else {
          setJobs(jobData);
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setJobs(getSampleJobs());
      } finally {
        setLoading(false);
      }
    }

    fetchJobs();
  }, []);

  // Filter jobs by employment type
  const filteredJobs = filter === 'all' 
    ? jobs 
    : jobs.filter(job => job.employmentType?.toLowerCase().includes(filter.toLowerCase()));

  const jobsWithCoords = filteredJobs.filter(job => job.latitude && job.longitude);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-green-700">
                🌿 Green Rangers
              </h1>
              <p className="text-gray-600 mt-1">
                Illinois Solar & Renewable Energy Jobs
              </p>
            </div>
            <div className="flex gap-4">
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                Sign Up
              </button>
              <button className="px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition">
                Log In
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl font-bold text-green-600">{jobs.length}</div>
            <div className="text-gray-600">Total Jobs</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl font-bold text-blue-600">{jobsWithCoords.length}</div>
            <div className="text-gray-600">On Map</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl font-bold text-purple-600">
              {new Set(jobs.map(j => j.company)).size}
            </div>
            <div className="text-gray-600">Companies</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="font-semibold text-gray-700">Filter by Type:</span>
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition ${
                filter === 'all'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Jobs
            </button>
            <button
              onClick={() => setFilter('full-time')}
              className={`px-4 py-2 rounded-lg transition ${
                filter === 'full-time'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Full-time
            </button>
            <button
              onClick={() => setFilter('part-time')}
              className={`px-4 py-2 rounded-lg transition ${
                filter === 'part-time'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Part-time
            </button>
            <button
              onClick={() => setFilter('contract')}
              className={`px-4 py-2 rounded-lg transition ${
                filter === 'contract'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Contract
            </button>
          </div>
        </div>

        {/* Map */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Job Map
            <span className="text-sm font-normal text-gray-500 ml-2">
              (Showing {filteredJobs.length} jobs)
            </span>
          </h2>
          
          {loading ? (
            <div className="h-[600px] bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading jobs...</p>
              </div>
            </div>
          ) : (
            <JobMap jobs={filteredJobs} />
          )}
        </div>

        {/* Feature Highlights */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-4xl mb-3">👤</div>
            <h3 className="font-bold text-lg mb-2">Create Your Profile</h3>
            <p className="text-gray-600 text-sm">
              Build a digital portfolio with certifications, skills, and work experience
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-4xl mb-3">🤖</div>
            <h3 className="font-bold text-lg mb-2">AI Job Matching</h3>
            <p className="text-gray-600 text-sm">
              Get matched with jobs based on your skills and certifications
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-4xl mb-3">📚</div>
            <h3 className="font-bold text-lg mb-2">Training Programs</h3>
            <p className="text-gray-600 text-sm">
              Connect with CEJA programs and earn certifications like NABCEP
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2025 Green Rangers. Connecting people to renewable energy careers.</p>
        </div>
      </footer>
    </div>
  );
}
