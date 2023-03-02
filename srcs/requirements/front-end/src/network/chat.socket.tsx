import { useState, useEffect } from 'react';
import io, { Socket } from "socket.io-client";

// Create a socket and return it, using socket.io

export default function Create_socket (): Socket | undefined {
	const [socket, setSocket] = useState<Socket>();

	useEffect(() => {

		const new_socket = io("http://localhost:3001", {
			transports : ['websocket', 'polling', 'flashsocket'],
			withCredentials: true,
			extraHeaders: {
				'Access-Control-Allow-Origin': 'http://localhost:3001/',
				"Access-Control-Allow-Methods": "GET",
				"Access-Control-Allow-Headers": "my-custom-header",
				"Access-Control-Allow-Credentials": "true",
			},
			transportOptions: {
				polling: {
				  extraHeaders: {
				  },
				}
			}
			
		});
		setSocket(new_socket);
	}, [setSocket]);

	return (
		socket
	);
}

//create a function that will return cookie who is named access_token