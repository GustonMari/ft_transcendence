import React, { useEffect } from "react";
import { useState } from "react";
import io, { Socket } from "socket.io-client";
import MessageInput from "./Messageinput";
import Messages from "./Message";
import axios from "axios";
import Create_socket from "./socket";

export default function Chat(): any {

	//

	const socket = Create_socket();
	const [messages, setMessage] = useState<string[]>([]);
	
	const [room, setRoom] = useState<string[]>([]);

	const send = (value: string) => {
		console.log("send = " + socket?.id);
		socket?.emit("message", {room:  "room1", message: value});
	}

	const message_listener = (message: string) => {
		console.log("message_listener = ");
		setMessage([...messages, message]);
	}

	////! A la connexion
	// socket?.on("connect", () => {
	// 	// ...
	// 	console.log("connected")
	// 	alert("connected");
	//   });
	
	  useEffect(() => {
		console.log("useEffect =");
		socket?.onAny((event, ...args) => {
			console.log("all =");
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
		<MessageInput send={send}/>
		<Messages messages={messages} room={"room1"} socket={socket}/>
	</div>
	);
}