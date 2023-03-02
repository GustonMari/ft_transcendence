import { APP } from "../../network/app";
import '../../styles/messages/Style.message.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import { Modal } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { shakeIt } from '../../functions/chat-rooms/functions';
import { addRoom, checkIsPassword, checkPassword } from '../../functions/chat-rooms/functions';
import { useState } from "react";
import React from "react";
import { AiFillLock } from 'react-icons/ai';

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
		<Button className="line-room-button" id={id} variant="primary" onClick={handleShow}>
            <AiFillLock title="Lock the room"/>
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