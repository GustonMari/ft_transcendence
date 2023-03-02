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
import {TbDoorExit} from 'react-icons/tb';
import { SlBan, SlCheck } from "react-icons/sl";

export function PopupLeave(props: any) {
	let { setMessage, socket, room, current_user, render_react, GetMessagesByRoom, handle_history} = props;
	const ref = useRef<any>();
	const closeTooltip = () => ref.current.close();
  
	return (
	  <div>
		<Popup
			ref={ref}
			position='bottom center'
			className='popup-content'
			trigger={(open) => (
				<button
					type="submit"
					className="line-room-button"
					onClick={() => {}}
					>
					<TbDoorExit title="Leave the room"/>
				</button>
			)}
		>
		  <div>
			<button className='line-room-button-popup'
			  onClick={() => {
				setMessage([]);
				socket?.emit("leaveRoom", {
				  room_name: room.name,
				  id_user: current_user.id,
				});
				socket?.on("renderReact", render_react);

				GetMessagesByRoom(handle_history, "");
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


