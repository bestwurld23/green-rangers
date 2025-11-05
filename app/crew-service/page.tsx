'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, Users, DollarSign } from 'lucide-react';

export default function CrewService() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    location: '',
    date: '',
    crewSize: '1',
    projectType: '',
    description: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual form submission to database
    console.log('Crew request:', formData);
    setSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/" className="text-3xl font-bold text-green-700 hover:text-green-800">
                🌿 Green Rangers
              </Link>
              <p className="text-gray-600 mt-1">
                Professional Day Labor Crew Service
              </p>
            </div>
            <div className="flex gap-4">
              <Link href="/" className="px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition">
                Job Board
              </Link>
              <Link href="/join-team" className="px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition">
                Join Our Team
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg shadow-lg p-8 mb-8 text-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">Need a Crew?</h1>
              <p className="text-xl mb-4">Professional day labor services for your project</p>
              <div className="flex items-center gap-2 text-2xl font-bold">
                <DollarSign className="w-8 h-8" />
                <span>$120 per person, per day</span>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <Users className="w-16 h-16 mx-auto mb-2" />
              <p className="text-center font-semibold">Skilled Workers Ready</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Request Form */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Request a Crew</h2>

            {submitted ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <div className="text-green-600 text-5xl mb-4">✓</div>
                <h3 className="text-xl font-bold text-green-800 mb-2">Request Submitted!</h3>
                <p className="text-gray-700 mb-4">
                  We&apos;ll contact you shortly to confirm your crew request.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Submit Another Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Project Date *
                    </label>
                    <input
                      type="date"
                      name="date"
                      required
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Crew Size Needed *
                    </label>
                    <select
                      name="crewSize"
                      required
                      value={formData.crewSize}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                    >
                      <option value="1">1 person</option>
                      <option value="2">2 people</option>
                      <option value="3">3 people</option>
                      <option value="4">4 people</option>
                      <option value="5">5 people</option>
                      <option value="6+">6+ people</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    required
                    placeholder="Chicago, IL"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Project Type *
                  </label>
                  <input
                    type="text"
                    name="projectType"
                    required
                    placeholder="Solar installation, landscaping, construction, etc."
                    value={formData.projectType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Project Description
                  </label>
                  <textarea
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Provide details about the work needed..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                  />
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-gray-700">
                    <strong>Estimated Cost:</strong> ${parseInt(formData.crewSize) * 120 || 120} for {formData.crewSize} {parseInt(formData.crewSize) === 1 ? 'person' : 'people'}
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition shadow-lg"
                >
                  Submit Crew Request
                </button>
              </form>
            )}
          </div>

          {/* Contact Info & Services */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Contact Us</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Phone className="w-6 h-6 text-green-600 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-800">Phone</p>
                    <a href="tel:+18157330586" className="text-green-600 hover:text-green-700">
                      (815) 733-0586
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-6 h-6 text-green-600 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-800">Email</p>
                    <a href="mailto:info@greenrangers.xyz" className="text-green-600 hover:text-green-700">
                      info@greenrangers.xyz
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-6 h-6 text-green-600 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-800">Service Area</p>
                    <p className="text-gray-600">Chicago, IL & Surrounding Areas</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Services Offered */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Our Services</h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span className="text-gray-700">Assembly & installation work</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span className="text-gray-700">Organization & warehouse support</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span className="text-gray-700">Craft laborer services</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span className="text-gray-700">Property cleanouts & junk removal</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span className="text-gray-700">Solar panel installation & maintenance</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span className="text-gray-700">General construction & labor</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span className="text-gray-700">Event setup & teardown</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span className="text-gray-700">Moving & loading assistance</span>
                </li>
              </ul>
            </div>

            {/* Why Choose Us */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Why Choose Us?</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">✓ Certified & Trained</h3>
                  <p className="text-sm text-gray-600">Our crew members have NABCEP, NCCER, and OSHA certifications</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">✓ Flexible Scheduling</h3>
                  <p className="text-sm text-gray-600">Same-day and next-day availability for urgent projects</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">✓ Fair Pricing</h3>
                  <p className="text-sm text-gray-600">Transparent $120/day per person rate with no hidden fees</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">✓ Local & Reliable</h3>
                  <p className="text-sm text-gray-600">Chicago-based team supporting the local community</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2025 Green Rangers. Professional day labor & renewable energy careers.</p>
        </div>
      </footer>
    </div>
  );
}
