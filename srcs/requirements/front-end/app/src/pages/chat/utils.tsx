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
import './utils.css'

//shake_name = css name of the modal
export function shakeIt(shake_name: string, room_name: string) {
	const modal = document.getElementById(`shaking-${room_name}`);
	if (modal) {
		modal.classList.add('shake');
		setTimeout(() => {
			modal.classList.remove('shake');
		}, 500);
	}
  }

export async function AuthorizeUser(props : any) : Promise<void>
{
	let { ban, setMessage, GetMessagesByRoom, define_room, room, handle_history} = props;
	if (ban === false) {
		setMessage([]);
		GetMessagesByRoom(handle_history, room.name);
		define_room(room.name);
	}
}

export function ShortedName(name : string) : string
{
	if (name.length > 10)
		return (name.slice(0, 10) + "...");
	return (name);
}

export function ProgressBar(props: any)
{
	let {progress} = props;

	document.documentElement.style.setProperty('--progress-percentage', `${progress}%`);
	
	
	return (
		<div className='container-progress-bar'>
			<div className="filler-progress-bar">
				<span /* className="progress" */>{`${progress}%`}</span>
			</div>
		</div>
	);
}