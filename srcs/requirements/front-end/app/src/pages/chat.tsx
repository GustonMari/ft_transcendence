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
		const new_socket = io("http://localhost:3001");
		setSocket(new_socket);
	}, [setSocket]);

	const message_listener = (message: string) => {
		setMessage([...messages, message]);
	}

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