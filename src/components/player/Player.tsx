import React, { useEffect, useRef, useState } from 'react'
import { IPlayer } from './Player.props'
import styles from './Player.module.scss'
import { Controlls } from '../player-controlls/Controlls'

export const Player = ({ src, autoPlay, muted }: IPlayer) => {
	const [isPlaying, setIsPlaying] = useState(false)
	const [isWaiting, setIsWaiting] = useState(false)
	const [durationSec, setDurationSec] = useState(0)
	const [elapsedSec, setElapsedSec] = useState(0)
	const [isMuted, setIsMuted] = useState(false)

	const videoRef = useRef<HTMLVideoElement>(null)
	const bufferRef = useRef<HTMLDivElement>(null)
	const progressRef = useRef<HTMLDivElement>(null)
	const rightRewindRef = useRef<HTMLDivElement>(null)
	const leftRewindRef = useRef<HTMLDivElement>(null)
	const playerRef = useRef<HTMLDivElement>(null)
	const volumeRef = useRef<HTMLInputElement>(null)
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

		videoApi.addEventListener('play', onPlay)
		videoApi.addEventListener('playing', onPlay)
		videoApi.addEventListener('pause', onPause)
		videoApi.addEventListener('waiting', onWaiting)
		videoApi.addEventListener('timeupdate', onTimeUpdate)
		videoApi.addEventListener('progress', onProgress)
		videoApi.addEventListener('dblclick', fullScreenHandler)
		// videoApi.addEventListener('volumechange', mutedHandler)

		return () => {
			videoApi.removeEventListener('play', onPlay)
			videoApi.removeEventListener('playing', onPlay)
			videoApi.removeEventListener('pause', onPause)
			videoApi.removeEventListener('waiting', onWaiting)
			videoApi.removeEventListener('timeupdate', onTimeUpdate)
			videoApi.removeEventListener('progress', onProgress)
			videoApi.removeEventListener('dblclick', fullScreenHandler)
			// videoApi.removeEventListener('volumechange', mutedHandler)
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

	const changeVolume = (value: any) => {
		if (!videoRef.current) return
		videoRef.current.volume = value / 100
	}

	const rewindLeft = () => {
		if (!videoApi) return
		videoApi.currentTime += -3
	}
	const rewindRight = () => {
		if (!videoApi) return
		videoApi.currentTime += 3
	}

	const fullScreenHandler = () => {
		if (!playerRef.current) return
		if (!document.fullscreenElement) {
			playerRef.current.requestFullscreen().catch((err) => {
				alert(
					`Ошибка переключения видео в полный экран: ${err.message} (${err.name})`
				)
			})
		} else {
			document.exitFullscreen()
		}
	}

	const mutedHandler = (value: number) => {
		if (!videoRef.current) return
		if (value === 0) {
			setIsMuted(true)
		} else {
			setIsMuted(false)
		}
	}

	const playPauseHandler = () => {
		if (isPlaying) {
			videoRef.current?.pause()
			setIsPlaying(false)
		} else {
			videoRef.current?.play()
			setIsPlaying(true)
		}
	}
	return (
		<div className={styles.player} ref={playerRef}>
			{isWaiting && <span>Загрузка...</span>}
			<div className={styles.player_rewindWrapp}>
				<div
					className={styles.player_rewind}
					ref={leftRewindRef}
					onDoubleClick={rewindLeft}
				></div>
				<div
					className={styles.player_rewind}
					ref={rightRewindRef}
					onDoubleClick={rewindRight}
				></div>
			</div>
			<video
				muted={muted}
				autoPlay={autoPlay}
				ref={videoRef}
				src={src}
				onClick={playPauseHandler}
			></video>
			<div className={styles.player_controls}>
				<Controlls
					bufferRef={bufferRef}
					changeVolume={changeVolume}
					durationSec={durationSec}
					elapsedSec={elapsedSec}
					fullScreenHandler={fullScreenHandler}
					isMuted={isMuted}
					isPlaying={isPlaying}
					mutedHandler={mutedHandler}
					playPauseHandler={playPauseHandler}
					progressRef={progressRef}
					seekToPostion={seekToPostion}
					volumeRef={volumeRef}
				/>
			</div>
		</div>
	)
}
