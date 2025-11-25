import React, { useState, useRef } from 'react';
import { Upload, X, Check, Loader, User, Camera, Music } from 'lucide-react';
import { CastingSubmission } from '../types';
import { MockBackend } from '../services/mockBackend';

const Casting: React.FC = () => {
  const [step, setStep] = useState<'FORM' | 'SUBMITTING' | 'SUCCESS'>('FORM');
  const [images, setImages] = useState<File[]>([]);
  const [audio, setAudio] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    socialHandle: '',
    type: 'Actor',
    voluntaryAgreement: false,
    signature: ''
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      if (images.length + newFiles.length > 10) {
        alert("Maximum 10 images allowed.");
        return;
      }
      setImages(prev => [...prev, ...newFiles]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.voluntaryAgreement) {
      alert("You must agree to the voluntary terms.");
      return;
    }
    if (images.length === 0) {
      alert("Please upload at least one photo.");
      return;
    }

    setStep('SUBMITTING');
    
    const submission: CastingSubmission = {
      ...formData,
      images,
      audio
    };

    await MockBackend.uploadCastingData(submission);
    setStep('SUCCESS');
  };

  if (step === 'SUCCESS') {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-gray-900 border border-green-500/50 p-8 rounded-2xl text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-green-500/10 animate-pulse"></div>
          <Check className="h-16 w-16 text-green-500 mx-auto mb-4 relative z-10" />
          <h2 className="font-future text-2xl font-bold text-white mb-2 relative z-10">Submission Received</h2>
          <p className="text-gray-300 mb-6 relative z-10">
            Welcome to the cast, <span className="text-green-400 font-bold">{formData.name}</span>. 
            We've created a secure folder for your portfolio. Check your email for confirmation.
          </p>
          <button 
            onClick={() => {
              setStep('FORM');
              setImages([]);
              setAudio(null);
              setFormData({ ...formData, signature: '', voluntaryAgreement: false });
            }}
            className="relative z-10 bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded font-future text-sm transition-colors"
          >
            Submit Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      {/* Featured Cast Slideshow Header */}
      <div className="max-w-5xl mx-auto mb-12">
        <h2 className="font-future text-3xl font-bold text-white mb-6 border-l-4 border-red-600 pl-4">
          Open Casting Call
        </h2>
        <div className="w-full h-48 sm:h-64 rounded-xl overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black z-10"></div>
          <div className="flex h-full animate-[scroll_20s_linear_infinite] hover:[animation-play-state:paused]">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <img 
                key={i}
                src={`https://picsum.photos/id/${100 + i}/400/300`} 
                alt="Cast" 
                className="h-full w-64 object-cover flex-shrink-0 mr-1 opacity-70 hover:opacity-100 transition-opacity"
              />
            ))}
          </div>
          <div className="absolute bottom-4 left-4 z-20">
            <p className="text-red-500 font-future text-sm tracking-widest">JOIN THE REVOLUTION</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto bg-black/50 backdrop-blur-md border border-gray-800 rounded-2xl p-6 md:p-10 shadow-2xl">
        {step === 'SUBMITTING' ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader className="h-12 w-12 text-red-600 animate-spin mb-4" />
            <p className="font-future text-xl text-white">Securely Uploading to Cloud Drive...</p>
            <p className="text-gray-500 text-sm mt-2">Creating dynamic folder: /Casting/{formData.socialHandle || 'User'}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Personal Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-600" />
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2 px-4 text-white focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Social Handle</label>
                <input
                  required
                  type="text"
                  value={formData.socialHandle}
                  onChange={(e) => setFormData({...formData, socialHandle: e.target.value})}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2 px-4 text-white focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all"
                  placeholder="@username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Talent Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2 px-4 text-white focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all"
                >
                  <option>Actor</option>
                  <option>Voice Artist</option>
                  <option>Extra</option>
                  <option>Musician</option>
                </select>
              </div>
            </div>

            {/* Media Upload */}
            <div className="space-y-4 pt-4 border-t border-gray-800">
              <label className="block text-sm font-future text-red-500 uppercase tracking-wide">
                Portfolio Uploads
              </label>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Image Upload */}
                <div className="border-2 border-dashed border-gray-700 rounded-lg p-4 hover:border-red-500 transition-colors bg-gray-900/50">
                  <div className="flex flex-col items-center justify-center cursor-pointer relative h-32">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <Camera className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-300">Upload Photos (Max 10)</span>
                    <span className="text-xs text-gray-500 mt-1">{images.length}/10 selected</span>
                  </div>
                </div>

                {/* Audio Upload */}
                <div className="border-2 border-dashed border-gray-700 rounded-lg p-4 hover:border-red-500 transition-colors bg-gray-900/50">
                  <div className="flex flex-col items-center justify-center cursor-pointer relative h-32">
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={(e) => setAudio(e.target.files ? e.target.files[0] : null)}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <Music className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-300">Upload Audio Reel</span>
                    <span className="text-xs text-gray-500 mt-1">{audio ? audio.name : 'No file chosen'}</span>
                  </div>
                </div>
              </div>

              {/* Image Previews */}
              {images.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative h-16 w-16 group">
                      <img 
                        src={URL.createObjectURL(img)} 
                        alt="Preview" 
                        className="h-full w-full object-cover rounded border border-gray-600"
                      />
                      <button 
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute -top-1 -right-1 bg-red-600 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Legal */}
            <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={formData.voluntaryAgreement}
                  onChange={(e) => setFormData({...formData, voluntaryAgreement: e.target.checked})}
                  className="mt-1 h-4 w-4 rounded border-gray-600 text-red-600 focus:ring-red-500 bg-gray-900"
                />
                <span className="text-sm text-gray-400 leading-relaxed">
                  I understand that this is a <strong className="text-white">community project</strong>. 
                  My participation is voluntary, and I acknowledge that there is <strong className="text-white">no financial compensation</strong>. 
                  All uploaded materials will be stored securely in the production team's private drive.
                </span>
              </label>
            </div>

            {/* Signature */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Electronic Signature</label>
              <input
                required
                type="text"
                value={formData.signature}
                onChange={(e) => setFormData({...formData, signature: e.target.value})}
                className="w-full bg-gray-900 border-b-2 border-gray-600 py-2 px-2 text-white font-handwriting italic text-lg focus:border-red-600 outline-none transition-colors"
                placeholder="Type your full name"
              />
              <p className="text-xs text-gray-600 mt-1">By typing your name, you sign this agreement.</p>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-red-700 to-red-600 text-white font-future font-bold py-4 rounded-lg hover:from-red-600 hover:to-red-500 transform hover:scale-[1.01] transition-all shadow-lg shadow-red-900/20"
            >
              COMPLETE CASTING PROFILE
            </button>

          </form>
        )}
      </div>
    </div>
  );
};

export default Casting;