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
//shake_id = id of the modal
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

export function ProgressBar(props: any)
{
	let {progress} = props;

	document.documentElement.style.setProperty('--progress-percentage', `${progress}%`);
	
	// const progressColor = `linear-gradient(to right, green ${progress}%, red ${progress}%)`;
	
	return (
		<div className='container-progress-bar'>
			<div className="filler-progress-bar">
				<span /* className="progress" */>{`${progress}%`}</span>
			</div>
		</div>
	);
}