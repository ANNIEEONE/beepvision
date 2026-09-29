import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

interface MusicContextType {
  isPlaying: boolean;
  toggleMusic: () => void;
  isReady: boolean;
}

const MusicContext = createContext<MusicContextType>({
  isPlaying: false,
  toggleMusic: () => {},
  isReady: false,
});

export const useMusic = () => useContext(MusicContext);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create HTML5 Audio element for the requested track (Bad Apple!! - 0n3jW9vlH70)
    const audio = new Audio('/audio/bad_apple.mp3');
    audio.loop = true;
    audio.volume = 0.4;
    audio.preload = 'auto';

    const handleCanPlay = () => {
      setIsReady(true);
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    const handleError = (e: Event) => {
      console.warn('Audio playback notice:', e);
    };

    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    audioRef.current = audio;
    if (typeof window !== 'undefined') {
      (window as any).__bgAudio = audio;
    }

    // Check if ready immediately (cached)
    if (audio.readyState >= 3) {
      setIsReady(true);
    }

    return () => {
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.pause();
      audio.src = '';
      audioRef.current = null;
    };
  }, []);

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying || !audio.paused) {
      audio.pause();
      setIsPlaying(false);
    } else {
      // User gesture triggered play
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((err) => {
            console.warn('Audio play request interrupted or prevented:', err);
            setIsPlaying(false);
          });
      }
    }
  };

  return (
    <MusicContext.Provider value={{ isPlaying, toggleMusic, isReady }}>
      {children}
    </MusicContext.Provider>
  );
};
