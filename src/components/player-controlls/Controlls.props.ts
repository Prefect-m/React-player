import { LegacyRef } from 'react'

export interface IControllsProps {
	playPauseHandler: () => void
	mutedHandler: (value: number) => void
	seekToPostion: (e: React.MouseEvent<HTMLDivElement>) => void
	fullScreenHandler: () => void
	changeVolume: (value: any) => void
	isPlaying: boolean
	isMuted: boolean
	volumeRef: LegacyRef<HTMLInputElement>
	bufferRef: LegacyRef<HTMLDivElement>
	progressRef: LegacyRef<HTMLDivElement>
	elapsedSec: number
	durationSec: number
}
