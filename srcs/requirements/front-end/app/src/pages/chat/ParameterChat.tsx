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