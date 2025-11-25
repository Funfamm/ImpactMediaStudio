import React, { useEffect, useState } from 'react';
import { getSubmissions } from '../services/mockBackend';
import { Submission } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { FileText, X, ExternalLink, PenTool } from 'lucide-react';

export const Admin: React.FC = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

  useEffect(() => {
    setSubmissions(getSubmissions());
  }, []);

  // Prepare chart data
  const platformData = [
    { name: 'Instagram', count: submissions.filter(s => s.platform === 'Instagram').length },
    { name: 'Twitter', count: submissions.filter(s => s.platform === 'Twitter').length },
    { name: 'TikTok', count: submissions.filter(s => s.platform === 'TikTok').length },
  ];

  return (
    <div className="min-h-screen pt-24 px-4 md:px-8 pb-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-white border-l-4 border-neon-blue pl-4">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-1 bg-gray-900 p-6 rounded-xl border border-gray-800">
                <h3 className="text-gray-400 mb-4 text-sm uppercase">Total Submissions</h3>
                <p className="text-5xl font-bold text-white">{submissions.length}</p>
            </div>
            
            <div className="lg:col-span-2 bg-gray-900 p-6 rounded-xl border border-gray-800 h-64">
                <h3 className="text-gray-400 mb-4 text-sm uppercase">Platform Analytics</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={platformData}>
                        <XAxis dataKey="name" stroke="#666" />
                        <YAxis stroke="#666" />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }}
                            cursor={{fill: 'rgba(255,255,255,0.05)'}}
                        />
                        <Bar dataKey="count" fill="#bc13fe" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

        <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-800">
                <h3 className="font-bold">Recent Submissions</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-400">
                    <thead className="bg-black/50 text-gray-200 uppercase text-xs">
                        <tr>
                            <th className="px-6 py-3">Name</th>
                            <th className="px-6 py-3">Handle</th>
                            <th className="px-6 py-3">Platform</th>
                            <th className="px-6 py-3">Date</th>
                            <th className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {submissions.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center italic">No submissions yet. Go to Casting to test.</td>
                            </tr>
                        ) : (
                            submissions.map(sub => (
                                <tr key={sub.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 font-medium text-white">{sub.name}</td>
                                    <td className="px-6 py-4 text-neon-blue">@{sub.socialHandle}</td>
                                    <td className="px-6 py-4">{sub.platform}</td>
                                    <td className="px-6 py-4">{new Date(sub.timestamp).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">
                                        <button 
                                          onClick={() => setSelectedSubmission(sub)}
                                          className="text-white hover:text-neon-blue transition-colors flex items-center gap-1"
                                        >
                                          <FileText className="w-4 h-4" /> View
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
      </div>

      {/* Submission Details Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-900 w-full max-w-2xl rounded-2xl border border-gray-700 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-black/40">
              <h2 className="text-xl font-bold text-white">Candidate Dossier</h2>
              <button onClick={() => setSelectedSubmission(null)} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 uppercase">Name</label>
                  <p className="text-white font-medium">{selectedSubmission.name}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase">Email</label>
                  <p className="text-white font-medium">{selectedSubmission.email}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase">Social Handle</label>
                  <p className="text-neon-blue font-medium">@{selectedSubmission.socialHandle} ({selectedSubmission.platform})</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase">Submitted</label>
                  <p className="text-gray-300">{new Date(selectedSubmission.timestamp).toLocaleString()}</p>
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500 uppercase">Bio / Experience</label>
                <div className="bg-black/30 p-3 rounded mt-1 text-sm text-gray-300 leading-relaxed border border-gray-800">
                  {selectedSubmission.bio}
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500 uppercase mb-2 block">Cloud Storage Assets</label>
                <div className="space-y-2">
                  {selectedSubmission.files.map((url, idx) => (
                    <a 
                      key={idx} 
                      href={url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2 bg-gray-800 rounded hover:bg-gray-700 transition-colors text-xs text-neon-blue truncate"
                    >
                      <ExternalLink className="w-3 h-3 flex-shrink-0" />
                      {url}
                    </a>
                  ))}
                </div>
              </div>

              <div>
                 <label className="text-xs text-gray-500 uppercase mb-2 block flex items-center gap-1">
                    <PenTool className="w-3 h-3" /> Signed Waiver
                 </label>
                 <div className="border border-gray-700 bg-white/5 rounded p-2">
                    <img src={selectedSubmission.signature} alt="Signature" className="max-h-20 opacity-80 invert" />
                 </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-800 bg-black/40 flex justify-end gap-3">
               <button onClick={() => setSelectedSubmission(null)} className="px-4 py-2 text-sm text-gray-400 hover:text-white">Close</button>
               <button className="px-4 py-2 text-sm bg-neon-blue text-black font-bold rounded hover:bg-white transition-colors">Approve Candidate</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};