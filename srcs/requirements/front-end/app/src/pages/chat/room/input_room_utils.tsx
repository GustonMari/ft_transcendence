import React, { useState, useEffect, useRef } from 'react';
import Popup from 'reactjs-popup';
import io, { Socket } from "socket.io-client";
import Create_socket from '../socket';
import { APP } from "../../../api/app";
import { GetMessagesByRoom } from '../Message';
import { setMaxIdleHTTPParsers } from 'http';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import { Modal } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { shakeIt } from '../utils';


/*
	InputRoom functions
*/


export async function checkIsPassword(value: string) {
	const res = await APP.post("/chat/is_room_has_password", {room_name: value});
	return res.data;
}

export async function checkPassword(value: string, password: string) {
	const res = await APP.post("/chat/verify_room_password", {room_name: value, password: password});
	return res.data;
}

export async function addRoom(setMessage: any, define_room: any, socket: Socket, current_user: any, value: string, setValue: any, handle_history: any, render_react: any) {
	setMessage([]);
	define_room(value);
	socket?.emit("message", {room: value, message: `${current_user.login} has join the room ${value}`});
	await GetMessagesByRoom(handle_history, value);
	socket?.on('renderReact', render_react);
	setValue("");
}
