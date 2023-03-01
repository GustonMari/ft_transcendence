import React, { useState, useEffect, useRef } from 'react';
import Popup from 'reactjs-popup';
import io, { Socket } from "socket.io-client";
import Create_socket from '../socket';
import { APP } from "../../../api/app";
import '../Style.message.css';
import { GetMessagesByRoom } from '../Message';
import { setMaxIdleHTTPParsers } from 'http';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import { Modal } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { shakeIt } from '../utils';
import { addRoom, checkIsPassword, checkPassword } from './input_room_utils';

export function InputRoom(props: any) {
	let check = 0;
	let	{define_room, current_room, current_user, socket, handle_history, setMessage, render_react, setRoom, GetMessagesByRoom} = props;
	const id = `shaking-${current_room.name}-input`;
	const id_private = `shaking-${current_room.name}-input-private`;
	const [value, setValue] = useState("");
	const [password, setPassword] = useState("");
	const [show, setShow] = useState(false);

	const handleClose = () => setShow(false);

	const handleShow = () => {
		setShow(true)
	};

	function handleKeyDown(event: any) {
		if (event.key === "Enter") {
			event.preventDefault();
			handleAddRoom();
		}
	}

	async function handleKeyDownPassword(event: any) {
		if (event.key === "Enter") {
			event.preventDefault();
			submitPassword()
		}
	}

	async function submitPassword() {

		if (await checkPassword(value, password)) {
			addRoom(setMessage, define_room, socket, current_user, value, setValue, handle_history, render_react);
			handleClose();
		}
		else {
			setPassword("");
			shakeIt("shake", (`${current_room.name}-input`));
		}
	}

	let handleAddRoom = async () => {
		if (await checkIsPassword(value))
			handleShow();
		else
			addRoom(setMessage, define_room, socket, current_user, value, setValue, handle_history, render_react);
	}

	socket?.on('joinPrivateRoom', async (data: any) => {
		console.log("joinPrivateRoom ", check ," ===> ", data);
		check += 1;
		setRoom(data.my_room_name);
		await GetMessagesByRoom(handle_history, "");
	});

	// let handleAddPrivateRoom = async () => {

	// 	const login = value;
	// 	const user = await APP.post("/chat/is_user_exists", {login: login});
	// 	if (user.data) {
	// 		let privateRoomName = "";
	// 		if (login.localeCompare(current_user.login) < 0)
	// 			privateRoomName = login + "-" + current_user.login;
	// 		else
	// 			privateRoomName = current_user.login + "-" + login;
	// 			await define_room(privateRoomName);
	// 			setValue("");
	// 			const socket_id = await APP.post("/chat/get_user_socket_id", {login: login});
	// 			await socket?.emit("joinRoomWithSocketId", { room_name: privateRoomName, socket_id: socket_id.data, login: value} );
	// 	}
	// 	else {
	// 		shakeIt("shake", (`${current_room.name}-input-private`));
	// 	}
	// }

	let handleAddPrivateRoom = async () => {

		const login = value;
		const user = await APP.post("/chat/is_user_exists", {login: login});
		if (user.data) {
			let privateRoomName = "";
			if (login.localeCompare(current_user.login) < 0)
				privateRoomName = login + "-" + current_user.login;
			else
				privateRoomName = current_user.login + "-" + login;
				// await define_room(privateRoomName);
				// setRoom(privateRoomName);
				setValue("");
				const socket_id = await APP.post("/chat/get_user_socket_id", {login: login});
				await socket?.emit("joinRoomWithSocketId", { room_name: privateRoomName, socket_id: socket_id.data, login: value, current_user_id: current_user.id} );
		}
		else {
			shakeIt("shake", (`${current_room.name}-input-private`));
		}
	}

	const handleRoomActions = () => {
		return (
			<>
				<Button className='input-room-button'  onClick={handleAddRoom}>
				<img className='icon-enter-room' src="./enter-room.png" alt="create room" />
				</Button>
				<Button className='input-room-button' id={id_private} onClick={handleAddPrivateRoom}>
					<img className='icon-enter-room' src="./private-message.png" alt="create room" />
				</Button>
			</>
		)
	}

	return (
	<div className='input-room'>
		<input className='borderbox-room' onChange={(e) => setValue(e.target.value)} onKeyDown={handleKeyDown} placeholder="define your room..." value={value} />
		{handleRoomActions()}
		<Modal show={show} onHide={handleClose} id={id}>
			<Modal.Header closeButton>
				<Modal.Title>Enter the password of the room</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form>
					<Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
						<Form.Label></Form.Label>
						<Form.Control
							type="password"
							placeholder="password"
							autoFocus
							onChange={(e) => setPassword(e.target.value)}
							onKeyDown={handleKeyDownPassword}
						/>
					</Form.Group>
				</Form>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={handleClose}>
					Close
				</Button>
				<Button variant="primary" onClick={() => {
					submitPassword();
				}}>
					Submit
				</Button>
			</Modal.Footer>
		</Modal>
	</div>
	);
}