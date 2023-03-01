import React, { useState, useEffect, useRef } from 'react';
import Popup from 'reactjs-popup';
import io, { Socket } from "socket.io-client";
import Create_socket from '../socket';
import { APP } from "../../../api/app";
// import '../Style.message.css';
import './Style.room.css';
import { GetMessagesByRoom } from '../Message';
import { setMaxIdleHTTPParsers } from 'http';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import { Modal } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { AuthorizeUser, shakeIt, ShortedName } from '../utils';
import { addRoom, checkIsPassword, checkPassword } from './input_room_utils';
import { InputRoom } from './input_room';
import { PopupDelete, PopupLeave, PopupPassword } from './popup_room';

export function RoomForm(props : any)
{
	let {define_room, current_room, current_user, socket, handle_history, trigger, setTrigger, setMessage, setRoom} = props;
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

	socket?.on('renderReact', render_react);
	
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
									}}>{ ShortedName(room.name) }
								</button>
							</div>
							<div className='split'>
								<PopupLeave setMessage={setMessage} socket={socket} room={room} current_user={current_user} render_react={render_react} GetMessagesByRoom={GetMessagesByRoom} handle_history={handle_history}></PopupLeave>
								<PopupDelete setMessage={setMessage} socket={socket} room={room} current_user={current_user} render_react={render_react} GetMessagesByRoom={GetMessagesByRoom} handle_history={handle_history}></PopupDelete>
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
			render_react={render_react}
			setRoom={setRoom}
			GetMessagesByRoom={GetMessagesByRoom}
			/>
	</div>
	);
}

// export function LeaveRoom(props : any)
// {
// 	let { define_room, current_user, socket  } = props;
// 	const [value, setValue] = React.useState("");
// 	return (
// 		<div>
// 		<input onChange={(e) => setValue(e.target.value)} placeholder="exit your room..." value={value} />
// 			<button onClick={() => socket?.emit("leaveRoom", { room_name: value, id_user: current_user.id})}>Leave room</button>
// 		</div>
// 	)

// }

// export function DeleteRoom(props : any)
// {
// 	let { define_room, current_user, socket  } = props;
// 	const [value, setValue] = React.useState("");
// 	return (
// 		<div>
// 			<input onChange={(e) => setValue(e.target.value)} placeholder="delete your room..." value={value} />
// 			<button onClick={() => socket?.emit("deleteRoom", { room_name: value, id_user: current_user.id})}>Delete room</button>
// 		</div>
// 	)
// }



// export function UnbanUser(props : any)
// {
// 	let { define_room, current_user, socket  } = props;
// 	const [value, setValue] = React.useState("");
// 	const [room_value, setRoom] = React.useState("");

// 	return (
// 		<div >
// 			<input className='borderbox-param' onChange={(e) => setRoom(e.target.value)} placeholder="define your room..." value={room_value} />
// 			<input className='borderbox-param' onChange={(e) => setValue(e.target.value)} placeholder="unban user login..." value={value} />
// 			<button className='input-param-button' onClick={() => socket?.emit("unbanUser", { room_name: room_value, id_user_from: current_user.id, login_user_to: value})}>Unban</button>
// 		</div>
// 	)
// }



export default RoomForm;