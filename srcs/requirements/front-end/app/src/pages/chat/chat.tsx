import React, { useEffect } from "react";
import { useState } from "react";
import io, { Socket } from "socket.io-client";
import MessageInput from "./Messageinput";
import Messages from "./Message";
import axios from "axios";
import Create_socket from "./socket";

export default function Chat() {

	const socket = Create_socket();
	const [messages, setMessage] = useState<string[]>([]);
	
	const [room, setRoom] = useState<string[]>([]);

	const send = (value: string) => {
		socket?.emit("message", value);
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
		socket?.on("message", message_listener);
		return () => {
			socket?.off("message", message_listener);
		}
	}, [message_listener]);

	return (
	<div>
		<h1>Chat</h1>
		<MessageInput send={send}/>
		<Messages messages={messages} room={"room1"}/>
	</div>
	);
}