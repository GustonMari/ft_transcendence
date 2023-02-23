import React, { useState, useEffect, useRef } from 'react';
import Popup from 'reactjs-popup';
import io, { Socket } from "socket.io-client";
import Create_socket from './socket';
import { APP } from "../../api/app";
import './Style.message.css';
import { GetMessagesByRoom } from './Message';
import { setMaxIdleHTTPParsers } from 'http';
// import 'reactjs-popup/dist/index.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import { Modal } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { shakeIt } from './utils';

export function RoomForm(props : any)
{
	let {define_room, current_room, current_user, socket, handle_history, trigger, setTrigger, setMessage} = props;
	// const [value, setValue] = React.useState("");
	const [rooms, setRooms] = useState<any>([]);

	const roomContainer = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const getRooms = async () => {
			try {
				const res = await APP.get("/chat/get_user_rooms");
				setRooms(res.data);
				if (roomContainer.current) {
					roomContainer.current.scrollTop = roomContainer.current.scrollHeight;
				  }
			} catch (error) {
				console.error(error);
			}
		};
		getRooms();
		
	}, [trigger, define_room]);

	const render_react = () => {
		setTrigger(trigger += 1);
	}

	return (
		<div className='between-room-input'>
			<span ref={roomContainer} className='room-list'>
				{rooms.map(room => (
					<li key={room.id}>
						<span className="line-room">
							<div className='split'>
								<img className='line-room-img' src="" alt="" />
								<button className='line-room-button' onClick={() => {
									
									const is_ban = async () => {
										const res = await APP.post("/chat/get_isban_user", {room_name: room.name, id_user: current_user.id});
										let ban = res.data;
										ban ? "" : socket?.emit("changeRoom", { room_name: current_room, id_user: current_user.id});
										AuthorizeUser({ban, setMessage, GetMessagesByRoom, define_room, room, handle_history})
									}
									is_ban();
									socket?.on('renderReact', render_react);
									}}>{ ShortedName(room.name) }</button>
							</div>
							<div className='split'>
								<PopupLeave setMessage={setMessage} socket={socket} room={room} current_user={current_user} render_react={render_react}></PopupLeave>
								<PopupDelete setMessage={setMessage} socket={socket} room={room} current_user={current_user} render_react={render_react}></PopupDelete>
								<PopupPassword setMessage={setMessage} socket={socket} room={room} current_user={current_user} render_react={render_react}></PopupPassword>
							</div>
						</span>
					</li>
				))}
			</span>
			<InputRoom define_room={define_room} 
			current_room={current_room} 
			current_user={current_user} 
			socket={socket} 
			handle_history={handle_history} 
			setMessage={setMessage}
			render_react={render_react}/>
	</div>
	);
}

function test() {
	return (
		<div>
			<p>test</p>
		</div>
	);
}



