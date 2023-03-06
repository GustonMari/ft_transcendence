import React, { useState, useEffect, useRef } from 'react';
import Popup from 'reactjs-popup';
import io, { Socket } from "socket.io-client";
import Create_socket from './socket';
import { APP } from "../../api/app";
import Style from './Style.message.module.css';
import StyleUtils from './Style.utils.module.css'
import { GetMessagesByRoom } from './Message';
import { setMaxIdleHTTPParsers } from 'http';
// import 'reactjs-popup/dist/index.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import { Modal } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';

//shake_name = css name of the modal
export function shakeIt(shake_name: string, room_name: string) {
	const modal = document.getElementById(`shaking-${room_name}`);
	console.log("modal", modal);
	if (modal) {
		modal.classList.add(Style.shake);
		setTimeout(() => {
			modal.classList.remove(Style.shake);
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
		<div className={StyleUtils['container-progress-bar']}>
			<div className={StyleUtils["filler-progress-bar"]}>
				<span /* className="progress" */>{`${progress}%`}</span>
			</div>
		</div>
	);
}