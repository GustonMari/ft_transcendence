import React, { useEffect, useRef, useState } from "react";
import { HistoryDto, InfoMessage } from "./dto/chat.dto";
import { APP } from "../../api/app";
import Style from './Style.message.module.css';
import dayjs from "dayjs";
import 'dayjs/locale/fr';
import { Button, Modal, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
// import Button from 'react-bootstrap/Button';
// import { Modal } from 'react-bootstrap';
// import Form from 'react-bootstrap/Form';
import { ProgressBar } from "./utils";

dayjs.locale('fr'); // set locale to French


export default function Messages(props: any) {

	//! faire interface pour les props
	let {messages, room, socket} = props;

	return (
	<div>
		<h1>Messages</h1>
		<h1>c'est le = {room}</h1>
		{messages.map((message: string[], index: number) => (
			<div key={index}>{message}</div>
		))}
	</div>
	);
}

export function GetMessagesByRoom(handle_history: any, room_name: string)
{
		const getMessagesByRoom = async () => {
			try {
					const res = await APP.post("/chat/get_messages_by_room", {room_name: room_name});
					console.log('le get message', res.data);
					await handle_history(res.data);
			} catch (error) {
				console.error(error);
			}
		};
		getMessagesByRoom();
}

function IsSenderOrReceiver(props: any)
{
	let {historyItem, current_user, socket} = props;

	if(historyItem.sender_id == current_user.id)
		return (
			<div className={Style['wrapper-message']}>
				<div className={Style["message-receiver"]}>
					{historyItem.sender_name} : {historyItem.current_message}
					<span className={Style["chat-date"]}> {dayjs(historyItem.created_at).format("DD MMM YYYY À H:mm")} </span>
				</div>
				<PopupImageSelf imageSrc="https://cutt.ly/v8wcluh" classPass={Style["img-message-right"]} user={current_user} socket={socket}/>
			</div>
		);
	else
		return (
			<div>
				<div className={Style["wrapper-message"]}>	
					<PopupImageOther imageSrc="https://cutt.ly/v8wcluh" classPass={Style["img-message-left"]} user={historyItem.sender} current_user={current_user} socket={socket}/>
					<div className={Style["message-sender"]}>
						{historyItem.sender_name} : {historyItem.current_message}
						<span className={Style["chat-date"]}> {dayjs(historyItem.created_at).format("DD MMM YYYY À H:mm")} </span>
					</div>
					{/* <img className={Style["img-message-right"]} src="https://cutt.ly/v8wcluh"/> */}
				</div>
			</div>
	);
}


function IsSenderOrReceiver_socket(props: any)
{
	let {infomessage, current_user, socket} = props;

	if (infomessage.current_user.id == current_user.id)
		return (
			<div className={Style['wrapper-message']}>
				<div className={Style["message-receiver"]}>
		 			{infomessage.current_user.login} : {infomessage.message}
	 				<span className={Style["chat-date"]}> {dayjs(infomessage.created_at).format("DD MMM YYYY À H:mm")} </span>
				</div>
				<PopupImageSelf imageSrc="https://cutt.ly/v8wcluh" classPass={Style["img-message-right"]} user={current_user} socket={socket}/>
			</div>
		);
	else
		return (
			<div>
				<div className={Style["wrapper-message"]}>	
					<PopupImageOther imageSrc="https://cutt.ly/v8wcluh" classPass={Style["img-message-left"]} user={infomessage.current_user} current_user={current_user} socket={socket}/>
					<div className={Style["message-sender"]}>
						{infomessage.current_user.login} : {infomessage.message}
						<span className={Style["chat-date"]}> {dayjs(infomessage.created_at).format("DD MMM YYYY À H:mm")} </span>
					</div>
				</div>
			</div>
	);
}

export function DisplayMessagesByRoom(props: any) {
	let { current_user, socket, history, infomessage, room, handle_history} = props;

	const messagesContainer = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (messagesContainer.current) {
		  messagesContainer.current.scrollTop = messagesContainer.current.scrollHeight;
		}
	  }, [infomessage, history]);


	return (
	  <div ref={messagesContainer} className={Style['print-message']}>
		{!history ? "" : history.map((historyItem: HistoryDto, index: number) => (
		  <div key={index}>
			{ IsSenderOrReceiver({historyItem, current_user, socket}) }
		  </div>
		))}
		{infomessage.map((infomessage: any, index: number) => (
			<div key={index}>
				{IsSenderOrReceiver_socket({infomessage, current_user, socket})}
				</div>
		))}
	  </div>
	);

}


function PopupImageSelf(props: any) {
	const { imageSrc, classPass, user, socket} = props;
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
  
	if (user === undefined || user === null)
		return (
			<div>
				<h1>PROBLEM</h1>
			</div>
		);

	return (
	  <div>
		<a href="#" onClick={handleShow}>
			<img src={ imageSrc } className={classPass}/>
		</a>

		<Modal show={show} onHide={handleClose}>
		  <Modal.Header closeButton>
			<Modal.Title>Profile</Modal.Title>
		  </Modal.Header>
		  <Modal.Body className="text-center">
			<img src={ imageSrc } className="img-popup-user"/>
			<br />
			<br />
			<ProgressBar progress={70}/>
			<h4>LVL :</h4>
			<br />
			<h4>Login : {user.login}</h4>
			<h4>First Name : {user.first_name}</h4>
			<h4>Last Name : {user.last_name}</h4>
			<h4>Email : {user.email}</h4>
			<h4>State : {user.state}</h4>
		  </Modal.Body>
		  <Modal.Footer>
			<Button variant="secondary" onClick={handleClose}>
			  Close
			</Button>
		  </Modal.Footer>
		</Modal>
	  </div>
	);
  }

  function PopupImageOther(props: any) {
	const { imageSrc, classPass, user, current_user, socket} = props;
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	let [value, setValue] = React.useState("");
  
	function InviteFriend(event: any) {
		// if (event.key === "Enter") {
			// event.preventDefault();
			socket.emit("invite_pong", {user_to: user, current_user: current_user});
			// handleSetPassword(value);
		// }
	}

	if (user === undefined || user === null)
		return (
			<div>
				<h1>PROBLEM TA MERE</h1>
			</div>
		);

	return (
	  <div>
		<a href="#" onClick={handleShow}>
			<img src={ imageSrc } className={classPass}/>
		</a>

		<Modal show={show} onHide={handleClose}>
		  <Modal.Header closeButton>
			<Modal.Title>Profile</Modal.Title>
		  </Modal.Header>
		  {/* <Modal.Body className={Style["text-center"]}> */}
		  <Modal.Body className="text-center">
			<img src={ imageSrc } className={Style["img-popup-user"]}/>
			<br />
			<br />
			<ProgressBar progress={70}/>
			<h4>LVL :</h4>
			<br />
			<h4>Login : {user.login}</h4>
			<h4>First Name : {user.first_name}</h4>
			<h4>Last Name : {user.last_name}</h4>
			<h4>Email : {user.email}</h4>
			<h4>State : {user.state}</h4>
			<hr />
			<Button variant="secondary" onClick={InviteFriend}>
			  Invite to Pong
			</Button>
		  </Modal.Body>
		  <Modal.Footer>
			<Button variant="secondary" onClick={handleClose}>
			  Close
			</Button>
		  </Modal.Footer>
		</Modal>
	  </div>
	);
  }