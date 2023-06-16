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
			<div className='player' style={{ maxWidth: '60%' }}>
				<Player
					movieName='Obi - Wan Kenobi'
					src='/video/Obiwan.mp4'
					poster='https://d.newsweek.com/en/full/2046388/obi-wan-kenobi-timeline.jpg?w=1600&h=1200&q=88&f=4287a4c88a2406482c092fe48f8ca388'
				/>
			</div>
		</div>
	)
}

export default App
