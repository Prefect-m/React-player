import React, { useEffect, useRef, useState } from 'react'
import { IPlayer } from './Player.props'
import styles from './Player.module.scss'
import { TimeElapsed } from '../timeElapsed/Time'

export const Player = ({ src, autoPlay, muted }: IPlayer) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isWaiting, setIsWaiting] = useState(false)
  const [durationSec, setDurationSec] = useState(0)
  const [elapsedSec, setElapsedSec] = useState(0)

  const videoRef = useRef<HTMLVideoElement>(null)
  const bufferRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const videoApi = videoRef.current

  useEffect(() => {
    if (!videoApi) return

    const onPlay = () => {
      if (isWaiting) setIsWaiting(false)
      setIsPlaying(true)
    }

    const onPause = () => {
      if (isWaiting) setIsWaiting(false)
      setIsPlaying(false)
    }

    const onWaiting = () => {
      if (isPlaying) setIsPlaying(false)
      setIsWaiting(true)
    }

    const onTimeUpdate = () => {
      if (isWaiting) setIsWaiting(false)
      if (!progressRef.current) return
      const { currentTime, duration } = videoApi
      const progress = currentTime / duration
      setDurationSec(duration)
      setElapsedSec(currentTime)
      const width = progress * 100
      progressRef.current.style.width = `${width}%`
    }

    const onProgress = () => {
      if (!videoApi.buffered.length || !bufferRef.current) return
      const { duration } = videoApi
      const bufferdEnd = videoApi.buffered.end(videoApi.buffered.length - 1)
      if (bufferRef && duration > 0) {
        const width = (bufferdEnd / duration) * 100
        bufferRef.current.style.width = `${width}%`
      }
    }

    const loadMetaData = () => {
      console.log(videoApi.duration)
    }

    videoApi.addEventListener('play', onPlay)
    videoApi.addEventListener('playing', onPlay)
    videoApi.addEventListener('pause', onPause)
    videoApi.addEventListener('waiting', onWaiting)
    videoApi.addEventListener('timeupdate', onTimeUpdate)
    videoApi.addEventListener('progress', onProgress)
    videoApi.addEventListener('loadedmetadata', loadMetaData)

    return () => {
      videoApi.removeEventListener('play', onPlay)
      videoApi.removeEventListener('playing', onPlay)
      videoApi.removeEventListener('pause', onPause)
      videoApi.removeEventListener('waiting', onWaiting)
      videoApi.removeEventListener('timeupdate', onTimeUpdate)
      videoApi.removeEventListener('progress', onProgress)
      videoApi.removeEventListener('loadedmetadata', loadMetaData)
    }
  }, [videoApi, isPlaying, isWaiting])

  const seekToPostion = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoApi) return

    const { left, width } = e.currentTarget.getBoundingClientRect()
    const clickPos = (e.clientX - left) / width
    if (clickPos < 0 || clickPos > 1) return

    const durationMs = videoApi.duration * 1000
    const newElapsedTimeMs = durationMs * clickPos
    const newTimeSec = newElapsedTimeMs / 1000
    videoApi.currentTime = newTimeSec
  }

  const playPauseHandler = () => {
    if (isPlaying) {
      videoApi?.pause()
      setIsPlaying(false)
    } else {
      videoApi?.play()
      setIsPlaying(true)
    }
  }
  return (
    <div className={styles.player}>
      {isWaiting && <span>Загрузка...</span>}
      <video
        muted={muted}
        autoPlay={autoPlay}
        ref={videoRef}
        src={src}
        onClick={playPauseHandler}
      ></video>
      <div className={styles.player_controls}>
        <div className={styles.player_buttons}>
          {!isPlaying ? (
            <button onClick={playPauseHandler}>
              <svg
                width='19'
                height='20'
                viewBox='0 0 19 20'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M17.409 7.35331C17.8893 7.60872 18.291 7.99 18.5712 8.45629C18.8514 8.92259 18.9994 9.45632 18.9994 10.0003C18.9994 10.5443 18.8514 11.078 18.5712 11.5443C18.291 12.0106 17.8893 12.3919 17.409 12.6473L4.597 19.6143C2.534 20.7363 0 19.2763 0 16.9683V3.03331C0 0.723308 2.534 -0.735693 4.597 0.385307L17.409 7.35331Z'
                  fill='white'
                />
              </svg>
            </button>
          ) : (
            <button onClick={playPauseHandler}>
              <svg
                width='20'
                height='20'
                viewBox='0 0 20 20'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M0 4C0 2.114 -5.96046e-08 1.172 0.586 0.586C1.172 -5.96046e-08 2.114 0 4 0C5.886 0 6.828 -5.96046e-08 7.414 0.586C8 1.172 8 2.114 8 4V16C8 17.886 8 18.828 7.414 19.414C6.828 20 5.886 20 4 20C2.114 20 1.172 20 0.586 19.414C-5.96046e-08 18.828 0 17.886 0 16V4ZM12 4C12 2.114 12 1.172 12.586 0.586C13.172 -5.96046e-08 14.114 0 16 0C17.886 0 18.828 -5.96046e-08 19.414 0.586C20 1.172 20 2.114 20 4V16C20 17.886 20 18.828 19.414 19.414C18.828 20 17.886 20 16 20C14.114 20 13.172 20 12.586 19.414C12 18.828 12 17.886 12 16V4Z'
                  fill='white'
                />
              </svg>
            </button>
          )}
        </div>
        <div className={styles.player_time}>
          <TimeElapsed elapsedSec={elapsedSec} totalSec={durationSec} />
        </div>
        <div className={styles.player_timeline} onClick={seekToPostion}>
          <div className={styles.player_timeline__buffer} ref={bufferRef}></div>
          <div
            className={styles.player_timeline__progress}
            ref={progressRef}
          ></div>
        </div>
      </div>
    </div>
  )
}
