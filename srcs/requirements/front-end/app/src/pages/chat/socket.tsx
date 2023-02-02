import React, { useState, useEffect } from 'react';
import io, { Socket } from "socket.io-client";
import Cookies from 'js-cookie';

// Create a socket and return it, using socket.io

export default function  Create_socket (): Socket | undefined {
	const [socket, setSocket] = useState<Socket>();

	useEffect(() => {

		// console.log("MON COOKIE = ", Cookies.get('access_token'))
		
		// let mycookie = /*  'access_token=' +  */Cookies.get('access_token') ;
		// if (mycookie === undefined)
		// 	mycookie = "";

		const new_socket = io("http://localhost:3000", {
			transports : ['websocket', 'polling', 'flashsocket'],
			withCredentials: true,
			extraHeaders: {
				'Access-Control-Allow-Origin': 'http://localhost:3000/',
				"Access-Control-Allow-Methods": "GET",
				"Access-Control-Allow-Headers": "my-custom-header",
				"Access-Control-Allow-Credentials": "true",
				// "cookie": mycookie,
				// "authorization": 'Bearer ' + mycookie
			},
			transportOptions: {
				polling: {
				  extraHeaders: {
					// cookie: mycookie,
					// authorization: 'Bearer ' + mycookie
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