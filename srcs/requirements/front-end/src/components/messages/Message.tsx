import React, { useContext, useEffect, useRef, useState } from "react";
import { HistoryDto } from "../../dtos/chat.dto";
import { APP } from "../../network/app";
import Style from "../../styles/messages/Style.message.module.css";
import dayjs from "dayjs";
import 'dayjs/locale/fr';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ProfilePopUpContext } from "../../contexts/ProfilePopUp.context";

dayjs.locale('fr'); // set locale to French

export default function Messages(props: any) {

	let {messages, room } = props;

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
				if (room_name !== undefined && room_name !== null && room_name !== "")
				{
					const res = await APP.post("/chat/get_messages_by_room", {room_name: room_name});
					await handle_history(res.data);
				}
			} catch (error) {
				console.error(error);
			}
		};
		getMessagesByRoom();
}

function IsSenderOrReceiver(props: any)
{
	let {historyItem, current_user, socket, setPopUpID} = props.props;
	let is_user_bloqued = useRef(false);
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
				const blocked = async () => {
					if (historyItem)
					{
						const res = await APP.post("/chat/is_user_blocked", {
								user_id_target: historyItem.sender_id,
						});
						is_user_bloqued.current = res.data;
						setLoading(true);
					}
				}
		blocked();
	},[]);
	if (loading == false)
		return (
			<>
			</>
		)
	if (is_user_bloqued.current == true)
		return (
			<>
			</>
		);
	else {
	if(historyItem.sender_id == current_user.id)
		return (
			<div className={Style['wrapper-message']}>
				<div className={Style["message-receiver"]}>
					{historyItem.sender_name} : {historyItem.current_message}
					<span className={Style["chat-date"]}> {dayjs(historyItem.created_at).format("DD MMM YYYY À H:mm")} </span>
				</div>
                <img src={"http://localhost:3000/api/public/picture/" + historyItem.sender_name} className={Style["img-message-right"]} onClick={() => setPopUpID(historyItem.sender_id)}/> 
			</div>
		);
	else
		return (
			<div>
				<div className={Style["wrapper-message"]}>	
                    <img src={"http://localhost:3000/api/public/picture/" + historyItem.sender_name} className={Style["img-message-right"]} onClick={() => setPopUpID(historyItem.sender_id)}/>
					<div className={Style["message-sender"]}>
						{historyItem.sender_name} : {historyItem.current_message}
						<span className={Style["chat-date"]}> {dayjs(historyItem.created_at).format("DD MMM YYYY À H:mm")} </span>
					</div>
				</div>
			</div>
	);
		}
}


/* async */ function IsSenderOrReceiver_socket(props: any)
{
	let {infomessage, current_user, setPopUpID} = props.props;

	let is_user_bloqued = useRef(false);
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
				const blocked = async () => {
					const res = await APP.post("/chat/is_user_blocked", {
							user_id_target: infomessage.current_user.id,
					});
					is_user_bloqued.current = res.data;
					setLoading(true);
				}
		blocked();
	},[]);
	if (loading == false)
		return (
			<>
			</>
		)
	if (is_user_bloqued.current == true)
		return (
			<>
			</>
		);
	else {
		if (infomessage.current_user.id == current_user.id)
			return (
				<div className={Style['wrapper-message']}>
					<div className={Style["message-receiver"]}>
							{infomessage.current_user.login} : {infomessage.message}
							<span className={Style["chat-date"]}> {dayjs(infomessage.created_at).format("DD MMM YYYY À H:mm")} </span>
					</div>
					<img src={"http://localhost:3000/api/public/picture/" + infomessage.current_user.login} className={Style["img-message-right"]} onClick={() => setPopUpID(infomessage.current_user.id)}/>
				</div>
			);
		else
			return (
				<div>
					<div className={Style["wrapper-message"]}>	
						<img src={"http://localhost:3000/api/public/picture/" + infomessage.current_user.login} className={Style["img-message-right"]} onClick={() => setPopUpID(infomessage.current_user.id)}/>
						<div className={Style["message-sender"]}>
							{infomessage.current_user.login} : {infomessage.message}
							<span className={Style["chat-date"]}> {dayjs(infomessage.created_at).format("DD MMM YYYY À H:mm")} </span>
						</div>
					</div>
				</div>
		);
	}
}

export function DisplayMessagesByRoom(props: any) {
	let { current_user, history, infomessage } = props;

	const messagesContainer = useRef<HTMLDivElement>(null);
    const {setPopUpID} = useContext<any>(ProfilePopUpContext);

	useEffect(() => {
		if (messagesContainer.current) {
		  messagesContainer.current.scrollTop = messagesContainer.current.scrollHeight;
		}
	  }, [infomessage, history]);


		return (
	  <div ref={messagesContainer} className={Style['print-message']}>
		{!history ? "" : history.map((historyItem: HistoryDto, index: number) => (
		  <div key={index}>
			<IsSenderOrReceiver props={{historyItem, current_user, setPopUpID}}/>

		  </div>
		))}
		{infomessage.map((infomessage: any, index: number) => (
			<div key={index}>
				<IsSenderOrReceiver_socket props={{infomessage, current_user, setPopUpID}}/>
				</div>
		))}
	  </div>
	);
}
