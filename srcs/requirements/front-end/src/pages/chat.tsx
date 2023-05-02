import React, { useContext, useEffect } from "react";
import { useState } from "react";
import MessageInput from "../components/messages/MessageInput";
import { DisplayMessagesByRoom, GetMessagesByRoom } from "../components/messages/Message";
import Create_socket from "../network/chat.socket";
import {RoomForm} from "../components/rooms/RoomForm";
import { APP } from "../network/app";
import { ParameterChat } from "../components/chat/ParameterChat";
import { HistoryDto, InfoMessage } from "../dtos/chat.dto";
import Style from "../styles/messages/Style.message.module.css";
import StyleRoom from "../styles/rooms/Style.room.module.css";
import { NavBar } from "../components/communs/NavBar";

import g from "../styles/communs/global.module.css";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { addRoom } from "../functions/chat-rooms/functions";
import { Socket } from "socket.io-client";
import { UserContext } from "../contexts/User.context";

export default function Chat(props: any) {

    const [socket, setSocket] = useState<Socket | undefined>(Create_socket());
	const [messages, setMessage] = useState<any>([]);
	const [room, setRoom] = useState<string>('');
	const [history, setHistory] = useState<any>([]);
	const [trigger, setTrigger] = React.useState(0);

    const [searchParams, setSearchParams] = useSearchParams();

    const {me}: any = useContext(UserContext)
    const {handleError}: any = useContext(UserContext)

    const navigate = useNavigate();

	useEffect(() => {

        const createRoom = async () => {
            if ( searchParams.get("__create_room__") != null && searchParams.get("__create_room__") != "") {
                const invite_to = parseInt(searchParams.get("__create_room__") as string);
                const room_name = me.login + "-id" + Math.floor(Math.random() * 1000);
                APP.post("/chat/create_room", {name: room_name, invite_id: invite_to})
                .then((res) => {
                    searchParams.delete("__create_room__");
                    navigate("/messages");

                }).catch((err) => {
                    handleError("Error while creating room");
                });
            }
        }

        createRoom();
	}, []);

	useEffect(() => {
		socket?.on('connected', () => {
			socket?.emit('addsocket', me);
        });
        return (() => {
            socket?.disconnect();
        })
	}, [me]);
	
	const send = (value: string) => {
		socket?.emit("message", {room: room, message: value, current_user: me});
	}

	const define_room = async (room: string) => {
        await socket?.emit("joinRoom", { room_name: room, id_user: me.id} );
		setRoom(room);
	}

	const message_listener = (infomessage: any) => {
		if (messages == undefined || messages == null)
			setMessage(infomessage);
		setMessage([...messages, infomessage]);
	}

	const history_listener = (history: HistoryDto) => {
		setHistory(history);
	}

	socket?.on("message", message_listener);

	return (
        <div

    >
        <div
            className="
            flex
            flex-col
            md:flex-row
            w-full
            h-full
            -z-10
            "
        >
            <NavBar/>
            <div className="w-full">
                <div className={Style["global"]}>
                    <div className={StyleRoom["room-menu"]}>
                        <RoomForm
                            define_room={define_room}
                            current_room={room}
                            current_user={me}
                            socket={socket}
                            handle_history={history_listener}
                            trigger={trigger}
                            setTrigger={setTrigger}
                            setMessage={setMessage}
                            setRoom={setRoom}
                        />
                    </div>
                    <div className={Style["message-box"]}>
                        <DisplayMessagesByRoom current_user={me} socket={socket} history={history} infomessage={messages} room={room} handle_history={history_listener}/>
                        <MessageInput send={send}/>
                    </div>
                    <div className={Style["menu-chat"]}>
                        <ParameterChat define_room={define_room} current_room={room} current_user={me} socket={socket}/>
                    </div>
                </div>
            </div>
        </div>
    </div>



        
	);
}