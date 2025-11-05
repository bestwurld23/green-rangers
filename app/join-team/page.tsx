'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Users, Upload, FileText, Target, Phone, Mail, Briefcase } from 'lucide-react';

export default function JoinTeam() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    experience: '',
    credentials: '',
    vision: '',
    reference1Name: '',
    reference1Phone: '',
    reference1Relationship: '',
    reference2Name: '',
    reference2Phone: '',
    reference2Relationship: '',
    availability: 'full-time',
    resumeFile: null as File | null,
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual form submission to database
    console.log('Application submitted:', formData);
    setSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        resumeFile: e.target.files[0],
      });
    }
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
                Join Our Team - Daily Pay Opportunities
              </p>
            </div>
            <div className="flex gap-4">
              <Link href="/" className="px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition">
                Job Board
              </Link>
              <Link href="/crew-service" className="px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition">
                Need a Crew?
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
              <h1 className="text-4xl font-bold mb-2">Join Our Crew</h1>
              <p className="text-xl mb-4">Earn $120 per day doing meaningful work</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <span className="font-bold">✓</span>
                  <span>Daily pay - get paid at the end of each day</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="font-bold">✓</span>
                  <span>Flexible scheduling - work when you&apos;re available</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="font-bold">✓</span>
                  <span>Learn new skills in renewable energy & construction</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="font-bold">✓</span>
                  <span>Work with a supportive team in the Chicago area</span>
                </li>
              </ul>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
              <Users className="w-16 h-16 mx-auto mb-2" />
              <p className="text-center font-semibold text-lg">Now Hiring</p>
              <p className="text-center text-sm">Daily Laborers</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Application Form - Takes 2/3 width */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Application Form</h2>

            {submitted ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
                <div className="text-green-600 text-6xl mb-4">✓</div>
                <h3 className="text-2xl font-bold text-green-800 mb-2">Application Submitted!</h3>
                <p className="text-gray-700 mb-4">
                  Thank you for your interest in joining our team. We&apos;ll review your application and contact you within 2-3 business days.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Submit Another Application
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-green-600" />
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name *
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
                        Phone Number *
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
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Location (City, State) *
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
                  </div>
                </div>

                {/* Work Experience */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-green-600" />
                    Work Experience
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Relevant Work Experience *
                      </label>
                      <textarea
                        name="experience"
                        required
                        rows={4}
                        value={formData.experience}
                        onChange={handleChange}
                        placeholder="Describe your previous work experience, especially in construction, assembly, organization, cleanouts, or similar fields..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Availability *
                      </label>
                      <select
                        name="availability"
                        required
                        value={formData.availability}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                      >
                        <option value="full-time">Full-time (5 days/week)</option>
                        <option value="part-time">Part-time (2-3 days/week)</option>
                        <option value="flexible">Flexible (as needed)</option>
                        <option value="weekends">Weekends only</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Credentials & Certifications */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-green-600" />
                    Credentials & Certifications
                  </h3>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Certifications & Skills
                    </label>
                    <textarea
                      name="credentials"
                      rows={3}
                      value={formData.credentials}
                      onChange={handleChange}
                      placeholder="List any certifications (NABCEP, NCCER, OSHA, etc.), licenses, or special skills you have..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Examples: OSHA 10/30, Forklift certified, CDL, Construction experience, Solar installation, etc.
                    </p>
                  </div>
                </div>

                {/* Vision & Goals */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-green-600" />
                    Your Vision & Goals
                  </h3>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Why do you want to join our team? *
                    </label>
                    <textarea
                      name="vision"
                      required
                      rows={4}
                      value={formData.vision}
                      onChange={handleChange}
                      placeholder="Tell us about your career goals and why you're interested in working with Green Rangers..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Resume Upload */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Upload className="w-5 h-5 text-green-600" />
                    Resume
                  </h3>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Upload Resume (PDF, DOC, DOCX)
                    </label>
                    <input
                      type="file"
                      name="resume"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                    />
                    {formData.resumeFile && (
                      <p className="text-sm text-green-600 mt-2">
                        ✓ {formData.resumeFile.name}
                      </p>
                    )}
                  </div>
                </div>

                {/* References */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    References
                  </h3>
                  <div className="space-y-6">
                    {/* Reference 1 */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-700 mb-3">Reference 1 *</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Name
                          </label>
                          <input
                            type="text"
                            name="reference1Name"
                            required
                            value={formData.reference1Name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone
                          </label>
                          <input
                            type="tel"
                            name="reference1Phone"
                            required
                            value={formData.reference1Phone}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Relationship
                          </label>
                          <input
                            type="text"
                            name="reference1Relationship"
                            required
                            placeholder="Former supervisor"
                            value={formData.reference1Relationship}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Reference 2 */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-700 mb-3">Reference 2 *</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Name
                          </label>
                          <input
                            type="text"
                            name="reference2Name"
                            required
                            value={formData.reference2Name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone
                          </label>
                          <input
                            type="tel"
                            name="reference2Phone"
                            required
                            value={formData.reference2Phone}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Relationship
                          </label>
                          <input
                            type="text"
                            name="reference2Relationship"
                            required
                            placeholder="Former colleague"
                            value={formData.reference2Relationship}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition shadow-lg text-lg"
                >
                  Submit Application
                </button>
              </form>
            )}
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            {/* What We Offer */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">What We Offer</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold text-xl">💰</span>
                  <div>
                    <p className="font-semibold text-gray-800">Daily Pay</p>
                    <p className="text-sm text-gray-600">$120 per day, paid at end of shift</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold text-xl">📅</span>
                  <div>
                    <p className="font-semibold text-gray-800">Flexible Schedule</p>
                    <p className="text-sm text-gray-600">Choose your availability</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold text-xl">🎓</span>
                  <div>
                    <p className="font-semibold text-gray-800">Training Provided</p>
                    <p className="text-sm text-gray-600">Learn on the job</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold text-xl">🤝</span>
                  <div>
                    <p className="font-semibold text-gray-800">Team Environment</p>
                    <p className="text-sm text-gray-600">Work with supportive crew</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Job Types */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Job Types</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  Assembly & Installation
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  Organization & Warehouse
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  Property Cleanouts
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  Solar Installation
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  General Construction
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  Event Setup
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Questions?</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-green-600" />
                  <a href="tel:+18157330586" className="text-green-600 hover:text-green-700">
                    (815) 733-0586
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-green-600" />
                  <a href="mailto:info@greenrangers.xyz" className="text-green-600 hover:text-green-700">
                    info@greenrangers.xyz
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2025 Green Rangers. Join our team and earn daily pay doing meaningful work.</p>
        </div>
      </footer>
    </div>
  );
}
