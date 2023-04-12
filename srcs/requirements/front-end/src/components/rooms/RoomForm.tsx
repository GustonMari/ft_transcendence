// @typescript-eslint/no-unused-expressions

import { useState, useEffect, useRef, Key } from 'react';
import { APP } from "../../network/app";
import StyleRoom from "../../styles/rooms/Style.room.module.css";
import { GetMessagesByRoom } from '../messages/Message';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthorizeUser, shakeIt, ShortedName } from '../../functions/chat-rooms/functions';
import { InputRoom } from './InputRoom';
import { PopupDelete } from './PopUpDelete';
import {PopupLeave} from './PopUpLeave';
import { PopupPassword } from './PopUpPassword';

export function RoomForm(props : any)
{
	let {define_room, current_room, current_user, socket, handle_history, trigger, setTrigger, setMessage, setRoom} = props;
	const [rooms, setRooms] = useState<any>([]);

	const roomContainer = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const getRooms = async () => {
			try {
				const res = await APP.get("/chat/get_user_rooms");
				setRooms(res.data);
				if (roomContainer.current) {
					roomContainer.current.scrollTop = roomContainer.current.scrollHeight;
				  }
			} catch (error) {
				console.error(error);
			}
		};
		getRooms();
	}, [trigger, define_room]);

	const render_react = () => {
		setTrigger(trigger += 1);
	}

	socket?.on('renderReact', render_react);
	
	return (
		<div className={StyleRoom['between-room-input']}>
			<span ref={roomContainer} className={StyleRoom['room-list']}>
				{rooms.map((room : any) => (
					<li key={room.id}>
						<span className={StyleRoom["line-room"]}>
							<div className={StyleRoom['split']}>
								<img className={StyleRoom['line-room-img']} src="" alt="" />
								<button className={StyleRoom['line-room-button']} onClick={() => {
									
									const is_ban = async () => {
										const res = await APP.post("/chat/get_isban_user", {room_name: room.name, id_user: current_user.id});
										let ban = res.data;
										// ban ? "" : socket?.emit("changeRoom", { room_name: current_room, id_user: current_user.id});
										if (!ban) {
											socket?.emit("changeRoom", { room_name: current_room, id_user: current_user.id});
										}
										AuthorizeUser({ban, setMessage, GetMessagesByRoom, define_room, room, handle_history})
									}
									is_ban();
									socket?.on('renderReact', render_react);
									}}>{ ShortedName(room.name) }
								</button>
							</div>
							<div className={StyleRoom['split']}>
								<PopupLeave setMessage={setMessage} socket={socket} room={room} current_user={current_user} render_react={render_react} GetMessagesByRoom={GetMessagesByRoom} handle_history={handle_history}></PopupLeave>
								<PopupDelete setMessage={setMessage} socket={socket} room={room} current_user={current_user} render_react={render_react} GetMessagesByRoom={GetMessagesByRoom} handle_history={handle_history}></PopupDelete>
								<PopupPassword setMessage={setMessage} socket={socket} room={room} current_user={current_user} render_react={render_react}></PopupPassword>
							</div>
						</span>
					</li>
				))}
			</span>
			<InputRoom define_room={define_room} 
			current_room={current_room} 
			current_user={current_user} 
			socket={socket} 
			handle_history={handle_history} 
			setMessage={setMessage}
			render_react={render_react}
			setRoom={setRoom}
			GetMessagesByRoom={GetMessagesByRoom}
			/>
	</div>
	);
}

export default RoomForm;