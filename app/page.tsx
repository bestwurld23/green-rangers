import Link from 'next/link';
import { Briefcase, Users, MapPin } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
      {/* Header */}
      <div className="text-center mb-12 sm:mb-16">
        <h1 className="text-4xl sm:text-6xl font-bold text-white mb-3">
          Green Rangers
        </h1>
        <p className="text-green-400 text-lg sm:text-xl">
          Illinois Renewable Energy Workforce
        </p>
      </div>

      {/* Three Main Options */}
      <div className="w-full max-w-2xl space-y-4 sm:space-y-6">
        {/* Job Board Button */}
        <Link
          href="/job-board"
          className="block w-full bg-green-600 hover:bg-green-700 text-white rounded-2xl p-8 sm:p-10 transition-all duration-300 transform hover:scale-105 shadow-2xl group"
        >
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="bg-white/20 rounded-xl p-4 group-hover:bg-white/30 transition">
              <MapPin className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>
            <div className="text-left">
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">Job Board</h2>
              <p className="text-green-100 text-sm sm:text-base">
                Explore 100+ renewable energy jobs across Illinois
              </p>
            </div>
          </div>
        </Link>

        {/* Join Our Team Button */}
        <Link
          href="/join-team"
          className="block w-full bg-green-600 hover:bg-green-700 text-white rounded-2xl p-8 sm:p-10 transition-all duration-300 transform hover:scale-105 shadow-2xl group"
        >
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="bg-white/20 rounded-xl p-4 group-hover:bg-white/30 transition">
              <Users className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>
            <div className="text-left">
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">Join Our Team</h2>
              <p className="text-green-100 text-sm sm:text-base">
                Apply to work with certified green energy crews
              </p>
            </div>
          </div>
        </Link>

        {/* Hire Our Crew Button */}
        <Link
          href="/crew-service"
          className="block w-full bg-green-600 hover:bg-green-700 text-white rounded-2xl p-8 sm:p-10 transition-all duration-300 transform hover:scale-105 shadow-2xl group"
        >
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="bg-white/20 rounded-xl p-4 group-hover:bg-white/30 transition">
              <Briefcase className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>
            <div className="text-left">
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">Hire Our Crew</h2>
              <p className="text-green-100 text-sm sm:text-base">
                Get certified day labor at $120/day per person
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* Footer */}
      <footer className="mt-16 text-center">
        <p className="text-gray-500 text-sm">
          NABCEP, NCCER, and OSHA Certified Professionals
        </p>
      </footer>
    </div>
  );
}
