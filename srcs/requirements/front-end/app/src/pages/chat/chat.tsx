import React, { useEffect } from "react";
import { useState } from "react";
import io, { Socket } from "socket.io-client";
import MessageInput from "./Messageinput";
import Messages, { DisplayMessagesByRoom, GetMessagesByRoom } from "./Message";
import axios from "axios";
import Create_socket from "./socket";
import {RoomForm, LeaveRoom, DeleteRoom, SetAdmin, BanUser, UnbanUser, MuteUser, BlockUser, UnBlockUser} from "./room";
import { APP } from "../../api/app";
import App from "../../App";
import { RoomList } from "./navbar";
import { ParameterChat } from "./ParameterChat";
import { HistoryDto, InfoMessage } from "./dto/chat.dto";



export default function Chat() {

	const socket = Create_socket();
	const [messages, setMessage] = useState<any>([]);
	const [room, setRoom] = useState<string>('');
	const [currentUser, setCurrentUser] = useState<any>(null);
	const [history, setHistory] = useState<any>([]);
	const [trigger, setTrigger] = React.useState(0);

	useEffect(() => {
		const getCurrentUser = async () => {
			try {
				const res = await APP.get("/user/me");
				setCurrentUser(res.data);
				console.log("hello world, current user = ", currentUser, "| socket = ", socket);
			} catch (error) {
				console.error(error);
			}
		};
		getCurrentUser();
	}, []);

	useEffect(() => {
		socket?.on('connected', () => {
			console.log('Server connected');
			socket?.emit('addsocket', currentUser);
		  });
	}, [currentUser]);
	
	
	const send = (value: string) => {
		socket?.emit("message", {room: room, message: value, current_user: currentUser});
	}

	const define_room = async (room: string) => {
		setRoom(room);
		await socket?.emit("joinRoom", { room_name: room, id_user: currentUser.id} );
	}

	const message_listener = (infomessage: any) => {
		if (messages == undefined || messages == null)
			setMessage(infomessage);
		setMessage([...messages, infomessage]);
	}


	const history_listener = (history: HistoryDto) => {
		setHistory(history);
	}

	socket?.on("message", message_listener);

	// socket?.on('joinPrivateRoom', async (data: any) => {
	// 	console.log("joinPrivateRoom", data);
	// 	setRoom(data.room_name);
	// });

	

	return (
	<div>
		<div>
			{/* <nav className="nav-bar">
				<a className='nav-bar-box' href="">Home</a>
				<a href="">Rooms</a>
				<a href="">Profile</a>
				<a href="">Logout</a>
				<a href="">Settings</a>
			</nav> */}
		</div>
		<div className="global">
			<div className="room-menu">
				<RoomForm
					define_room={define_room}
					current_room={room}
					current_user={currentUser}
					socket={socket}
					handle_history={history_listener}
					trigger={trigger}
					setTrigger={setTrigger}
					setMessage={setMessage}
					setRoom={setRoom}
					/>
			</div>
			<div className="message-box">
				<DisplayMessagesByRoom current_user={currentUser} socket={socket} history={history} infomessage={messages} room={room} handle_history={history_listener}/>
				<MessageInput send={send}/>
			</div>
			<div className="menu-chat">
				<ParameterChat define_room={define_room} current_room={room} current_user={currentUser} socket={socket}/>
			</div>
		</div>
	</div>
	);
}