import React, { useState } from 'react';
import { Send, Building, Mail } from 'lucide-react';
import { MockBackend } from '../services/mockBackend';

const Sponsors: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    companyName: '',
    contactName: '',
    email: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await MockBackend.submitSponsorship(form);
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center px-4">
        <div className="max-w-xl w-full text-center space-y-6">
          <h1 className="font-future text-4xl md:text-6xl text-white font-bold">THANK YOU</h1>
          <p className="text-xl text-gray-300">
            We have received your inquiry, {form.contactName}.<br/>
            An acknowledgment email has been sent to {form.email}.
          </p>
          <div className="h-1 w-32 bg-red-600 mx-auto rounded-full"></div>
          <button 
            onClick={() => { setSubmitted(false); setForm({ companyName: '', contactName: '', email: '', message: '' }); }}
            className="mt-8 text-red-500 hover:text-white transition-colors"
          >
            Send Another Inquiry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 flex flex-col items-center relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-900/10 rounded-full blur-3xl -z-10"></div>
      
      <div className="max-w-2xl w-full">
        <div className="text-center mb-12">
          <h2 className="font-future text-4xl font-bold text-white mb-4">PARTNER WITH US</h2>
          <p className="text-gray-400">Help us shape the future of independent cinema. We are looking for visionary sponsors.</p>
        </div>

        <div className="bg-gray-900/80 backdrop-blur border border-gray-800 p-8 rounded-2xl shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-400 text-sm mb-2 font-future uppercase">Company Name</label>
              <div className="relative">
                <Building className="absolute left-3 top-3 h-5 w-5 text-gray-600" />
                <input 
                  type="text" 
                  required
                  value={form.companyName}
                  onChange={e => setForm({...form, companyName: e.target.value})}
                  className="w-full bg-black/50 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-colors"
                  placeholder="Future Corp Industries"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-400 text-sm mb-2 font-future uppercase">Contact Person</label>
                <input 
                  type="text" 
                  required
                  value={form.contactName}
                  onChange={e => setForm({...form, contactName: e.target.value})}
                  className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-colors"
                  placeholder="Jane Smith"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2 font-future uppercase">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-600" />
                  <input 
                    type="email" 
                    required
                    value={form.email}
                    onChange={e => setForm({...form, email: e.target.value})}
                    className="w-full bg-black/50 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-colors"
                    placeholder="contact@futurecorp.com"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2 font-future uppercase">Message</label>
              <textarea 
                rows={4}
                required
                value={form.message}
                onChange={e => setForm({...form, message: e.target.value})}
                className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-colors"
                placeholder="How would you like to collaborate?"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 bg-white text-black font-future font-bold py-4 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <span>SENDING...</span>
              ) : (
                <>
                  <span>INITIATE PARTNERSHIP</span>
                  <Send className="h-5 w-5" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Sponsors;