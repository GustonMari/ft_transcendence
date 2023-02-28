// import React, { useState, useEffect, useRef } from 'react';
// import Popup from 'reactjs-popup';
// import io, { Socket } from "socket.io-client";
// import Create_socket from './socket';
// import { APP } from "../../api/app";
// import './Style.message.css';
// import { GetMessagesByRoom } from './Message';
// import { setMaxIdleHTTPParsers } from 'http';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import Button from 'react-bootstrap/Button';
// import { Modal } from 'react-bootstrap';
// import Form from 'react-bootstrap/Form';
// import { shakeIt } from './utils';

// async function checkIsPassword() {
// 	const res = await APP.post("/chat/is_room_has_password", {room_name: value});
// 	return res.data;
// }

// async function checkPassword() {
// 	const res = await APP.post("/chat/verify_room_password", {room_name: value, password: password});
// 	return res.data;
// }