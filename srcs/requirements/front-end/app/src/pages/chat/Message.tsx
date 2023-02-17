import React, { useEffect, useRef } from "react";
import { HistoryDto, InfoMessage } from "./dto/chat.dto";
import { APP } from "../../api/app";
import './Style.message.css';

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
					console.log(res.data);
			} catch (erroQWDr) {
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
			<div className="message-sender">
				{historyItem.sender_name} : {historyItem.current_message}
			</div>
		);
	else
		return (
			<div className="wrapper-message">	
				<div className="message-receiver">
					{historyItem.sender_name} : {historyItem.current_message}
				</div>
			</div>
	);
}

function IsSenderOrReceiver_socket(props: any)
{
	let {infomessage, current_user} = props;

	if (infomessage.current_user.id == current_user.id)
	return (
		<div className="message-sender">
			{infomessage.current_user.login} : {infomessage.message}
		</div>
	);
	else
		return (
			<div className="wrapper-message">	
				<div className="message-receiver">
					{infomessage.current_user.login} : {infomessage.message}
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
