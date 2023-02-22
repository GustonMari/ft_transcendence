import React, { useEffect, useRef, useState } from "react";
import { HistoryDto, InfoMessage } from "./dto/chat.dto";
import { APP } from "../../api/app";
import './Style.message.css';
import dayjs from "dayjs";
import 'dayjs/locale/fr';
import { Button, Modal } from 'react-bootstrap';

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
					await handle_history(res.data);
			} catch (error) {
				console.error(error);
			}
		};
		getMessagesByRoom();
}

function IsSenderOrReceiver(props: any)
{
	let {historyItem, current_user} = props;

	if(historyItem.sender_id == current_user.id)
		return (
			<div className='wrapper-message'>
				{/* <img className="img-message-left" src="https://www.example.com/images/dinosaur.jpg"/> */}
				<PopupImage imageSrc="https://www.example.com/images/dinosaur.jpg" classPass="img-message-left"/>
				<div className="message-sender">
					{historyItem.sender_name} : {historyItem.current_message}
					<span className="chat-date"> {dayjs(historyItem.created_at).format("DD MMM YYYY À H:mm")} </span>
				</div>
			</div>
		);
	else
		return (
			<div>
				<div className="wrapper-message">	
					<div className="message-receiver">
						{historyItem.sender_name} : {historyItem.current_message}
						<span className="chat-date"> {dayjs(historyItem.created_at).format("DD MMM YYYY À H:mm")} </span>
					</div>
					<img className="img-message-right" src="ttps://www.example.com/images/dinosaur.jpg"/>
				</div>
			</div>
	);
}

function IsSenderOrReceiver_socket(props: any)
{
	let {infomessage, current_user} = props;

	if (infomessage.current_user.id == current_user.id)
	return (
		<>
			<div className="message-sender">
				{infomessage.current_user.login} : {infomessage.message}
				<br></br>
				<span className="chat-date"> {dayjs(infomessage.created_at).format("DD MMM YYYY À H:mm")} </span>
			</div>
		</>
	);
	else
	return (
		<div className="wrapper-message">	
				<div className="message-receiver">
					{infomessage.current_user.login} : {infomessage.message}
					<span className="chat-date"> {dayjs(infomessage.created_at).format("DD MMM YYYY À H:mm")} </span>
				</div>
			</div>
	);

}

export function DisplayMessagesByRoom(props: any) {
	let { current_user, socket, history, infomessage, room} = props;

	const messagesContainer = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (messagesContainer.current) {
		  messagesContainer.current.scrollTop = messagesContainer.current.scrollHeight;
		}
	  }, [infomessage, history]);



	return (
	  <div ref={messagesContainer} className='print-message'>
		{history.map((historyItem: HistoryDto, index: number) => (
		  <div key={index}>
			{ IsSenderOrReceiver({historyItem, current_user}) }
		  </div>
		))}
		{infomessage.map((infomessage: any, index: number) => (
			<div key={index}>
				{IsSenderOrReceiver_socket({infomessage, current_user})}
				</div>
		))}
	  </div>
	);

}


function PopupImage(props: any) {
	const { imageSrc, classPass } = props;
  
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
  
	return (
	  <div>
		<Button variant="primary" onClick={handleShow} >
		  <img src={ imageSrc } className={classPass}/>
		</Button>
  
		<Modal show={show} onHide={handleClose}>
		  <Modal.Header closeButton>
			<Modal.Title>Avatar</Modal.Title>
		  </Modal.Header>
		  <Modal.Body>
			<img src={ imageSrc }/>
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