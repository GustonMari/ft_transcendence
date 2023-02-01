import React, { useEffect } from "react";
import { useState } from "react";
import io, { Socket } from "socket.io-client";
import MessageInput from "./Messageinput";
import Messages from "./Message";
import axios from "axios";
import Create_socket from "./socket";
import RoomForm from "./room";

export default function Chat(): any {

	//

	const socket = Create_socket();
	const [messages, setMessage] = useState<string[]>([]);
	
	const [room, setRoom] = useState<string>('');

	const send = (value: string) => {
		console.log("send = " + socket?.id);
		socket?.emit("message", {room: room, message: value});
	}

	const define_room = (room: string) => {
		console.log("define room");
		setRoom(room);
	}

	const message_listener = (message: string) => {
		setMessage([...messages, message]);
	}

	////! A la connexion
	// socket?.on("connect", () => {
	// 	// ...
	// 	console.log("connected")
	// 	alert("connected");
	//   });
	
	  useEffect(() => {
		socket?.onAny((event, ...args) => {
			console.log("socket id in any = " + socket.id);
			console.log(event, args);
			
		  });
		socket?.on("message", message_listener);
		return () => {
			socket?.off("message", message_listener);
		}
	}, [message_listener]);



	return (
	<div>
		<h1>Chat</h1>
		<RoomForm define_room={define_room}/>
		<MessageInput send={send}/>
		<Messages messages={messages} room={room} socket={socket}/>
		{/* <h1>===============================================</h1>
		<MessageInput send={send}/>
		<Messages messages={messages} room={"room2"} socket={socket}/> */}
	</div>
	);
}