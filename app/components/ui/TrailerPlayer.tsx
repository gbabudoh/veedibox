"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Pause, Maximize, Volume2, VolumeX, Info, Share2, Clapperboard, Loader2 } from "lucide-react";

interface TrailerPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  movieTitle: string;
  videoUrl?: string; 
}

export const TrailerPlayer = ({ isOpen, onClose, movieTitle, videoUrl = "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" }: TrailerPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Handle video element synchronization
  useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.play().catch(() => {
        // Auto-play was blocked
      });
    } else if (!isOpen && videoRef.current) {
      videoRef.current.pause();
    }
  }, [isOpen]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const currentProgress = (current / videoRef.current.duration) * 100;
      setCurrentTime(current);
      setProgress(currentProgress);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setIsLoading(false);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const pos = (clientX - rect.left) / rect.width;
      videoRef.current.currentTime = pos * videoRef.current.duration;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 transition-colors duration-700">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none overflow-hidden"
          >
             <div className="absolute top-0 left-0 w-full h-[30vh] bg-gradient-to-b from-primary/20 via-primary/5 to-transparent" />
             <div className="absolute bottom-0 left-0 w-full h-[40vh] bg-gradient-to-t from-accent/10 via-accent/5 to-transparent" />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.05, filter: "blur(20px)" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-6xl aspect-video bg-zinc-950 rounded-[2rem] shadow-[0_0_100px_rgba(0,0,0,1)] flex items-center justify-center overflow-hidden border border-white/5 group/player"
          >
             <video 
               ref={videoRef}
               src={videoUrl}
               className="w-full h-full object-cover"
               onTimeUpdate={handleTimeUpdate}
               onLoadedMetadata={handleLoadedMetadata}
               onWaiting={() => setIsLoading(true)}
               onPlaying={() => setIsLoading(false)}
               onPlay={() => setIsPlaying(true)}
               onPause={() => setIsPlaying(false)}
               muted={isMuted}
               onClick={togglePlay}
             />

             {isLoading && (
               <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/20 backdrop-blur-sm">
                 <Loader2 className="text-primary animate-spin" size={48} />
               </div>
             )}

             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 opacity-0 group-hover/player:opacity-100 transition-opacity duration-500" />

             {/* UI Layer */}
             <div className="absolute inset-0 z-10 w-full h-full p-6 md:p-12 flex flex-col justify-between opacity-0 group-hover/player:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="flex justify-between items-start pointer-events-auto">
                   <motion.div 
                     initial={{ x: -20, opacity: 0 }}
                     animate={{ x: 0, opacity: 1 }}
                   >
                      <p className="text-primary text-[10px] uppercase tracking-[0.3em] font-black mb-1">Now Playing</p>
                      <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter italic">{movieTitle}</h2>
                   </motion.div>
                   
                   <button 
                     onClick={onClose}
                     className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-all group active:scale-90"
                   >
                      <X className="group-hover:rotate-90 transition-transform duration-300" size={24} />
                   </button>
                </div>

                <div className="flex flex-col items-center pointer-events-auto">
                   <motion.button 
                     whileHover={{ scale: 1.1 }}
                     whileTap={{ scale: 0.9 }}
                     onClick={togglePlay}
                     className="w-20 h-20 rounded-full bg-primary thermal-glow flex items-center justify-center text-white mb-2"
                   >
                      {isPlaying ? <Pause fill="currentColor" size={28} /> : <Play fill="currentColor" size={28} className="ml-1" />}
                   </motion.button>
                </div>

                <div className="w-full pointer-events-auto">
                   <div className="flex items-center gap-6 mb-4">
                      <div 
                        className="flex-1 h-1.5 bg-white/10 rounded-full relative overflow-hidden group cursor-pointer"
                        onMouseDown={handleSeek}
                      >
                         <div className="absolute inset-0 bg-primary/10" />
                         <motion.div 
                           className="absolute inset-0 bg-primary thermal-glow"
                           style={{ width: `${progress}%` }}
                         />
                      </div>
                      <span className="text-[10px] font-mono opacity-60 w-24 text-right">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                   </div>

                   <div className="flex justify-between items-center text-white/60">
                      <div className="flex items-center gap-6">
                         <button 
                            onClick={() => setIsMuted(!isMuted)}
                            className="hover:text-primary transition-colors"
                         >
                            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                         </button>
                         <button className="hidden sm:flex hover:text-primary transition-colors items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                            <Clapperboard size={18} /> Director&apos;s Cut
                         </button>
                      </div>
                      <div className="flex items-center gap-6">
                         <button className="hover:text-primary transition-colors"><Info size={20} /></button>
                         <button className="hover:text-primary transition-colors"><Share2 size={20} /></button>
                         <button className="hover:text-primary transition-colors"><Maximize size={20} /></button>
                      </div>
                   </div>
                </div>
             </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
