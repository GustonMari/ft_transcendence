import { APP } from "../../network/app";
import StyleRoom from "../../styles/rooms/Style.room.module.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import { Modal } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { shakeIt } from '../../functions/chat-rooms/functions';
import { addRoom, checkIsPassword, checkPassword } from '../../functions/chat-rooms/functions';
import { useRef, useState } from "react";
import Popup from "reactjs-popup";
import { SlBan, SlBasketLoaded, SlCheck } from 'react-icons/sl';
import { RiDeleteBinLine } from 'react-icons/ri';

export function PopupDelete(props: any) {
	let { setMessage, socket, room, current_user, render_react, GetMessagesByRoom, handle_history} = props;
	const ref = useRef<any>();
	const closeTooltip = () => ref.current.close();
	const id = `shaking-${room.name}-delete`;

	function deleteRoom() {
		setMessage([]);
		socket?.emit("deleteRoom", {
		  room_name: room.name,
		  id_user: current_user.id,
		});
		socket?.on("renderReact", render_react);
		GetMessagesByRoom(handle_history, "");
	}

	socket?.on('renderReactDeletedRoom', () => {
		GetMessagesByRoom(handle_history, "");
	});

	return (
	  <div>
		<Popup
		  ref={ref}
		  trigger={(open) => (
			<button
			  type="submit"
			  className={StyleRoom["line-room-button"]}
			  id={id}
			  onClick={() => {}}
			>
			  <img className={StyleRoom["icon-room"]} src="./delete-room.png" alt="delete room" />
			</button>
		  )}
		>
		  <div>
			<button className={StyleRoom['line-room-button-popup']}
			  onClick={() => {
				const is_owner = async () => {
					const res = await APP.post("/chat/get_isowner_login", {room_name: room.name, login: current_user.login});
					let owner = res.data;
					owner ? deleteRoom() : shakeIt("shake-button", `${room.name}-delete`) ;
				}
				is_owner();
			}}
			>
				<img className={StyleRoom["icon-room-popup"]} src="./accept.png" alt="leave room" />
			</button>
			<button className={StyleRoom['line-room-button-popup']} onClick={closeTooltip}>
				<img className={StyleRoom["icon-room-popup"]} src="./cancel.png" alt="leave room" />
			</button>
		  </div>
		</Popup>
	  </div>
	);
}