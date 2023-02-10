import React, { useEffect } from "react";
import { HistoryDto } from "./dto/chat.dto";
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

// export function GetMessagesByRoom(props: any)
// {
// 	let { define_room, current_user, socket  } = props;
// 	const [room_name, set_room_name] = React.useState("");

// 	useEffect(() => {
// 		const getMessagesByRoom = async () => {
// 			try {
// 				const res = await APP.get("/chat/get_messages_by_room", {
// 					params: {
// 						room_name: room_name
// 				}});
// 				console.log(res.data);
// 			} catch (error) {
// 				console.error(error);
// 			}
// 		};
// 		getMessagesByRoom();
// 	}, [room_name]);

// 	return (
// 		<div>
// 		<input onChange={(e) => set_room_name(e.target.value)} placeholder="get messages by room..." value={room_name} />
// 		<button onClick={}> </button>
// 			{/* <button onClick=  >Get messages</button> */}
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
