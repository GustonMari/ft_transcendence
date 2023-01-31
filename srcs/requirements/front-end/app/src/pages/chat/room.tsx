import React, { useState, useEffect } from 'react';
import io, { Socket } from "socket.io-client";
import Create_socket from './socket';

// export class Room extends React.Component 
export function Room () 
{
	// const [socket, setSocket] = useState<Socket>();
	const [room_name, setRoomName] = useState<string>("");

	const change_room_name = (room_name: string) => {
		setRoomName(room_name);
	}

	

	

	return (
		<div>
			<h1>Room</h1>
			{/* <h1>On est dans la room {this.props.room.id}</h1> */}
			
		</div>
	)
}

export default Room;