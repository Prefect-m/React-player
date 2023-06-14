import React from 'react'
import { Player } from './components/player/Player'

const App = () => {
	return (
		<div
			style={{
				height: '100vh',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			<Player src='/video/Obiwan.mp4' />
		</div>
	)
}

export default App
