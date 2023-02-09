import React from "react";
import { HistoryDto } from "./dto/chat.dto";

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

export function GetMessagesByRoom(props: any)
{
	let { define_room, current_user, socket  } = props;
	const [room_name, set_room_name] = React.useState("");

	return (
		<div>
		<input onChange={(e) => set_room_name(e.target.value)} placeholder="get messages by room..." value={room_name} />
			<button onClick={() => socket?.emit("getMessagesByRoom", room_name )}>Get messages</button>
		</div>
	)
}

// export function DisplayMessagesByRoom(props: any)
// {
// 	let { current_user, socket, history  } = props;

		
// 	return (
// 		<div>
// 			{history.map((message: string[], index: number) => (
// 				<div key={index}>{message}</div>
// 			))}
// 		</div>
// 	)
// }

export function DisplayMessagesByRoom(props: any) {
	let { current_user, socket, history } = props;
  
	return (
	  <div>
		{history.map((historyItem: HistoryDto, index: number) => (
		  <div key={index}>
			{historyItem.sender_name} : {historyItem.current_message} 
		  </div>
		))}
	  </div>
	);
  }