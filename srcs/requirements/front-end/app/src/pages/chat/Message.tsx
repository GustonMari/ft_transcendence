import React, { useEffect } from "react";
import { HistoryDto, InfoMessage } from "./dto/chat.dto";
import { APP } from "../../api/app";

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
			} catch (error) {
				console.error(error);
			}
		};
		getMessagesByRoom();
}

// export function DisplayMessagesByRoom(props: any) {
// 	let { current_user, socket, history } = props;
  
// 	return (
// 	  <div>
// 		{history.map((historyItem: HistoryDto, index: number) => (
// 		  <div key={index}>
// 			{historyItem.sender_name} : {historyItem.current_message} 
// 		  </div>
// 		))}
// 	  </div>
// 	);


export function DisplayMessagesByRoom(props: any) {
	let { current_user, socket, history, infomessage, room} = props;
	if (infomessage == undefined && infomessage == null)
		return (
			<div>
				<h1>Mauvais bail</h1>
			</div>
		)
	else
		console.log("infomessage est bien la ");

	return (
	  <div>
		<h1>Messages</h1>
		<h1>c'est le = {room}</h1>
		{history.map((historyItem: HistoryDto, index: number) => (
		  <div key={index}>
			{historyItem.sender_name} : {historyItem.current_message} 
		  </div>
		))}
		{infomessage.map((infomessage: any, index: number) => (
			<div key={index}>
				{infomessage.current_user.login} : {infomessage.message}
				</div>
		))}
	  </div>
	);

}
