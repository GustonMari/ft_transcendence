import React, { useEffect } from "react";
import { useState } from "react";
import io, { Socket } from "socket.io-client";
import MessageInput from "./Messageinput";
import Messages, { DisplayMessagesByRoom, GetMessagesByRoom } from "./Message";
import axios from "axios";
import Create_socket from "./socket";
import {RoomForm, LeaveRoom, DeleteRoom, SetAdmin, BanUser, UnbanUser, MuteUser, BlockUser, UnBlockUser} from "./room";
import { APP } from "../../api/app";
import App from "../../App";
import { RoomList } from "./navbar";
import { HistoryDto, InfoMessage } from "./dto/chat.dto";



export default function Chat() {

	const socket = Create_socket();
	const [messages, setMessage] = useState<any>([]);
	const [room, setRoom] = useState<string>('');
	const [currentUser, setCurrentUser] = useState<any>(null);
	const [history, setHistory] = useState<any>([]);

	const [trigger, setTrigger] = React.useState(0);

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
		console.log('message lsitener' + JSON.stringify(messages));
	}


	const history_listener = (history: HistoryDto) => {
		setHistory(history);
	}

	socket?.on("message", message_listener);

	return (
	<div>
		<h1>Chat</h1>
		<RoomForm
			define_room={define_room}
			current_room={room}
			current_user={currentUser}
			socket={socket}
			handle_history={history_listener}
			trigger={trigger}
			setTrigger={setTrigger}
			setMessage={setMessage}
			/>
		<DeleteRoom define_room={define_room} current_user={currentUser} socket={socket}/>
		<SetAdmin define_room={define_room} current_user={currentUser} socket={socket}/>
		<BanUser define_room={define_room} current_user={currentUser} socket={socket}/>
		<UnbanUser define_room={define_room} current_user={currentUser} socket={socket}/>
		<MuteUser define_room={define_room} current_user={currentUser} socket={socket}/>
		<MessageInput send={send}/>
		<h1>Historique</h1>
		<DisplayMessagesByRoom current_user={currentUser} socket={socket} history={history}  infomessage={messages} room={room}/>

	</div>
	);
}