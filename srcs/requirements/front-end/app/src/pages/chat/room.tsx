import React, { useState, useEffect } from 'react';
import io, { Socket } from "socket.io-client";
import Create_socket from './socket';
import { APP } from "../../api/app";
import './Style.message.css';
import { GetMessagesByRoom } from './Message';
import { setMaxIdleHTTPParsers } from 'http';

export function RoomForm(props : any)
{
	let {define_room, current_room, current_user, socket, handle_history, trigger, setTrigger, setMessage} = props;
	const [value, setValue] = React.useState("");

	const [rooms, setRooms] = useState<any>([]);

	useEffect(() => {
		const getRooms = async () => {
			try {
				const res = await APP.get("/chat/get_user_rooms");
				console.log('fetched', res.data);
				setRooms(res.data);
			} catch (error) {
				console.error(error);
			}
		};
		getRooms();
	}, [trigger]);

	const render_react = () => {
		setTrigger(trigger += 1);
	}

	return (
		<div className='between-room-input'>
		{/* <h1>Rooms</h1> */}
			<span className='room-list'>
				{rooms.map(room => (
					<li key={room.id}>
						<span className="conversation-container">
							<img className='conversationImg' src="" alt="" />

							<button className='conversation' onClick={() => {
								setMessage([]);
								GetMessagesByRoom(handle_history, room.name);
								socket?.emit("changeRoom", { room_name: current_room, id_user: current_user.id})
								define_room(room.name);
								socket?.on('renderReact', render_react);
								}}>{ ShortedName(room.name) }</button>
							<button className='conversation' onClick={() => {
								setMessage([]);
								socket?.emit("leaveRoom", { room_name: room.name, id_user: current_user.id})
								socket?.on('renderReact', render_react);
							}}>Leave</button>
							<button className='conversation' onClick={() => {
								setMessage([]);
								socket?.emit("deleteRoom", { room_name: room.name, id_user: current_user.id})
								socket?.on('renderReact', render_react);
							}}>Delete</button>
						</span>
					</li>
				))}
			</span>
			<div className='input-room'>
				<input className='borderbox' onChange={(e) => setValue(e.target.value)} placeholder="define your room..." value={value} />
				<button  onClick={() => {
					setMessage([]);
					define_room(value);
					socket?.emit("message", {room: value, message: `${current_user.login} has join the room ${value}`})
					socket?.on('renderReact', render_react);
				}
					}
				>Send</button>
			</div>
	</div>
	);
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
	let { define_room, current_user, socket  } = props;
	const [value, setValue] = React.useState("");
	const [room_value, setRoom] = React.useState("");
	return (
		<div>
		<input onChange={(e) => setRoom(e.target.value)} placeholder="define your room..." value={room_value} />
		<input onChange={(e) => setValue(e.target.value)} placeholder="set admin login..." value={value} />
			<button onClick={() => socket?.emit("setAdmin", { room_name: room_value, id_user_from: current_user.id, login_user_to: value})}>Set admin</button>
		</div>
	)
}

export function BanUser(props : any)
{
	let { define_room, current_user, socket  } = props;
	const [value, setValue] = React.useState("");
	const [room_value, setRoom] = React.useState("");
	const [date_value, setDate] = React.useState("");

	return (
		<div>
		<input onChange={(e) => setRoom(e.target.value)} placeholder="define your room..." value={room_value} />
		<input onChange={(e) => setValue(e.target.value)} placeholder="ban user login..." value={value} />
		<input onChange={(e) => setDate(e.target.value)} placeholder="duration ban in min..." value={date_value} />
			<button onClick={() => socket?.emit("banUser", { room_name: room_value, id_user_from: current_user.id, login_user_to: value, ban_till: date_value})}>Ban user</button>
		</div>
	)
}

export function UnbanUser(props : any)
{
	let { define_room, current_user, socket  } = props;
	const [value, setValue] = React.useState("");
	const [room_value, setRoom] = React.useState("");

	return (
		<div>
		<input onChange={(e) => setRoom(e.target.value)} placeholder="define your room..." value={room_value} />
		<input onChange={(e) => setValue(e.target.value)} placeholder="unban user login..." value={value} />
			<button onClick={() => socket?.emit("unbanUser", { room_name: room_value, id_user_from: current_user.id, login_user_to: value})}>Unban user</button>
		</div>
	)
}

export function MuteUser(props: any)
{
	let { define_room, current_user, socket  } = props;
	const [value, setValue] = React.useState("");
	const [room_value, setRoom] = React.useState("");
	const [date_value, setDate] = React.useState("");

	return (
		<div>
		<input onChange={(e) => setRoom(e.target.value)} placeholder="define your room..." value={room_value} />
		<input onChange={(e) => setValue(e.target.value)} placeholder="mute user login..." value={value} />
		<input onChange={(e) => setDate(e.target.value)} placeholder="duration mute in min..." value={date_value} />
			<button onClick={() => socket?.emit("muteUser", { room_name: room_value, id_user_from: current_user.id, login_user_to: value, mute_till: date_value})}>Mute user</button>
		</div>
	)
}

export default RoomForm;