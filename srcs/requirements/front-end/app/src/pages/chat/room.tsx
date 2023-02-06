import React, { useState, useEffect } from 'react';
import io, { Socket } from "socket.io-client";
import Create_socket from './socket';

export function RoomForm(/* {define_room}: {define_room: (value: string) => void} */props : any)
{
	let {define_room, current_user, socket} = props;
	const [value, setValue] = React.useState("");
	return (
	<div>
		<input onChange={(e) => setValue(e.target.value)} placeholder="define your room..." value={value} />
		<button onClick={() => {
			console.log('');
			define_room(value)
			socket?.emit("message", {room: value, message: `${current_user.login} has join the room ${value}`})
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

export default RoomForm;