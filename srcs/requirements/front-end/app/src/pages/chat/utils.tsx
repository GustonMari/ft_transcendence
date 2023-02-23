import React, { useState, useEffect, useRef } from 'react';
import Popup from 'reactjs-popup';
import io, { Socket } from "socket.io-client";
import Create_socket from './socket';
import { APP } from "../../api/app";
import './Style.message.css';
import { GetMessagesByRoom } from './Message';
import { setMaxIdleHTTPParsers } from 'http';
// import 'reactjs-popup/dist/index.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import { Modal } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';

export function shakeIt(shake_name: string, shake_id: string)
{
	const modalPopup = document.getElementById(shake_id);
	if (modalPopup)
	{
		modalPopup.classList.add("shake");
		setTimeout(() => {
			modalPopup.classList.remove("shake");
		}, 500);
	}
}