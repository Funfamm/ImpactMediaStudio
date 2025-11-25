import React, { useState, useEffect, useRef } from 'react';
import { Upload, Mic, Loader2, CheckCircle, Sparkles, Image as ImageIcon, Music, StopCircle, Trash2 } from 'lucide-react';
import { SignaturePad } from '../components/SignaturePad';
import { uploadToDriveSimulation, sendConfirmationEmail, saveSubmission } from '../services/mockBackend';
import { generateCastingFeedback } from '../services/geminiService';
import { Submission } from '../types';

// SIMULATED FOLDER: "Casting Page Backgrounds"
// One picture per screen logic with motivation text
const CASTING_FOLDER = [
  {
    filename: "casting_01.jpg",
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop",
    quote: "UNLEASH YOUR POTENTIAL"
  },
  {
    filename: "casting_02.jpg",
    url: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1964&auto=format&fit=crop",
    quote: "THE WORLD IS WATCHING"
  },
  {
    filename: "casting_03.jpg",
    url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1887&auto=format&fit=crop",
    quote: "BECOME THE ICON"
  },
  {
    filename: "casting_04.jpg",
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop",
    quote: "YOUR VOICE MATTERS"
  }
];

export const Casting: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  
  // Audio Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    platform: 'Instagram' as Submission['platform'],
    socialHandle: '',
    bio: '',
  });
  
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [signature, setSignature] = useState('');

  // Slideshow Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % CASTING_FOLDER.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Cleanup audio url
  useEffect(() => {
    return () => {
      if (audioPreviewUrl) URL.revokeObjectURL(audioPreviewUrl);
    };
  }, [audioPreviewUrl]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).filter((f: File) => f.type.startsWith('image/'));
      setImageFiles(prev => [...prev, ...newFiles].slice(0, 10));
    }
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith('audio/')) {
        setAudioFile(file);
        setAudioBlob(null); // Clear recorded if uploaded
        setAudioPreviewUrl(URL.createObjectURL(file));
      }
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/mp3' });
        setAudioBlob(blob);
        setAudioPreviewUrl(URL.createObjectURL(blob));
        setAudioFile(null); // Clear upload if recorded
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      // Detailed error message for user
      if (err instanceof DOMException && err.name === "NotAllowedError") {
        alert("Microphone access denied. Please enable microphone permissions in your browser settings to record audio.");
      } else if (err instanceof DOMException && err.name === "NotFoundError") {
        alert("No microphone found. Please connect a microphone or upload an MP3 file instead.");
      } else {
        alert("Could not access microphone. Please upload an MP3 instead.");
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getAIFeedback = async () => {
    if (!formData.name || !formData.bio) return;
    setAiLoading(true);
    const feedback = await generateCastingFeedback(formData.name, formData.bio);
    setAiFeedback(feedback);
    setAiLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signature) {
      alert("Please sign the digital release form.");
      return;
    }

    setIsLoading(true);
    try {
      // Prepare files for "upload"
      const allFiles = [...imageFiles];
      if (audioFile) allFiles.push(audioFile);
      else if (audioBlob) {
        const recordedFile = new File([audioBlob], `recording_${Date.now()}.mp3`, { type: 'audio/mp3' });
        allFiles.push(recordedFile);
      }

      const fileUrls = await uploadToDriveSimulation(formData.socialHandle, allFiles);
      
      const submission: Submission = {
        id: crypto.randomUUID(),
        ...formData,
        files: fileUrls,
        signature,
        timestamp: Date.now(),
        status: 'Pending'
      };
      
      await saveSubmission(submission);
      await sendConfirmationEmail(formData.email, formData.name, 'casting');
      setStep(3);
    } catch (error) {
      console.error(error);
      alert("Submission failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative bg-black text-white">
      
      {/* Full Screen Background Slideshow from "Casting Folder" */}
      <div className="fixed inset-0 z-0">
        {CASTING_FOLDER.map((slide, index) => (
          <div
            key={slide.filename}
            className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Gentle Zoom Effect */}
            <div 
              className={`absolute inset-0 bg-cover bg-center transition-transform duration-[8000ms] ease-linear ${
                index === currentSlide ? 'scale-105' : 'scale-100'
              }`}
              style={{ backgroundImage: `url(${slide.url})` }}
            />
            <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"></div>
          </div>
        ))}
      </div>

      {/* Motivational Quote Overlay - Fixed Center/Top */}
      <div className="fixed top-24 left-0 right-0 z-10 flex justify-center pointer-events-none">
          <h2 key={currentSlide} className="text-3xl md:text-5xl font-display font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 tracking-[0.2em] text-center px-4 animate-fade-in drop-shadow-2xl">
              {CASTING_FOLDER[currentSlide].quote}
          </h2>
      </div>

      {/* Main Content / Form Container */}
      <div className="relative z-20 pt-44 pb-20 px-4 md:px-8 max-w-5xl mx-auto">
         
         {step === 1 && (
           <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl animate-fade-in">
             <div className="mb-6 flex items-center justify-between border-b border-gray-700 pb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Sparkles className="text-neon-blue" /> CANDIDATE PROFILE
                </h3>
                <span className="text-xs font-mono text-gray-500">STEP 1 OF 2</span>
             </div>

             <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                   <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Full Name</label>
                   <input 
                     required
                     type="text" 
                     className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-neon-blue focus:ring-1 focus:ring-neon-blue outline-none transition-all"
                     value={formData.name}
                     onChange={e => setFormData({...formData, name: e.target.value})}
                   />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Email Address</label>
                   <input 
                     required
                     type="email" 
                     className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-neon-blue focus:ring-1 focus:ring-neon-blue outline-none transition-all"
                     value={formData.email}
                     onChange={e => setFormData({...formData, email: e.target.value})}
                   />
                 </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                   <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Platform</label>
                   <select 
                      className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-neon-blue outline-none"
                      value={formData.platform}
                      onChange={(e: any) => setFormData({...formData, platform: e.target.value})}
                   >
                     <option value="Instagram">Instagram</option>
                     <option value="Twitter">Twitter</option>
                     <option value="TikTok">TikTok</option>
                     <option value="YouTube">YouTube</option>
                   </select>
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Handle (@username)</label>
                   <input 
                     required
                     type="text" 
                     placeholder="@"
                     className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-neon-blue outline-none"
                     value={formData.socialHandle}
                     onChange={e => setFormData({...formData, socialHandle: e.target.value})}
                   />
                 </div>
               </div>

               <div>
                 <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Bio & Experience</label>
                 <textarea 
                   required
                   rows={4}
                   className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-neon-blue outline-none"
                   placeholder="Tell us why you belong in the future..."
                   value={formData.bio}
                   onChange={e => setFormData({...formData, bio: e.target.value})}
                 ></textarea>
                  
                 {/* AI Feature */}
                 <div className="mt-3 flex items-center justify-between">
                   <button 
                     type="button"
                     onClick={getAIFeedback}
                     disabled={!formData.bio || aiLoading}
                     className="flex items-center gap-2 text-xs font-bold text-neon-purple hover:text-white transition-colors bg-neon-purple/10 px-3 py-1.5 rounded-full border border-neon-purple/30"
                   >
                     <Sparkles className="w-3 h-3" />
                     {aiLoading ? 'ANALYZING...' : 'GET AI CASTING FEEDBACK'}
                   </button>
                 </div>
                 
                 {aiFeedback && (
                   <div className="mt-3 p-4 bg-gradient-to-r from-neon-purple/20 to-transparent border-l-2 border-neon-purple">
                      <p className="text-sm text-gray-200 italic font-light">"{aiFeedback}"</p>
                   </div>
                 )}
               </div>

               <div className="flex justify-end pt-4">
                 <button type="submit" className="bg-white text-black font-bold py-3 px-10 rounded-full hover:bg-neon-blue hover:text-white hover:scale-105 transition-all duration-300 shadow-lg">
                   NEXT STEP
                 </button>
               </div>
             </form>
           </div>
         )}

         {step === 2 && (
           <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl animate-fade-in">
             <div className="mb-6 flex items-center justify-between border-b border-gray-700 pb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Upload className="text-neon-blue" /> MEDIA ASSETS
                </h3>
                <span className="text-xs font-mono text-gray-500">STEP 2 OF 2</span>
             </div>

             <form onSubmit={handleSubmit} className="space-y-8">
               
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                   {/* 1. PHOTO UPLOAD SECTION */}
                   <div className="space-y-4">
                        <label className="block text-sm font-bold text-white flex items-center gap-2">
                            <ImageIcon className="text-neon-pink w-4 h-4" /> PHOTOS
                        </label>
                        <div className="border-2 border-dashed border-gray-700 bg-gray-900/30 rounded-xl p-6 text-center hover:border-neon-pink hover:bg-gray-900/50 transition-all cursor-pointer relative min-h-[200px] flex flex-col items-center justify-center">
                            <input 
                            type="file" 
                            multiple 
                            accept="image/*"
                            onChange={handleImageChange}
                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                            />
                            <div className="p-3 bg-gray-800 rounded-full mb-3">
                                <Upload className="w-6 h-6 text-gray-400" />
                            </div>
                            <p className="text-sm text-gray-300 font-medium">Drop photos here</p>
                            <p className="text-xs text-gray-500 mt-1">Up to 10 images</p>
                        </div>

                        {imageFiles.length > 0 && (
                            <div className="grid grid-cols-4 gap-2">
                                {imageFiles.map((file, idx) => (
                                    <div key={idx} className="relative group aspect-square rounded overflow-hidden">
                                        <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="prev" />
                                        <button 
                                            type="button"
                                            onClick={() => removeImage(idx)}
                                            className="absolute inset-0 bg-red-500/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                                        >
                                            <Trash2 className="w-4 h-4 text-white" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                   </div>

                   {/* 2. AUDIO UPLOAD SECTION */}
                   <div className="space-y-4">
                        <label className="block text-sm font-bold text-white flex items-center gap-2">
                            <Music className="text-neon-blue w-4 h-4" /> VOICE SAMPLE
                        </label>
                        
                        <div className="bg-gray-900/30 border border-gray-700 rounded-xl p-6">
                            <div className="flex gap-4 mb-4">
                                <button 
                                    type="button" 
                                    onClick={() => document.getElementById('audio-upload')?.click()}
                                    className="flex-1 bg-gray-800 hover:bg-gray-700 py-2 rounded text-xs font-bold text-gray-300 transition-colors"
                                >
                                    UPLOAD MP3
                                </button>
                                <button 
                                    type="button"
                                    onClick={isRecording ? stopRecording : startRecording}
                                    className={`flex-1 py-2 rounded text-xs font-bold text-white transition-colors flex items-center justify-center gap-2 ${isRecording ? 'bg-red-600 animate-pulse' : 'bg-neon-blue text-black hover:bg-white'}`}
                                >
                                    {isRecording ? <><StopCircle className="w-4 h-4"/> STOP REC</> : <><Mic className="w-4 h-4"/> RECORD MIC</>}
                                </button>
                            </div>

                            <input 
                                id="audio-upload"
                                type="file" 
                                accept="audio/mpeg, audio/mp3, audio/*"
                                onChange={handleAudioUpload}
                                className="hidden"
                            />

                            {(audioPreviewUrl) && (
                                <div className="bg-black/50 p-4 rounded-lg flex flex-col gap-3 border border-gray-600">
                                    <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center gap-2 text-neon-blue overflow-hidden">
                                           <Music className="w-4 h-4 flex-shrink-0" />
                                           <p className="text-xs text-gray-200 truncate font-mono">
                                               {audioFile ? audioFile.name : 'Recording.mp3'}
                                           </p>
                                        </div>
                                        <button 
                                            type="button"
                                            onClick={() => { setAudioFile(null); setAudioBlob(null); setAudioPreviewUrl(null); }}
                                            className="text-red-400 hover:text-red-300 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    {/* Functional Audio Player */}
                                    <audio controls src={audioPreviewUrl} className="w-full h-8 block" />
                                </div>
                            )}
                            {!audioPreviewUrl && !isRecording && (
                                <p className="text-xs text-gray-500 text-center italic mt-4">
                                    No audio selected. Upload an MP3 or record a short monologue.
                                </p>
                            )}
                        </div>
                   </div>
               </div>

               {/* Legal */}
               <div className="bg-gray-950/80 p-6 rounded-xl border border-gray-800 mt-6">
                 <h3 className="text-sm font-bold mb-3 text-white uppercase tracking-wider">Release & Waiver</h3>
                 <div className="h-24 overflow-y-auto text-xs text-gray-400 mb-4 pr-2 space-y-2 custom-scrollbar bg-black/30 p-2 rounded">
                   <p>I hereby grant AI Impact Media permission to use my likeness, voice, and submitted materials for the "AI Impact" anthology project.</p>
                   <p>I understand this is a <strong className="text-white">volunteer submission</strong> with <strong className="text-white">no financial compensation</strong>.</p>
                   <p>This project is community-driven and non-profit.</p>
                 </div>
                 
                 <div className="mb-4">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" required className="w-4 h-4 rounded border-gray-600 text-neon-blue focus:ring-neon-blue bg-gray-800" />
                      <span className="text-sm text-gray-300 group-hover:text-white transition-colors">I accept the terms and conditions</span>
                    </label>
                 </div>

                 <div>
                   <label className="block text-xs font-bold text-gray-400 mb-2">DIGITAL SIGNATURE</label>
                   <SignaturePad onEnd={setSignature} />
                 </div>
               </div>

               <div className="flex justify-between pt-4 border-t border-gray-800">
                 <button 
                  type="button" 
                  onClick={() => setStep(1)}
                  className="text-gray-400 hover:text-white font-medium px-6 py-3 text-sm"
                 >
                   BACK
                 </button>
                 <button 
                  type="submit" 
                  disabled={isLoading}
                  className="bg-neon-blue text-black font-bold py-3 px-8 rounded-full hover:bg-white hover:shadow-[0_0_20px_rgba(0,243,255,0.6)] transition-all duration-300 flex items-center gap-2"
                 >
                   {isLoading ? (
                     <>
                      <Loader2 className="w-5 h-5 animate-spin" /> UPLOADING...
                     </>
                   ) : 'SUBMIT CASTING'}
                 </button>
               </div>
             </form>
           </div>
         )}

         {step === 3 && (
           <div className="text-center py-20 bg-black/80 backdrop-blur rounded-2xl border border-neon-blue/20 animate-fade-in shadow-[0_0_50px_rgba(0,243,255,0.1)]">
             <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-neon-blue/10 mb-6 border border-neon-blue/30">
               <CheckCircle className="w-10 h-10 text-neon-blue" />
             </div>
             <h2 className="text-3xl font-display font-bold mb-4 text-white">TRANSMISSION COMPLETE</h2>
             <p className="text-gray-400 mb-8 max-w-md mx-auto">
               Welcome to the archive, <span className="text-white font-bold">{formData.name}</span>.<br/>
               A confirmation signal has been sent to {formData.email}.
             </p>
             <button 
               onClick={() => window.location.reload()}
               className="px-6 py-2 border border-gray-600 rounded-full text-gray-300 hover:text-white hover:border-white transition-colors text-sm"
             >
               Submit Another Candidate
             </button>
           </div>
         )}
      </div>
    </div>
  );
};