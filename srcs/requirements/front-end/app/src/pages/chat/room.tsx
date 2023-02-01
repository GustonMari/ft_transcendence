import React, { useState, useEffect } from 'react';
import io, { Socket } from "socket.io-client";
import Create_socket from './socket';

export function RoomForm({define_room}: {define_room: (value: string) => void}/* props : any */)
{
	const [value, setValue] = React.useState("");
	return (
	<div>
		<input onChange={(e) => setValue(e.target.value)} placeholder="define your room..." value={value} />
		<button onClick={() => define_room(value)}>Send</button>
	</div>
	);
}

export function LeaveRoom(props : any)
{
	let { room_name, socket } = props;
	return (
		<div>
			<button onClick={() => socket?.emit("leaveRoom", room_name)}>Leave room</button>
		</div>
	)

}

export default RoomForm;