import React, { useEffect } from "react";
import { useState } from "react";
import io, { Socket } from "socket.io-client";
import MessageInput from "../Messageinput";
import Messages from "../Message";
import axios from "axios";

export default function Chat() {

	const [socket, setSocket] = useState<Socket>();
	const [messages, setMessage] = useState<string[]>([]);

	const send = (value: string) => {
		socket?.emit("message", value);
	}

	useEffect(() => {
		const new_socket = io("http://localhost:3000", {
			transports : ['websocket', 'polling', 'flashsocket'],
			withCredentials: true,
			extraHeaders: {
				'Access-Control-Allow-Origin': 'http://localhost:3000/',
				"Access-Control-Allow-Methods": "GET",
				"Access-Control-Allow-Headers": "my-custom-header",
				"Access-Control-Allow-Credentials": "true"
			}

		});
		setSocket(new_socket);
	}, [setSocket]);

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
		<Messages messages={messages}/>
	</div>
	);
}