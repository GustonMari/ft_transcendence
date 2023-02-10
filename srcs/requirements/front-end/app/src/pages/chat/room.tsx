import React, { useState, useEffect } from 'react';
import io, { Socket } from "socket.io-client";
import Create_socket from './socket';
import { APP } from "../../api/app";
import './Style.message.css';
import { GetMessagesByRoom } from './Message';

// export function RoomForm(props : any)
// {
// 	let {define_room, current_user, socket} = props;

// 	const [value, setValue] = React.useState("");
// 	return (
// 	<div>
// 		<input onChange={(e) => setValue(e.target.value)} placeholder="define your room..." value={value} />
// 		<button onClick={() => {
// 			console.log('');
// 			define_room(value)
// 			socket?.emit("message", {room: value, message: `${current_user.login} has join the room ${value}`})
// 		}
// 			}
// 		>Send</button>
// 	</div>
// 	);
// }

export function RoomForm(props : any)
{
	let {define_room, current_room, current_user, socket, handle_history, trigger, setTrigger} = props;
	let counter = 0;
	const [value, setValue] = React.useState("");
	// const [trigger, setTrigger] = React.useState("");

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
	return (
	<div>
		<h1>Liste de vos Rooms</h1>
			<ul>
				{rooms.map(room => (
					<li key={room.id}>
						<span className="conversation-container">
							<img className='conversationImg' src="" alt="" />

							<button className='conversation' onClick={() => {
								GetMessagesByRoom(handle_history, room.name);
								socket?.emit("changeRoom", { room_name: current_room, id_user: current_user.id})
								define_room(room.name);
								}}>{room.name}</button>
							<button onClick={() => {
								socket?.emit("leaveRoom", { room_name: room.name, id_user: current_user.id})
								setTrigger(counter += 1)
							}}>Leave room</button>
								
						</span>
					</li>
				))}
			</ul>
		<input onChange={(e) => setValue(e.target.value)} placeholder="define your room..." value={value} />
		<button onClick={() => {
			console.log('');
			define_room(value);
			socket?.emit("message", {room: value, message: `${current_user.login} has join the room ${value}`})
			setTrigger(value)
		}
			}
		>Send</button>
	</div>
	);
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