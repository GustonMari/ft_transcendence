import { APP } from "../../network/app";
import StyleRoom from "../../styles/rooms/Style.room.module.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import { Modal } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { shakeIt } from '../../functions/chat-rooms/functions';
import { addRoom, checkIsPassword, checkPassword } from '../../functions/chat-rooms/functions';
import { useRef, useState } from "react";
import { IoEnter } from 'react-icons/io5';
import { RiMailLockLine } from 'react-icons/ri';

export function InputRoom(props: any) {
	let	{define_room, current_room, current_user, socket, handle_history, setMessage, render_react, setRoom, GetMessagesByRoom} = props;
	const id = `shaking-${current_room.name}-input`;
	const id_private = `shaking-${current_room.name}-input-private`;
	const id_public = `shaking-${current_room.name}-input-public`;
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
		if (!value.includes("-"))
		{
			if (await checkIsPassword(value))
				handleShow(); 
			else {
				addRoom(setMessage, define_room, socket, current_user, value, setValue, handle_history, render_react);
				setValue("");
			}
		}
		else {
			setValue("");
			shakeIt("shake", (`${current_room.name}-input-public`));
		}
	}

	socket?.on('joinPrivateRoom', async (data: any) => {
		setRoom(data.my_room_name);
		await GetMessagesByRoom(handle_history, "");
	});

	let handleAddPrivateRoom = async () => {
        if (value === "") return;

		const login = value;
		const user = await APP.post("/chat/is_user_exists", {login: login});
		const user_id = (await APP.post("/chat/get_user_id_by_login", {login: login})).data;
		let is_blocked = false;
		let im_blocked = false;
		if (user.data && current_user.login !== login)
		{
			is_blocked = (await APP.post("/chat/is_user_blocked", {user_id_target: user_id})).data;
			im_blocked = (await APP.post("/chat/am_i_blocked", {user_id_target: user_id})).data;
		}
		if (user.data && !is_blocked && !im_blocked && current_user.login !== login) {
			let privateRoomName = "";
			if (login.localeCompare(current_user.login) < 0)
				privateRoomName = login + "-" + current_user.login;
			else
				privateRoomName = current_user.login + "-" + login;
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
				<Button className={StyleRoom['input-room-button']} id={id_public} onClick={handleAddRoom}>
				<IoEnter title="Create new room"/>
				</Button>
				<Button className={StyleRoom['input-room-button']} id={id_private} onClick={handleAddPrivateRoom}>
					<RiMailLockLine title="Send private message"/>
				</Button>
			</>
		)
	}

	return (
	<div className={StyleRoom['input-room']}>
		<input className={StyleRoom['borderbox-room']} onChange={(e) => setValue(e.target.value)} onKeyDown={handleKeyDown} placeholder="define your room..." value={value} required/>
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