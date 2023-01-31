import React, { useState, useEffect } from 'react';
import io, { Socket } from "socket.io-client";

export default function Create_socket (): Socket | undefined {
	const [socket, setSocket] = useState<Socket>();

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

	return (
		socket
	);
}
