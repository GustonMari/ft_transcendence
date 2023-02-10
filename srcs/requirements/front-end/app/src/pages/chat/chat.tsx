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
import { HistoryDto } from "./dto/chat.dto";



export default function Chat() {

	const socket = Create_socket();
	const [messages, setMessage] = useState<string[]>([]);
	const [room, setRoom] = useState<string>('');
	const [currentUser, setCurrentUser] = useState<any>(null);
	const [history, setHistory] = useState<any>([]);

	useEffect(() => {
	  const getCurrentUser = async () => {
			try {
			  const res = await APP.get("/user/me");
			  setCurrentUser(res.data);
			} catch (error) {
				console.error(error);
			}
		};
		getCurrentUser();
	}, []);

	const send = (value: string) => {
		socket?.emit("message", {room: room, message: value, current_user: currentUser});
	}

	const define_room = async (room: string) => {
		setRoom(room);
		await socket?.emit("joinRoom", { room_name: room, id_user: currentUser.id} );
	}

	const message_listener = (message: string) => {
		setMessage([...messages, message]);
	}

	const history_listener = (history: HistoryDto) => {
		setHistory(history);
	}

	socket?.on("message", message_listener);
	
	// socket?.on("get_messages_history", history_listener);

	// useEffect(() => {
	// 	if (room) {
	// 	  socket?.emit("getMessagesByRoom", room);
	// 	}
	//   }, [room, socket]);

	return (
	<div>
		<h1>Chat</h1>
		<RoomForm define_room={define_room} current_user={currentUser} socket={socket} handle_history={history_listener}/>
		<LeaveRoom define_room={define_room} current_user={currentUser} socket={socket}/>
		<DeleteRoom define_room={define_room} current_user={currentUser} socket={socket}/>
		<SetAdmin define_room={define_room} current_user={currentUser} socket={socket}/>
		<BanUser define_room={define_room} current_user={currentUser} socket={socket}/>
		<UnbanUser define_room={define_room} current_user={currentUser} socket={socket}/>
		<MuteUser define_room={define_room} current_user={currentUser} socket={socket}/>
		<MessageInput send={send}/>
		<Messages messages={messages} room={room} socket={socket}/>
		<h1>Historique</h1>
		{/* <GetMessagesByRoom define_room={define_room} current_user={currentUser} socket={socket} handle_history={history_listener}/> */}
		<DisplayMessagesByRoom current_user={currentUser} history={history} socket={socket}/>

	</div>
	);
}