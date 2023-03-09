import React, { useEffect } from "react";
import { useState } from "react";
import io, { Socket } from "socket.io-client";
import MessageInput from "./Messageinput";
import Messages, { DisplayMessagesByRoom, GetMessagesByRoom } from "./Message";
import axios from "axios";
import Create_socket from "./socket";
import {RoomForm, LeaveRoom, DeleteRoom, SetAdmin, BanUser, UnbanUser, MuteUser } from "./room/room";
import { APP } from "../../api/app";
import App from "../../App";
import { RoomList } from "./navbar";
import { ParameterChat } from "./ParameterChat";
import { HistoryDto, InfoMessage } from "./dto/chat.dto";
import { Button, Modal } from "react-bootstrap";
import Style from './Style.message.module.css';
import StyleRoom from './room/Style.room.module.css';
import StyleUtils from './Style.utils.module.css';
import PrivateRoute from "../../components/PrivateRoute";
import { Navigate, redirect, Route, Routes, useNavigate } from "react-router-dom";
import Pong from "../pong/pong";


// export function NavigateToPong () {
// 	const navigate = useNavigate();

// 	return (
// 		<>	
// 			{navigate('/pong')}
// 		</>
// 	)
// }


export default function Chat() {
	
	const socket = Create_socket();
	const [messages, setMessage] = useState<any>([]);
	const [room, setRoom] = useState<string>('');
	const [currentUser, setCurrentUser] = useState<any>(null);
	const [history, setHistory] = useState<any>([]);
	const [trigger, setTrigger] = React.useState(0);
	const [popup_pong, setPopup_pong] = useState<any>(null);
	const [triggerPong, setTriggerPong] = React.useState(false);

	
	useEffect(() => {
		const getCurrentUser = async () => {
			try {
				const res = await APP.get("/user/me");
				setCurrentUser(res.data);
			} catch (error) {
				console.error(error);
			}
		};
		getCurrentUser();
	}, []);
	
	useEffect(() => {
		socket?.on('connected', () => {
			socket?.emit('addsocket', currentUser);
		});
	}, [currentUser]);



	const send = (value: string) => {
		socket?.emit("message", {room: room, message: value, current_user: currentUser});
	}

	const define_room = async (room: string) => {
		setRoom(room);
		await socket?.emit("joinRoom", { room_name: room, id_user: currentUser.id} );
	}

	const message_listener = (infomessage: any) => {
		if (messages == undefined || messages == null)
			setMessage(infomessage);
		setMessage([...messages, infomessage]);
	}

	const history_listener = (history: HistoryDto) => {
		setHistory(history);
	}

	socket?.on("message", message_listener);

	socket?.on('invite_pong_request', (data: any) => {
		setPopup_pong(data.sender_invite);
	});

	socket?.on('redirect_to_pong', (data: any) => {
		console.log('piscine chez paulette invite_pong_response', data);

		setTriggerPong(true);
		
	});



	// if (triggerPong == true) {
	// 	// console.log("zeubi la mouche")
	// 	// try{
	// 	// 		const navigate = useNavigate();
	// 	// 		navigate('/pong');
	// 	// 	// const navigate = useNavigate();
	// 	// 	// navigate('/pong', { replace: true });
	// 	// }
	// 	// catch (error) {
	// 	// 	console.log(error);
	// 	// }
	// 	// redirect('/pong');
	// 	// return (
	// 	// 	// <NavigateToPong />
			
	// 	// )
	// 	return (
	// 		<div>
	// 			<h1>
	// 				Heyyy
	// 			</h1>
	// 		</div>
	// 	)
		
	// }
	// else {
		return (
			<div>
				<div>
					{/* nav bar */}
				</div>
				<div>
					{popup_pong ? (<Popup_invite_pong sender_invite={popup_pong} currentUser={currentUser} setPopup_pong={setPopup_pong} socket={socket}/> ) : (<></>)}
				</div>
				<div className={Style["global"]}>
					<div className={StyleRoom["room-menu"]}>
						<RoomForm
							define_room={define_room}
							current_room={room}
							current_user={currentUser}
							socket={socket}
							handle_history={history_listener}
							trigger={trigger}
							setTrigger={setTrigger}
							setMessage={setMessage}
							setRoom={setRoom}
							/>
					</div>
					<div className={Style["message-box"]}>
						<DisplayMessagesByRoom current_user={currentUser} socket={socket} history={history} infomessage={messages} room={room} handle_history={history_listener}/>
						<MessageInput send={send}/>
					</div>
					<div className={Style["menu-chat"]}>
						<ParameterChat define_room={define_room} current_room={room} current_user={currentUser} socket={socket}/>
					</div>
				</div>
			</div>
		);
	// }

	
}

function Popup_invite_pong(props : any) {
	const {sender_invite, currentUser, setPopup_pong, socket} = props;
	const [show, setShow] = useState(true);
	const handleClose = () => {
		setShow(false)
		setPopup_pong(null);
	};
	// const handleShow = () => setShow(true);
	console.log('oooooooooooooooooooo =', sender_invite, "aaaaaaaaaaaaaaaaaaaaa = ", currentUser);

	if (!sender_invite)
		return (<div>
			<h1>
				salut ta mere
			</h1>
		</div>);

	function InviteToPong()
	{
		socket?.emit('invite_pong_response', {sender_invite: sender_invite, currentUser: currentUser});
		// handleClose();
	}

	return (
	  <>

		<Modal show={show} onHide={handleClose}>
		  <Modal.Header closeButton>
			<Modal.Title>Invite</Modal.Title>
		  </Modal.Header>
		  <Modal.Body className="text-center">
			<h1>
				{sender_invite.login} want to play with you
			</h1>
			<div>
				<Button className={StyleUtils["between-button"]} variant="primary" onClick={InviteToPong}>
								Accept
				</Button>
				<Button className={StyleUtils["between-button"]} variant="primary" onClick={handleClose}>
								Refuse
				</Button>
			</div>
		  </Modal.Body>
		  <Modal.Footer>
			<Button variant="secondary" onClick={handleClose}>
			  Close
			</Button>
		  </Modal.Footer>
		</Modal>
	  </>
	);



}
