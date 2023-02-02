import React, { useEffect } from "react";
import { useState } from "react";
import io, { Socket } from "socket.io-client";
import MessageInput from "./Messageinput";
import Messages from "./Message";
import axios from "axios";
import Create_socket from "./socket";
import {RoomForm, LeaveRoom} from "./room";
import { APP } from "../../api/app";
import App from "../../App";



export default function Chat() {


	console.log("ZOUBI");
	const socket = Create_socket();
	const [messages, setMessage] = useState<string[]>([]);
	const [room, setRoom] = useState<string>('');
	// const [current_user, setCurrent_user] = useState<any>([]);
	const [currentUser, setCurrentUser] = useState<any>(null);

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

console.log("POULET = ", currentUser);
	if (currentUser !== null)
		socket?.emit("message", {room: room, message:  JSON.stringify(currentUser.login)  });

	const send = (value: string) => {
		socket?.emit("message", {room: room, message: value});
	}

	const define_room = async (room: string) => {
		setRoom(room);
		await socket?.emit("joinRoom", room);
	}

	const message_listener = (message: string) => {
		setMessage([...messages, message]);
	}

	socket?.on("message", message_listener);

	return (
	<div>
		<h1>Chat</h1>
		<RoomForm define_room={define_room}/>
		<LeaveRoom room_name={room} socket={socket}/>
		<MessageInput send={send}/>
		<Messages messages={messages} room={room} socket={socket}/>
	</div>
	);
}