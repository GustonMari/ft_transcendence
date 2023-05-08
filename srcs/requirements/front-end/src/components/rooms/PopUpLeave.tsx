import StyleRoom from "../../styles/rooms/Style.room.module.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useRef } from "react";
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
			className={StyleRoom['popup-content']}
			trigger={(open) => (
				<button
					type="submit"
					className={StyleRoom["line-room-button"]}
					onClick={() => {}}
					>
					{/* <img className={StyleRoom["icon-room"]} src="./leave-room.png" alt="leave room" /> */}
					<TbDoorExit title="Leave the room"/>
				</button>
			)}
		>
		  <div>
			<button className={StyleRoom['line-room-button-popup']}
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
				{/* <img className={StyleRoom["icon-room-popup"]} src="./accept.png" alt="leave room" /> */}
				<SlCheck title="Accept"/>
			</button>
			<button className={StyleRoom['line-room-button-popup']} onClick={closeTooltip}>
				{/* <img className={StyleRoom["icon-room-popup"]} src="./cancel.png" alt="leave room" /> */}
				<SlBan title="Refuse"/>
			</button>
		  </div>
		</Popup>
	  </div>
	);
}


