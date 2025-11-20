import React, { useEffect, useState } from 'react'

function Home() {

	const [number, setNumber] = useState(10)
	const handleChange = () => {
		setNumber(number + 1)
	}

	useEffect(() => {
		setNumber(100)
	}, [number])


	return (
		<div>
			<p>{number}</p>
			<button onClick={handleChange}>
				change Number
			</button>
		</div>
	)
}

export default Home