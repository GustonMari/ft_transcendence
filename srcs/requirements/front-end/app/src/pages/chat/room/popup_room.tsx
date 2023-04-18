import React, { useState, useEffect, useRef } from 'react';
import Popup from 'reactjs-popup';
import io, { Socket } from "socket.io-client";
import Create_socket from '../socket';
import { APP } from "../../../api/app";
import Style from '../Style.message.module.css';
import StyleRoom from './Style.room.module.css';
import { GetMessagesByRoom } from '../Message';
import { setMaxIdleHTTPParsers } from 'http';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import { Modal } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { shakeIt } from '../utils';
import { addRoom, checkIsPassword, checkPassword } from './input_room_utils';
import { InputRoom } from './input_room';

export function PopupLeave(props: any) {
	let { setMessage, socket, room, current_user, render_react, GetMessagesByRoom, handle_history} = props;
	const ref = useRef<any>();
	const closeTooltip = () => ref.current.close();
  
	return (
	  <div>
		<Popup
			ref={ref}
			position='bottom center'
			className={StyleRoom['popup-content']}
			trigger={(open) => (
				<button
					type="submit"
					className={StyleRoom["line-room-button"]}
					onClick={() => {}}
					>
					<img className={StyleRoom["icon-room"]} src="./leave-room.png" alt="leave room" />
				</button>
			)}
		>
		  <div>
			<button className={StyleRoom['line-room-button-popup']}
			  onClick={() => {
				setMessage([]);
				socket?.emit("leaveRoom", {
				  room_name: room.name,
				  id_user: current_user.id,
				});
				socket?.on("renderReact", render_react);

				GetMessagesByRoom(handle_history, "");
			  }}
			>
				<img className={StyleRoom["icon-room-popup"]} src="./accept.png" alt="leave room" />
			</button>
			<button className={StyleRoom['line-room-button-popup']} onClick={closeTooltip}>
				<img className={StyleRoom["icon-room-popup"]} src="./cancel.png" alt="leave room" />
			</button>
		  </div>
		</Popup>
	  </div>
	);
}



export function PopupDelete(props: any) {
	let { setMessage, socket, room, current_user, render_react, GetMessagesByRoom, handle_history} = props;
	const ref = useRef<any>();
	const closeTooltip = () => ref.current.close();
	const id = `shaking-${room.name}-delete`;

	function deleteRoom() {
		setMessage([]);
		socket?.emit("deleteRoom", {
		  room_name: room.name,
		  id_user: current_user.id,
		});
		socket?.on("renderReact", render_react);
		GetMessagesByRoom(handle_history, "");
	}

	socket?.on('renderReactDeletedRoom', () => {
		GetMessagesByRoom(handle_history, "");
	});

	return (
	  <div>
		<Popup
		  ref={ref}
		  trigger={(open) => (
			<button
			  type="submit"
			  className={StyleRoom["line-room-button"]}
			  id={id}
			  onClick={() => {}}
			>
			  <img className={StyleRoom["icon-room"]} src="./delete-room.png" alt="delete room" />
			</button>
		  )}
		>
		  <div>
			<button className={StyleRoom['line-room-button-popup']}
			  onClick={() => {
				const is_owner = async () => {
					const res = await APP.post("/chat/get_isowner_login", {room_name: room.name, login: current_user.login});
					let owner = res.data;
					owner ? deleteRoom() : shakeIt("shake-button", `${room.name}-delete`) ;
				}
				is_owner();
			}}
			>
				<img className={StyleRoom["icon-room-popup"]} src="./accept.png" alt="leave room" />
			</button>
			<button className={StyleRoom['line-room-button-popup']} onClick={closeTooltip}>
				<img className={StyleRoom["icon-room-popup"]} src="./cancel.png" alt="leave room" />
			</button>
		  </div>
		</Popup>
	  </div>
	);
}

export function PopupPassword(props: any) {
	let { setMessage, socket, room, current_user, render_react } = props;

	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const id = `shaking-${room.name}-password`;

	const handleShow = async () => {
		const owner = await APP.post("/chat/get_isowner_login", {room_name: room.name, login: current_user.login})
		if (owner.data)
			setShow(true);
		else {
			shakeIt("shake-button", `${room.name}-password`);
		  }
	};

	const  handleSetPassword = async (password: string) => {
		setShow(false);
		const res = await APP.post("/chat/set_room_password", {room_name: room.name, user_id: current_user.id, password: password});
	}

	function handleKeyDown(event: any) {
		if (event.key === "Enter") {
			event.preventDefault();
			handleSetPassword(value);
		}
	}

	let [value, setValue] = React.useState("");

	return (
	<div>
		<Button className={StyleRoom["line-room-button"]} id={id} variant="primary" onClick={handleShow}>
			<img className={StyleRoom["icon-room"]} src="./lock-room.png" alt="lock room" />
		</Button>
			
		<Modal show={show} onHide={handleClose} >
			<Modal.Header closeButton>
				<Modal.Title>Define password for the room</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form>
					<Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
						<Form.Label></Form.Label>
						<Form.Control
						type="password"
						placeholder="password"
						autoFocus
						onChange={(e) => setValue(e.target.value)}
						onKeyDown={handleKeyDown}
						/>
					</Form.Group>
				</Form>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={handleClose}>
					Close
				</Button>
				<Button variant="primary" onClick={() => handleSetPassword(value)}>
					Save Changes
				</Button>
			</Modal.Footer>
		</Modal>

	</div>
	);
}