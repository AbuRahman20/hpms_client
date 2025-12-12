import React, { useEffect, useState } from 'react'
import axios from 'axios'

function Contact() {

	// post get put delete

	const [data, setData] = useState([]);

	useEffect(() => {
		const fetchUsers = async () => {
			const response = await axios.get('http://localhost:5000/fetchusers')
			setData(response?.data)
			console.log(response.data)
		}
		fetchUsers()
	}, [])

	const [id, setid] = useState('')
	const [name, setname] = useState('')
	const [address, setaddress] = useState('')

	const login = async (e) => {
		e.preventDefault()
		console.log(id, name, address)

		try {
			const response = await axios.post('http://localhost:5000/input', {
				regno: id,
				student: name,
				parents: address
			})
		}
		catch (error) {

		}
	}

	const arr = ['Haneef', 'Rahman', 'Fahad']
	return (
		<div>

			{data.map((hello, index) => (
				<tr key={index.email}>
					<td>{hello.name}</td>
					<td>{hello.phoneNo}</td>
					<td>{hello.registerNo}</td>
					<td>
						<button>Edit</button>

					</td>
					<td>
						<button>Delete</button>
					</td>
				</tr>
			))}




			{/* <input type="text" className='bg-red-200' onChange={(e) => setid(e.target.value)} /><br />
			<input type="text" className='bg-red-200' onChange={(e) => setname(e.target.value)} /><br />
			<input type="text" className='bg-red-200' onChange={(e) => setaddress(e.target.value)} /><br />
			<button
				onClick={login}
				type="submit"
				className='bg-gray-300 '>Save</button> */}

		</div>
	)
}

export default Contact