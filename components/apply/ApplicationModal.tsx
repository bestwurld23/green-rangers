'use client';

import { useState } from 'react';
import { X, Upload, CheckCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Job } from '@/components/map/JobMap';

type ApplicationModalProps = {
  job: Job;
  isOpen: boolean;
  onClose: () => void;
};

export default function ApplicationModal({ job, isOpen, onClose }: ApplicationModalProps) {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    nabcep_certified: false,
    nccer_certified: false,
    osha_certified: false,
    other_certifications: '',
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      let resumeUrl = null;

      // Upload resume if provided
      if (resumeFile) {
        const fileExt = resumeFile.name.split('.').pop();
        const fileName = `${Date.now()}-${formData.email.replace('@', '-')}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('resumes')
          .upload(fileName, resumeFile);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('resumes')
          .getPublicUrl(fileName);

        resumeUrl = publicUrl;
      }

      // Save application
      const { error: insertError } = await supabase
        .from('applications')
        .insert({
          full_name: formData.full_name,
          email: formData.email,
          phone: formData.phone,
          resume_url: resumeUrl,
          job_id: job.id,
          job_title: job.title,
          company: job.company,
          job_link: job.postLink || null,
          nabcep_certified: formData.nabcep_certified,
          nccer_certified: formData.nccer_certified,
          osha_certified: formData.osha_certified,
          other_certifications: formData.other_certifications || null,
          status: 'pending',
          source: 'job_board',
        });

      if (insertError) throw insertError;

      // Check if worker profile exists, create/update it
      const { data: existingProfile } = await supabase
        .from('worker_profiles')
        .select('*')
        .eq('email', formData.email)
        .single();

      if (existingProfile) {
        // Update existing profile
        await supabase
          .from('worker_profiles')
          .update({
            full_name: formData.full_name,
            phone: formData.phone,
            resume_url: resumeUrl || existingProfile.resume_url,
            nabcep_certified: formData.nabcep_certified,
            nccer_certified: formData.nccer_certified,
            osha_certified: formData.osha_certified,
            other_certifications: formData.other_certifications || null,
            applications_count: existingProfile.applications_count + 1,
            last_applied_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('email', formData.email);
      } else {
        // Create new profile
        await supabase
          .from('worker_profiles')
          .insert({
            email: formData.email,
            full_name: formData.full_name,
            phone: formData.phone,
            resume_url: resumeUrl,
            nabcep_certified: formData.nabcep_certified,
            nccer_certified: formData.nccer_certified,
            osha_certified: formData.osha_certified,
            other_certifications: formData.other_certifications || null,
            applications_count: 1,
            last_applied_at: new Date().toISOString(),
          });
      }

      setSubmitted(true);
    } catch (err) {
      console.error('Error submitting application:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      full_name: '',
      email: '',
      phone: '',
      nabcep_certified: false,
      nccer_certified: false,
      osha_certified: false,
      other_certifications: '',
    });
    setResumeFile(null);
    setSubmitted(false);
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-t-2xl">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition"
          >
            <X className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-bold mb-2">Apply with Green Rangers</h2>
          <p className="text-green-100 text-sm">{job.title} at {job.company}</p>
        </div>

        {/* Content */}
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Application Submitted!</h3>
              <p className="text-gray-600 mb-6">
                We&apos;ve received your application and will forward it to {job.company}.
                You&apos;ll hear back soon!
              </p>
              <button
                onClick={handleClose}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                />
              </div>

              {/* Resume Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Resume (PDF, DOC, or DOCX)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-600 transition">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                    className="hidden"
                    id="resume-upload"
                  />
                  <label htmlFor="resume-upload" className="cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      {resumeFile ? resumeFile.name : 'Click to upload your resume'}
                    </p>
                  </label>
                </div>
              </div>

              {/* Certifications */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Certifications
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.nabcep_certified}
                      onChange={(e) => setFormData({ ...formData, nabcep_certified: e.target.checked })}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-600"
                    />
                    <span className="text-gray-700">NABCEP Certified</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.nccer_certified}
                      onChange={(e) => setFormData({ ...formData, nccer_certified: e.target.checked })}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-600"
                    />
                    <span className="text-gray-700">NCCER Certified</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.osha_certified}
                      onChange={(e) => setFormData({ ...formData, osha_certified: e.target.checked })}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-600"
                    />
                    <span className="text-gray-700">OSHA Certified</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Other Certifications
                </label>
                <input
                  type="text"
                  value={formData.other_certifications}
                  onChange={(e) => setFormData({ ...formData, other_certifications: e.target.value })}
                  placeholder="List any other relevant certifications..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
                  {error}
                </div>
              )}

              {/* Info Box */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  <strong>What happens next:</strong> Your application will be sent to {job.company}.
                  Green Rangers will also keep your profile for future opportunities.
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Application'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
