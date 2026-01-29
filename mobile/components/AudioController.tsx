import usePlayerStore from '@/store/usePlayerStore';
import {useAudioPlayer, useAudioPlayerStatus} from 'expo-audio';
import { useEffect } from 'react';

const AudioController = () => {
  const {activeEpisode, isPlaying, seekTarget, setProgress, seekTo} = usePlayerStore();
  const player = useAudioPlayer(activeEpisode?.audioUrl ?? null);
  const status = useAudioPlayerStatus(player);

  // we will set the position
  useEffect(() => {
    if(status) {
      setProgress({
        position: status.currentTime,
        duration: status.duration
      });
    }
  }, [setProgress, status]);

  // track the status of isPlaying state (play-button)
  useEffect(() => {
    if(!player) return;

    if(isPlaying) {
      player.play();
    } else {
      player.pause();
    }
  }, [isPlaying, player]);

  // this tracks the skipping time in player
  useEffect(() => {
    if(player && seekTarget !== null) {
      player.seekTo(seekTarget);
      seekTo(null);
    }
  }, [seekTarget, player, seekTo]);

  return null;
};

export default AudioController;