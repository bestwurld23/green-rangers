'use client';

import { useEffect, useState } from 'react';
import JobMap, { Job } from '@/components/map/JobMap';
import { loadJobsFromCSV, getSampleJobs } from '@/lib/jobs';
import Link from 'next/link';
import { Briefcase, DollarSign, MapPin, X, Menu } from 'lucide-react';
import ApplicationModal from '@/components/apply/ApplicationModal';

export default function JobBoard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [showStats, setShowStats] = useState(true);
  const [showFilters, setShowFilters] = useState(true);
  const [showCTA, setShowCTA] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const jobData = await loadJobsFromCSV();

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

  const filteredJobs = filter === 'all'
    ? jobs
    : jobs.filter(job => job.employmentType?.toLowerCase().includes(filter.toLowerCase()));

  const jobsWithCoords = filteredJobs.filter(job => job.latitude && job.longitude);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gray-900">
      {/* Map Background Layer - z-0 */}
      <div className="absolute inset-0 z-0">
        {loading ? (
          <div className="h-full w-full bg-gray-900 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading jobs...</p>
            </div>
          </div>
        ) : (
          <JobMap
            jobs={filteredJobs}
            fullScreen={true}
            onApply={(job) => setSelectedJob(job)}
          />
        )}
      </div>

      {/* Overlay UI Elements */}

      {/* Header - z-50 */}
      <header className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/70 to-transparent pointer-events-none">
        <div className="max-w-7xl mx-auto px-3 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-2">
            <Link href="/" className="pointer-events-auto">
              <h1 className="text-lg sm:text-2xl font-bold text-white hover:text-green-400 transition">
                Green Rangers
              </h1>
              <p className="text-green-400 text-xs sm:text-sm hidden sm:block">
                Illinois Solar & Renewable Energy Jobs
              </p>
            </Link>
            <div className="flex flex-col sm:flex-row gap-2 pointer-events-auto">
              <Link
                href="/join-team"
                className="px-3 py-1.5 sm:px-4 sm:py-2 border border-green-400 text-green-400 rounded-lg hover:bg-green-400/10 transition font-semibold text-xs sm:text-sm whitespace-nowrap"
              >
                Join Team
              </Link>
              <Link
                href="/crew-service"
                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold text-xs sm:text-sm shadow-lg whitespace-nowrap"
              >
                Hire Crew
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Top Center Banner - z-40 */}
      <div className="absolute top-16 sm:top-20 left-1/2 transform -translate-x-1/2 z-40 bg-green-600/95 backdrop-blur-sm rounded-full shadow-lg px-4 sm:px-6 py-1.5 sm:py-2 max-w-[90vw]">
        <p className="text-white text-xs sm:text-sm font-semibold flex items-center gap-2">
          <span className="animate-pulse">🟢</span>
          <span className="hidden sm:inline">Showing {filteredJobs.length} renewable energy jobs in Illinois</span>
          <span className="sm:hidden">{filteredJobs.length} jobs</span>
        </p>
      </div>

      {/* Stats Panel - Top Right - z-40 - Hidden on mobile */}
      {showStats && (
        <div className="hidden sm:block absolute top-20 right-4 z-40 bg-gray-900/95 backdrop-blur-sm rounded-lg shadow-2xl border border-gray-700 p-4 w-64">
          <button
            onClick={() => setShowStats(false)}
            className="absolute top-2 right-2 text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
          <h3 className="text-white font-bold mb-3 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-green-500" />
            Job Stats
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">Total Jobs</span>
              <span className="text-green-500 font-bold text-lg">{jobs.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">On Map</span>
              <span className="text-blue-400 font-bold text-lg">{jobsWithCoords.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">Companies</span>
              <span className="text-purple-400 font-bold text-lg">
                {new Set(jobs.map(j => j.company)).size}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">Filtered</span>
              <span className="text-yellow-400 font-bold text-lg">{filteredJobs.length}</span>
            </div>
          </div>
        </div>
      )}

      {!showStats && (
        <button
          onClick={() => setShowStats(true)}
          className="hidden sm:block absolute top-20 right-4 z-40 bg-gray-900/95 backdrop-blur-sm rounded-lg shadow-2xl border border-gray-700 p-3 hover:bg-gray-800 transition"
        >
          <Briefcase className="w-5 h-5 text-green-500" />
        </button>
      )}

      {/* Filter Panel - Bottom Left - z-40 - Toggleable */}
      {showFilters && (
        <div className="absolute bottom-20 sm:bottom-6 left-3 sm:left-20 z-40 bg-white rounded-lg shadow-2xl p-3 sm:p-4 w-48 sm:w-64">
          <button
            onClick={() => setShowFilters(false)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
          <h3 className="font-bold text-gray-800 mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
            Job Types
          </h3>
          <div className="space-y-1.5 sm:space-y-2">
            <button
              onClick={() => setFilter('all')}
              className={`w-full px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition text-left flex items-center gap-2 text-sm sm:text-base ${
                filter === 'all'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${filter === 'all' ? 'bg-white' : 'bg-green-500'}`}></span>
              <span className="font-medium">All ({jobs.length})</span>
            </button>
            <button
              onClick={() => setFilter('full-time')}
              className={`w-full px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition text-left flex items-center gap-2 text-sm sm:text-base ${
                filter === 'full-time'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${filter === 'full-time' ? 'bg-white' : 'bg-green-500'}`}></span>
              <span className="font-medium">Full-time</span>
            </button>
            <button
              onClick={() => setFilter('part-time')}
              className={`w-full px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition text-left flex items-center gap-2 text-sm sm:text-base ${
                filter === 'part-time'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${filter === 'part-time' ? 'bg-white' : 'bg-yellow-500'}`}></span>
              <span className="font-medium">Part-time</span>
            </button>
            <button
              onClick={() => setFilter('contract')}
              className={`w-full px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition text-left flex items-center gap-2 text-sm sm:text-base ${
                filter === 'contract'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${filter === 'contract' ? 'bg-white' : 'bg-blue-500'}`}></span>
              <span className="font-medium">Contract</span>
            </button>
          </div>
        </div>
      )}

      {!showFilters && (
        <button
          onClick={() => setShowFilters(true)}
          className="absolute bottom-20 sm:bottom-6 left-3 sm:left-20 z-40 bg-white rounded-lg shadow-2xl p-3 hover:bg-gray-50 transition"
        >
          <Menu className="w-5 h-5 text-green-600" />
        </button>
      )}

      {/* Crew CTA - Bottom Right - z-40 - Toggleable */}
      {showCTA && (
        <Link
          href="/crew-service"
          className="absolute bottom-3 sm:bottom-6 right-3 sm:right-6 z-40 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg shadow-2xl p-4 sm:p-6 hover:from-green-700 hover:to-green-800 transition group w-52 sm:w-72"
        >
          <button
            onClick={(e) => {
              e.preventDefault();
              setShowCTA(false);
            }}
            className="absolute top-2 right-2 text-white/60 hover:text-white z-10"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="bg-white/20 rounded-lg p-2 sm:p-3 group-hover:bg-white/30 transition">
              <DollarSign className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg mb-0.5 sm:mb-1">Need Workers?</h3>
              <p className="text-xs sm:text-sm text-green-100 mb-1 sm:mb-2">
                Hire certified crew
              </p>
              <div className="text-xl sm:text-2xl font-bold">$120/day</div>
              <p className="text-xs text-green-200 mt-0.5 sm:mt-1">per person</p>
            </div>
          </div>
        </Link>
      )}

      {!showCTA && (
        <button
          onClick={() => setShowCTA(true)}
          className="absolute bottom-3 sm:bottom-6 right-3 sm:right-6 z-40 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg shadow-2xl p-3 hover:from-green-700 hover:to-green-800 transition"
        >
          <DollarSign className="w-6 h-6" />
        </button>
      )}

      {/* Application Modal */}
      {selectedJob && (
        <ApplicationModal
          job={selectedJob}
          isOpen={!!selectedJob}
          onClose={() => setSelectedJob(null)}
        />
      )}
    </div>
  );
}
