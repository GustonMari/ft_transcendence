import React, { useEffect } from "react";
import { useState } from "react";
import io, { Socket } from "socket.io-client";
import MessageInput from "./Messageinput";
import Messages, { DisplayMessagesByRoom, GetMessagesByRoom } from "./Message";
import axios from "axios";
import Create_socket from "./socket";
import {RoomForm} from "./room/room";
import { APP } from "../../api/app";
import App from "../../App";
import { RoomList } from "./navbar";
import { HistoryDto, InfoMessage } from "./dto/chat.dto";

export function ParameterChat(props: any)
{
	let {define_room, current_room, current_user, socket} = props;

	return (
		<>
			<SetAdmin define_room={define_room} current_room={current_room} current_user={current_user} socket={socket}/>
			<BanUser define_room={define_room} current_room={current_room} current_user={current_user} socket={socket}/>
			{/* <UnbanUser define_room={define_room} current_user={current_user} socket={socket}/> */}
			<MuteUser define_room={define_room} current_room={current_room} current_user={current_user} socket={socket}/>
		</>
	);
}

export function SetAdmin(props : any)
{
	let { define_room, current_room, current_user, socket  } = props;
	const [value, setValue] = React.useState("");

	function emitAndClear() {
		socket?.emit("setAdmin", { room_name: current_room, id_user_from: current_user.id, login_user_to: value});
		setValue("");
	}

	function handleKeyDown(event: any) {
		if (event.key === "Enter") {
		  event.preventDefault();
		emitAndClear();
		}
	}

	return (
		<div className='inputparam'>
			<input className='borderbox-param' onChange={(e) => setValue(e.target.value)} onKeyDown={handleKeyDown} placeholder="set admin login..." value={value} />
			<button className='input-param-button' onClick={() => emitAndClear() }>Set admin</button>
		</div>
	)
}



export function BanUser(props : any)
{
	let { define_room, current_room, current_user, socket  } = props;
	const [value, setValue] = React.useState("");
	const [date_value, setDate] = React.useState("");

	function emitAndClear() {
		socket?.emit("banUser", { room_name: current_room, id_user_from: current_user.id, login_user_to: value, ban_till: date_value});
		setDate("");
		setValue("");
	}

	return (
		<div className='inputparam'>
			<input className='borderbox-param' onChange={(e) => setValue(e.target.value)} placeholder="ban user login..." value={value} />
			<input className='borderbox-param' onChange={(e) => setDate(e.target.value)} placeholder="duration ban in min..." value={date_value} />
				<button className='input-param-button' onClick={() => emitAndClear()}>Ban</button>
		</div>
	);
}

export function MuteUser(props: any)
{
	let { define_room, current_room, current_user, socket  } = props;
	const [value, setValue] = React.useState("");
	const [date_value, setDate] = React.useState("");


	function emitAndClear() {
		socket?.emit("muteUser", { room_name: current_room, id_user_from: current_user.id, login_user_to: value, mute_till: date_value});
		setDate("");
		setValue("");
	}

	return (
		<div className='inputparam'>
			<input className='borderbox-param' onChange={(e) => setValue(e.target.value)} placeholder="mute user login..." value={value} />
			<input className='borderbox-param' onChange={(e) => setDate(e.target.value)} placeholder="duration mute in min..." value={date_value} />
			<button className='input-param-button' onClick={() => emitAndClear()}>Mute</button>
		</div>
	)
}