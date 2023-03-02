import { APP } from "../../network/app";
import '../../styles/messages/Style.message.css';
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
			  className="line-room-button"
			  id={id}
			  onClick={() => {}}
			>
			  <RiDeleteBinLine title="Delete the room"/>
			</button>
		  )}
		>
		  <div>
			<button className='line-room-button-popup'
			  onClick={() => {
				const is_owner = async () => {
					const res = await APP.post("/chat/get_isowner_login", {room_name: room.name, login: current_user.login});
					let owner = res.data;
					owner ? deleteRoom() : shakeIt("shake-button", `${room.name}-delete`) ;
				}
				is_owner();
			}}
			>
                <SlCheck title="Accept"/>
			</button>
			<button className='line-room-button-popup' onClick={closeTooltip}>
                <SlBan title="Refuse"/>
			</button>
		  </div>
		</Popup>
	  </div>
	);
}