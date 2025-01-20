import { useState, useRef,useEffect } from "react";

export const useAudioProvider = (songData,currentlyPlaying,setCurrentlyPlaying) => {
  const [isPlaying, setIsplaying] = useState(false);
  const audioRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [showProgressBar, setShowProgressBar] = useState(false);
  
  const playSong = async () => {
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio(songData);
      }

      if (currentlyPlaying && currentlyPlaying !== audioRef.current) {
        currentlyPlaying.pause();
        currentlyPlaying.currentTime = 0;
      }

      if (isPlaying) {
        await audioRef.current.pause();
        setIsplaying(false);
      } else {
        await audioRef.current.play();
        setIsplaying(true);
        setCurrentlyPlaying(audioRef.current);
        setShowProgressBar(true);
      }

      setIsplaying(!isPlaying);
    } catch (error) {
      console.log("ERROR:Error While Playing Music", error);
    }
  };

  const updateProgress = () => {
    if (audioRef.current) {
      const currentProgress =
        (audioRef.current.currentTime / audioRef.current.duration) * 100 || 0;
      setProgress(currentProgress);
    }
  };

  const handleSeek = (e) => {
    const newTime = (e.target.value / 100) * audioRef.current.duration;
    audioRef.current.currentTime = newTime;
  };


  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener("timeupdate", updateProgress);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("timeUpdate", updateProgress);
      }
    };
  }, [audioRef, updateProgress]);

  return {
    handleSeek,
    playSong,
    isPlaying,
    progress,
    showProgressBar,
    audioRef
  };
};