function InputRoom(props: any) {
	
	let {define_room, current_room, current_user, socket, handle_history, setMessage, render_react} = props;
	
	const [value, setValue] = React.useState("");
	const [password, setPassword] = React.useState("");
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => {
		setShow(true)
	};

	async function checkIsPassword() {
		const res = await APP.post("/chat/is_room_has_password", {room_name: value});
		return res.data;
	}

	async function checkPassword() {
		const res = await APP.post("/chat/verify_room_password", {room_name: value, password: password});
		return res.data;
	}

	async function addRoom() {
		setMessage([]);
		define_room(value);
		socket?.emit("message", {room: value, message: `${current_user.login} has join the room ${value}`})
		socket?.on('renderReact', render_react);
		setValue("");
	}

	function handleKeyDown(event: any) {
		console.log(event.key);
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

		if (await checkPassword())
		{
			addRoom();
			handleClose();
		}
		else {
			setPassword("");
			shakeIt("shake", "shaking-modal-input-room");
		}
	}


	let handleAddRoom = async () => {
		if (await checkIsPassword())
			handleShow();
		else {
			addRoom();
		}
	}

	return (
	<div className='input-room'>
		<input className='borderbox-room' onChange={(e) => setValue(e.target.value)} onKeyDown={handleKeyDown} placeholder="define your room..." value={value} />
		<Button className='input-room-button'  onClick={handleAddRoom}>
			<img className='icon-enter-room' src="./enter-room.png" alt="create room" />
		</Button>

		<Modal show={show} onHide={handleClose} id="shaking-modal-input-room">
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

export function PopupLeave(props: any) {
	let { setMessage, socket, room, current_user, render_react } = props;
	const ref = useRef<any>();
	const closeTooltip = () => ref.current.close();
  
	return (
	  <div>
		<Popup
		  ref={ref}
		  position='bottom center'
		//   arrow={false}
		  className='popup-content'
		  trigger={(open) => (
			  <button
			  type="submit"
			  className="line-room-button"
			  onClick={() => {}}
			  >
			  <img className="icon-room" src="./leave-room.png" alt="leave room" />
			</button>
		  )}
		>
		  <div>
			<button className='line-room-button-popup'
			  onClick={() => {
				setMessage([]);
				socket?.emit("leaveRoom", {
				  room_name: room.name,
				  id_user: current_user.id,
				});
				socket?.on("renderReact", render_react);
			  }}
			>
				<img className="icon-room-popup" src="./accept.png" alt="leave room" />
			</button>
			<button className='line-room-button-popup' onClick={closeTooltip}>
				<img className="icon-room-popup" src="./cancel.png" alt="leave room" />
			</button>
		  </div>
		</Popup>
	  </div>
	);
}



export function PopupDelete(props: any) {
	let { setMessage, socket, room, current_user, render_react } = props;
	const ref = useRef<any>();
	const closeTooltip = () => ref.current.close();
  
	function deleteRoom() {
		setMessage([]);
		socket?.emit("deleteRoom", {
		  room_name: room.name,
		  id_user: current_user.id,
		});
		socket?.on("renderReact", render_react);
	}


	return (
	  <div>
		<Popup
		  ref={ref}
		  trigger={(open) => (
			<button
			  type="submit"
			  className="line-room-button"
			  id="shaking-modal-delete-room"
			  onClick={() => {}}
			>
			  <img className="icon-room" src="./delete-room.png" alt="delete room" />
			</button>
		  )}
		>
		  <div>
			<button className='line-room-button-popup'
			  onClick={() => {
				const is_owner = async () => {
					const res = await APP.post("/chat/get_isowner_login", {room_name: room.name, login: current_user.login});
					let owner = res.data;
					owner ? deleteRoom() : shakeIt("shake-button", "shaking-modal-delete-room") ;
				}
				is_owner();
			}}
			>
				<img className="icon-room-popup" src="./accept.png" alt="leave room" />
			</button>
			<button className='line-room-button-popup' onClick={closeTooltip}>
				<img className="icon-room-popup" src="./cancel.png" alt="leave room" />
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

	const handleShow = async () => {
		const owner = await APP.post("/chat/get_isowner_login", {room_name: room.name, login: current_user.login})
		if (owner.data)
			setShow(true);
		else {
			shakeIt("shake-button", "shaking-modal-password-room");
		  }
	};

	const  handleSetPassword = async (password: string) => {
		setShow(false);
		const res = await APP.post("/chat/set_room_password", {room_name: room.name, user_id: current_user.id, password: password});
		let isChanged = res.data;
		console.log("password = ", password);
		if (isChanged)
			console.log("Mot de passe change");
		else
			console.log("Mot de passe non change");
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
		<Button className="line-room-button" id="shaking-modal-password-room" variant="primary" onClick={handleShow}>
			<img className="icon-room" src="./lock-room.png" alt="lock room" />
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

// export function PopupPassword(props: any) {
// 	let { setMessage, socket, room, current_user, render_react } = props;

// 	const [show, setShow] = useState(false);
// 	const handleClose = () => setShow(false);
// 	const handleShow = () => setShow(true);

// 	const  handleSetPassword = async (password: string) => {
// 		setShow(false);
// 		const res = await APP.post("/chat/set_room_password", {room_name: room.name, user_id: current_user.id, password: password});
// 		let isChanged = res.data;
// 		console.log("password = ", password);
// 		if (isChanged)
// 			console.log("Mot de passe change");
// 		else
// 			console.log("Mot de passe non change");
// 	}
// 	function handleKeyDown(event: any) {
// 		if (event.key === "Enter") {
// 			event.preventDefault();
// 			handleSetPassword(value);
// 		}
// 	  }

// 	let [value, setValue] = React.useState("");

// 	return (
// 	<div>
// 		<Button className="line-room-button" variant="primary" onClick={handleShow}>
// 			<img className="icon-room" src="./lock-room.png" alt="lock room" />
// 		</Button>
			
// 		<Modal show={show} onHide={handleClose}>
// 			<Modal.Header closeButton>
// 				<Modal.Title>Define password for the room</Modal.Title>
// 			</Modal.Header>
// 			<Modal.Body>
// 			<Form>
//             <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
//               <Form.Label></Form.Label>
//               <Form.Control
//                 type="password"
//                 placeholder="password"
//                 autoFocus
// 				onChange={(e) => setValue(e.target.value)}
// 				onKeyDown={handleKeyDown}
//               />
//             </Form.Group>
//           </Form>
// 			</Modal.Body>
// 			<Modal.Footer>
// 				<Button variant="secondary" onClick={handleClose}>
// 					Close
// 				</Button>
// 				<Button variant="primary" onClick={() => handleSetPassword(value)}>
// 					Save Changes
// 				</Button>
// 			</Modal.Footer>
// 		</Modal>

			  


		
// 	</div>
// 	);
// }



export async function AuthorizeUser(props : any) : Promise<void>
{
	let { ban, setMessage, GetMessagesByRoom, define_room, room, handle_history} = props;
	if (ban === false) {
		setMessage([]);
		GetMessagesByRoom(handle_history, room.name);
		define_room(room.name);
	}
	else {

	}
}

export function ShortedName(name : string) : string
{
	if (name.length > 10)
		return (name.slice(0, 10) + "...");
	return (name);
}

export function LeaveRoom(props : any)
{
	let { define_room, current_user, socket  } = props;
	const [value, setValue] = React.useState("");
	return (
		<div>
		<input onChange={(e) => setValue(e.target.value)} placeholder="exit your room..." value={value} />
			<button onClick={() => socket?.emit("leaveRoom", { room_name: value, id_user: current_user.id})}>Leave room</button>
		</div>
	)

}

export function DeleteRoom(props : any)
{
	let { define_room, current_user, socket  } = props;
	const [value, setValue] = React.useState("");
	return (
		<div>
		<input onChange={(e) => setValue(e.target.value)} placeholder="delete your room..." value={value} />
			<button onClick={() => socket?.emit("deleteRoom", { room_name: value, id_user: current_user.id})}>Delete room</button>
		</div>
	)
}

export function SetAdmin(props : any)
{
	let { define_room, current_room, current_user, socket  } = props;
	const [value, setValue] = React.useState("");

	function emitAndClear() {
		socket?.emit("setAdmin", { room_name: current_room, id_user_from: current_user.id, login_user_to: value});
		// send(value);
		setValue("");
	}

	function handleKeyDown(event: any) {
		console.log(event.key);
		if (event.key === "Enter") {
		  event.preventDefault();
		//   send(value);
		emitAndClear();
		}
	}

	return (
		<div className='inputparam'>
			<input className='borderbox-param' onChange={(e) => setValue(e.target.value)} onKeyDown={handleKeyDown} placeholder="set admin login..." value={value} />
				<button className='input-param-button' onClick={() => emitAndClear() }>Set admin</button>
		</div>
	)
}



export function BanUser(props : any)
{
	let { define_room, current_room, current_user, socket  } = props;
	const [value, setValue] = React.useState("");
	const [date_value, setDate] = React.useState("");

	function emitAndClear() {
		socket?.emit("banUser", { room_name: current_room, id_user_from: current_user.id, login_user_to: value, ban_till: date_value});
		setDate("");
		setValue("");
	}

	return (
		<div className='inputparam'>
			<input className='borderbox-param' onChange={(e) => setValue(e.target.value)} placeholder="ban user login..." value={value} />
			<input className='borderbox-param' onChange={(e) => setDate(e.target.value)} placeholder="duration ban in min..." value={date_value} />
				<button className='input-param-button' onClick={() => emitAndClear()}>Ban</button>
		</div>
	);
}

export function UnbanUser(props : any)
{
	let { define_room, current_user, socket  } = props;
	const [value, setValue] = React.useState("");
	const [room_value, setRoom] = React.useState("");

	return (
		<div >
		<input className='borderbox-param' onChange={(e) => setRoom(e.target.value)} placeholder="define your room..." value={room_value} />
		<input className='borderbox-param' onChange={(e) => setValue(e.target.value)} placeholder="unban user login..." value={value} />
			<button className='input-param-button' onClick={() => socket?.emit("unbanUser", { room_name: room_value, id_user_from: current_user.id, login_user_to: value})}>Unban</button>
		</div>
	)
}

export function MuteUser(props: any)
{
	let { define_room, current_room, current_user, socket  } = props;
	const [value, setValue] = React.useState("");
	const [date_value, setDate] = React.useState("");


	function emitAndClear() {
		socket?.emit("muteUser", { room_name: current_room, id_user_from: current_user.id, login_user_to: value, mute_till: date_value});
		setDate("");
		setValue("");
	}


	return (
		<div className='inputparam'>
			<input className='borderbox-param' onChange={(e) => setValue(e.target.value)} placeholder="mute user login..." value={value} />
			<input className='borderbox-param' onChange={(e) => setDate(e.target.value)} placeholder="duration mute in min..." value={date_value} />
				<button className='input-param-button' onClick={() => emitAndClear()}>Mute</button>
		</div>
	)
}

export default RoomForm;