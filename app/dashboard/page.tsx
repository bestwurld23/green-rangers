'use client';

import { useEffect, useState } from 'react';
import { supabase, type Portfolio, type PortfolioProject, type ProjectPhoto } from '@/lib/supabase';
import Link from 'next/link';
import { Plus, Edit, Trash2, Eye, EyeOff, Instagram, ExternalLink, Briefcase } from 'lucide-react';

type ProjectWithPhotos = PortfolioProject & { photos: ProjectPhoto[] };

export default function Dashboard() {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [projects, setProjects] = useState<ProjectWithPhotos[]>([]);
  const [loading, setLoading] = useState(true);
  const [workerEmail, setWorkerEmail] = useState<string | null>(null);

  // For demo: using email from localStorage or prompt
  useEffect(() => {
    const email = localStorage.getItem('worker_email') || prompt('Enter your email to view dashboard:');
    if (email) {
      localStorage.setItem('worker_email', email);
      setWorkerEmail(email);
      loadPortfolio(email);
    }
  }, []);

  async function loadPortfolio(email: string) {
    try {
      // Load or create portfolio
      let { data: portfolioData, error: portfolioError } = await supabase
        .from('portfolios')
        .select('*')
        .eq('worker_email', email)
        .single();

      if (portfolioError && portfolioError.code === 'PGRST116') {
        // Portfolio doesn't exist, create it
        const { data: newPortfolio, error: createError } = await supabase
          .from('portfolios')
          .insert({ worker_email: email })
          .select()
          .single();

        if (createError) throw createError;
        portfolioData = newPortfolio;
      } else if (portfolioError) {
        throw portfolioError;
      }

      setPortfolio(portfolioData);

      // Load projects with photos
      const { data: projectsData, error: projectsError } = await supabase
        .from('portfolio_projects')
        .select(`
          *,
          photos:project_photos(*)
        `)
        .eq('portfolio_id', portfolioData.id)
        .order('display_order', { ascending: true });

      if (projectsError) throw projectsError;

      setProjects(projectsData as ProjectWithPhotos[]);
    } catch (error) {
      console.error('Error loading portfolio:', error);
    } finally {
      setLoading(false);
    }
  }

  async function toggleVisibility() {
    if (!portfolio) return;

    const { error } = await supabase
      .from('portfolios')
      .update({ is_public: !portfolio.is_public })
      .eq('id', portfolio.id);

    if (error) {
      console.error('Error updating visibility:', error);
    } else {
      setPortfolio({ ...portfolio, is_public: !portfolio.is_public });
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-white mb-4">Portfolio Not Found</h2>
          <p className="text-gray-400 mb-4">We couldn't find a portfolio for this email.</p>
          <button
            onClick={() => {
              localStorage.removeItem('worker_email');
              window.location.reload();
            }}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Try Different Email
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-white hover:text-green-400 transition">
              Green Rangers
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href={`/portfolio/${workerEmail}`}
                target="_blank"
                className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition"
              >
                <ExternalLink className="w-4 h-4" />
                View Public Portfolio
              </Link>
              <Link
                href="/"
                className="px-4 py-2 border border-gray-700 text-gray-400 rounded-lg hover:bg-gray-800 transition"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back!</h1>
          <p className="text-gray-400">{workerEmail}</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Total Projects</p>
                <p className="text-3xl font-bold text-green-500">{portfolio.total_projects}</p>
              </div>
              <Briefcase className="w-12 h-12 text-green-500 opacity-20" />
            </div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Profile Views</p>
                <p className="text-3xl font-bold text-blue-500">{portfolio.profile_views}</p>
              </div>
              <Eye className="w-12 h-12 text-blue-500 opacity-20" />
            </div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Visibility</p>
                <p className="text-xl font-bold text-white">
                  {portfolio.is_public ? 'Public' : 'Private'}
                </p>
              </div>
              <button
                onClick={toggleVisibility}
                className="p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition"
              >
                {portfolio.is_public ? (
                  <Eye className="w-6 h-6 text-green-500" />
                ) : (
                  <EyeOff className="w-6 h-6 text-gray-500" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Portfolio Section */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">My Portfolio</h2>
            <button className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold">
              <Plus className="w-5 h-5" />
              Add New Project
            </button>
          </div>

          {/* Instagram Connection */}
          <div className="mb-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Instagram className="w-6 h-6 text-pink-500" />
                <div>
                  <p className="text-white font-semibold">Instagram</p>
                  <p className="text-sm text-gray-400">
                    {portfolio.instagram_handle ? (
                      `@${portfolio.instagram_handle} ${portfolio.instagram_connected ? '✓ Connected' : ''}`
                    ) : (
                      'Not connected'
                    )}
                  </p>
                </div>
              </div>
              <button className="px-4 py-2 border border-gray-700 text-gray-400 rounded-lg hover:bg-gray-700 transition">
                {portfolio.instagram_handle ? 'Update' : 'Connect'}
              </button>
            </div>
          </div>

          {/* Projects List */}
          {projects.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="w-16 h-16 text-gray-700 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Projects Yet</h3>
              <p className="text-gray-400 mb-6">
                Showcase your work by adding your first project
              </p>
              <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold">
                Add Your First Project
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="flex gap-4 p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition"
                >
                  {/* Photo Grid Preview */}
                  <div className="flex-shrink-0">
                    <div className="grid grid-cols-3 gap-1 w-32 h-32">
                      {project.photos.slice(0, 6).map((photo, idx) => (
                        <div
                          key={photo.id}
                          className="bg-gray-700 rounded overflow-hidden"
                          style={{
                            gridColumn: idx === 0 ? 'span 2' : 'span 1',
                            gridRow: idx === 0 ? 'span 2' : 'span 1',
                          }}
                        >
                          <img
                            src={photo.photo_url}
                            alt={`Project ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-1 text-center">
                      {project.photos.length} photo{project.photos.length !== 1 ? 's' : ''}
                    </p>
                  </div>

                  {/* Project Info */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">{project.title}</h3>
                    <p className="text-sm text-gray-400 mb-2">
                      {project.company} • {project.location}
                    </p>
                    <p className="text-sm text-gray-500 mb-2">
                      {project.project_date && new Date(project.project_date).toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                    {project.skills && project.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {project.skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-green-600/20 text-green-400 rounded text-xs font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition">
                      <Edit className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded transition">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
