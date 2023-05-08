import React, { useEffect } from "react";
import { useState } from "react";
import io, { Socket } from "socket.io-client";
import MessageInput from "../messages/Message";
import Messages, { DisplayMessagesByRoom, GetMessagesByRoom } from "../messages/Message";
import Create_socket from "../../network/chat.socket";
import {RoomForm} from "../rooms/RoomForm";
import { APP } from "../../network/app";
import App from "../../App";
import { HistoryDto, InfoMessage } from "../../dtos/chat.dto";
import Style from "../../styles/messages/Style.message.module.css";


export function ParameterChat(props: any)
{
	let {define_room, current_room, current_user, socket} = props;

	return (
		<>
			<SetAdmin define_room={define_room} current_room={current_room} current_user={current_user} socket={socket}/>
			<BanUser define_room={define_room} current_room={current_room} current_user={current_user} socket={socket}/>
			<KickUser define_room={define_room} current_room={current_room} current_user={current_user} socket={socket}/>
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
		if (value !== "")
		{
			socket?.emit("setAdmin", { room_name: current_room, id_user_from: current_user.id, login_user_to: value});
			setValue("");
		}
	}

	function handleKeyDown(event: any) {
		if (event.key === "Enter") {
		  event.preventDefault();
		emitAndClear();
		}
	}

	return (
		<div className={Style['inputparam']}>
			<input className={Style['borderbox-param']} onChange={(e) => setValue(e.target.value)} onKeyDown={handleKeyDown} placeholder="set admin login..." value={value} />
			<button className={Style['input-param-button']} onClick={() => emitAndClear() }>Set admin</button>
		</div>
	)
}

export function KickUser(props: any)
{
	let { define_room, current_room, current_user, socket  } = props;
	const [value, setValue] = React.useState("");

	function emitAndClear() {
		if (value !== "")
		{
			socket?.emit("kickUser", { room_name: current_room, id_user_from: current_user.id, login_user_to: value});
			setValue("");
		}
	}

	return (
		<div className={Style['inputparam']}>
			<input className={Style['borderbox-param']} onChange={(e) => setValue(e.target.value)} placeholder="kick user login..." value={value} />
				<button className={Style['input-param-button']} onClick={() => emitAndClear()}>Kick</button>
		</div>
	);
}

export function BanUser(props : any)
{
	let { define_room, current_room, current_user, socket  } = props;
	const [value, setValue] = React.useState("");
	const [date_value, setDate] = React.useState("");

	function emitAndClear() {
		if (date_value !== "" || value !== "")
		{
			socket?.emit("banUser", { room_name: current_room, id_user_from: current_user.id, login_user_to: value, ban_till: date_value});
			setDate("");
			setValue("");
		}
	}

	return (
		<div className={Style['inputparam']}>
			<input className={Style['borderbox-param']} onChange={(e) => setValue(e.target.value)} placeholder="ban user login..." value={value} />
			<input className={Style['borderbox-param']} onChange={(e) => setDate(e.target.value)} placeholder="duration ban in min..." value={date_value} />
				<button className={Style['input-param-button']} onClick={() => emitAndClear()}>Ban</button>
		</div>
	);
}

export function MuteUser(props: any)
{
	let { define_room, current_room, current_user, socket  } = props;
	const [value, setValue] = React.useState("");
	const [date_value, setDate] = React.useState("");


	function emitAndClear() {
		if (date_value !== "" || value !== "")
		{
			socket?.emit("muteUser", { room_name: current_room, id_user_from: current_user.id, login_user_to: value, mute_till: date_value});
			setDate("");
			setValue("");
		}
	}

	return (
		<div className={Style['inputparam']}>
			<input className={Style['borderbox-param']} onChange={(e) => setValue(e.target.value)} placeholder="mute user login..." value={value} />
			<input className={Style['borderbox-param']} onChange={(e) => setDate(e.target.value)} placeholder="duration mute in min..." value={date_value} />
			<button className={Style['input-param-button']} onClick={() => emitAndClear()}>Mute</button>
		</div>
	)
}