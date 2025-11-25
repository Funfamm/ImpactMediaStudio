import React, { useState, useEffect } from 'react';
import { Play, Info, X } from 'lucide-react';
import { Movie } from '../types';

const MOCK_MOVIES: Movie[] = [
  {
    id: '1',
    title: 'NEON HORIZON',
    description: 'In a city that never sleeps, one android dreams of silence.',
    thumbnailUrl: 'https://picsum.photos/id/15/400/225',
    videoUrl: 'https://picsum.photos/id/15/1920/1080', // Simulated
    year: 2024,
    duration: '1h 45m',
    genre: ['Sci-Fi', 'Drama']
  },
  {
    id: '2',
    title: 'THE SILENT ECHO',
    description: 'Sound is currency, and she just went bankrupt.',
    thumbnailUrl: 'https://picsum.photos/id/28/400/225',
    year: 2023,
    duration: '2h 10m',
    genre: ['Thriller']
  },
  {
    id: '3',
    title: 'DIGITAL GHOSTS',
    description: 'They live in the servers, waiting for a reboot.',
    thumbnailUrl: 'https://picsum.photos/id/33/400/225',
    year: 2025,
    duration: '1h 30m',
    genre: ['Horror', 'Cyberpunk']
  },
  {
    id: '4',
    title: 'LAST TRANSMISSION',
    description: 'Earth is gone. The signal remains.',
    thumbnailUrl: 'https://picsum.photos/id/54/400/225',
    year: 2024,
    duration: '1h 55m',
    genre: ['Sci-Fi']
  },
  {
    id: '5',
    title: 'VELOCITY',
    description: 'Faster than light. Slower than memory.',
    thumbnailUrl: 'https://picsum.photos/id/76/400/225',
    year: 2024,
    duration: '2h 05m',
    genre: ['Action']
  },
];

const Movies: React.FC = () => {
  const [activeMovieIndex, setActiveMovieIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  // Carousel auto-rotation
  useEffect(() => {
    if (isPlaying) return;
    const interval = setInterval(() => {
      setActiveMovieIndex((prev) => (prev + 1) % 3); // Cycle through top 3
    }, 10000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const featuredMovie = MOCK_MOVIES[activeMovieIndex];

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Featured Hero Carousel */}
      <div className="relative h-[80vh] w-full overflow-hidden">
        {/* Background Layer (Simulated Video) */}
        <div className="absolute inset-0">
          <img 
            src={featuredMovie.thumbnailUrl.replace('400/225', '1920/1080')} 
            alt="Hero" 
            className="w-full h-full object-cover animate-pulse transition-all duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent"></div>
        </div>

        {/* Content Info */}
        <div className="absolute bottom-0 left-0 p-8 md:p-16 max-w-2xl z-20">
          <h1 className="font-future text-5xl md:text-7xl font-black text-white mb-4 drop-shadow-lg leading-tight">
            {featuredMovie.title}
          </h1>
          <div className="flex items-center space-x-4 mb-6 text-sm md:text-base text-gray-300">
            <span className="text-green-400 font-bold">98% Match</span>
            <span>{featuredMovie.year}</span>
            <span className="border border-gray-600 px-1 rounded text-xs">HD</span>
            <span>{featuredMovie.duration}</span>
          </div>
          <p className="text-lg text-gray-200 mb-8 line-clamp-2 md:line-clamp-none">
            {featuredMovie.description}
          </p>
          
          <div className="flex space-x-4">
            <button 
              onClick={() => setSelectedMovie(featuredMovie)}
              className="flex items-center bg-white text-black px-8 py-3 rounded hover:bg-gray-200 transition font-bold font-future"
            >
              <Play className="mr-2 fill-black" /> Play Now
            </button>
            <button className="flex items-center bg-gray-600/70 text-white px-8 py-3 rounded hover:bg-gray-500/70 transition font-bold font-future backdrop-blur">
              <Info className="mr-2" /> More Info
            </button>
          </div>
        </div>
      </div>

      {/* Categories / Horizontal Scroll */}
      <div className="px-8 md:px-16 -mt-24 relative z-20">
        <h3 className="font-future text-xl font-bold mb-4 text-gray-200">New Releases</h3>
        <div className="flex space-x-4 overflow-x-auto pb-8 no-scrollbar">
          {MOCK_MOVIES.map((movie) => (
            <div 
              key={movie.id}
              onClick={() => setSelectedMovie(movie)}
              className="flex-none w-64 aspect-video relative rounded-md overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300 group bg-gray-900"
            >
              <img 
                src={movie.thumbnailUrl} 
                alt={movie.title}
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                <h4 className="font-future font-bold text-white text-sm">{movie.title}</h4>
                <div className="flex items-center mt-2 space-x-2">
                  <div className="bg-red-600 rounded-full p-1">
                    <Play className="w-3 h-3 fill-white text-white" />
                  </div>
                  <span className="text-xs text-gray-300">{movie.duration}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Player Modal */}
      {selectedMovie && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center p-4">
          <div className="relative w-full max-w-6xl aspect-video bg-gray-900 shadow-2xl rounded-lg overflow-hidden border border-gray-800">
            <button 
              onClick={() => setSelectedMovie(null)}
              className="absolute top-4 right-4 z-50 bg-black/50 p-2 rounded-full hover:bg-white/20 transition text-white"
            >
              <X />
            </button>
            
            {/* Mock Player UI */}
            <div className="absolute inset-0 flex items-center justify-center bg-black">
              <div 
                className="w-full h-full bg-cover bg-center opacity-50"
                style={{ backgroundImage: `url(${selectedMovie.thumbnailUrl.replace('400/225', '1200/800')})` }}
              ></div>
              <div className="absolute z-10 text-center">
                <Play className="h-20 w-20 text-white/80 mx-auto mb-4" />
                <p className="font-future text-2xl animate-pulse">Playing: {selectedMovie.title}</p>
                <p className="text-sm text-gray-400 mt-2">Streaming from secure server...</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Movies;