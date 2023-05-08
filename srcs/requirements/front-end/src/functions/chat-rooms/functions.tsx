import { Socket } from "socket.io-client";
import { APP } from "../../network/app";

import { GetMessagesByRoom } from '../../components/messages/Message';
import 'bootstrap/dist/css/bootstrap.min.css';
import StyleProgres from '../../styles/profile/Style.progressBar.module.css';
import Style from "../../styles/messages/Style.message.module.css";

/*
	InputRoom functions
*/

export async function checkIsPassword(value: string) {
    if (value === "") return ;
	const res = await APP.post("/chat/is_room_has_password", {room_name: value})
	return res.data;
}

export async function checkPassword(value: string, password: string) {
    if (value === "") return ;
	const res = await APP.post("/chat/verify_room_password", {room_name: value, password: password});
	return res.data;
}

export async function addRoom(setMessage: any, define_room: any, socket: Socket, current_user: any, value: string, setValue: any, handle_history: any, render_react: any) {
	
	setMessage([]);
	define_room(value);
	socket?.emit("message", {room: value, message: `${current_user.login} has join the room ${value}`});
	await GetMessagesByRoom(handle_history, value);
	socket?.on('renderReact', render_react);
	// setValue("");
}


export function shakeIt(shake_name: string, room_name: string) {
	const modal = document.getElementById(`shaking-${room_name}`);
	if (modal) {
		modal.classList.add(Style.shake);
		setTimeout(() => {
			modal.classList.remove(Style.shake);
		}, 500);
	}
}

export async function AuthorizeUser(props : any) : Promise<void>
{
	let { ban, setMessage, GetMessagesByRoom, define_room, room, handle_history} = props;
	if (ban === false) {
		setMessage([]);
		GetMessagesByRoom(handle_history, room.name);
		define_room(room.name);
	}
}

export function ShortedName(name : string) : string
{
	if (name.length > 17)
		return (name.slice(0, 17) + "...");
	return (name);
}

export function ProgressBar(props: any)
{
	let {progress} = props;

	document.documentElement.style.setProperty('--progress-percentage', `${progress}%`);
	
	
	return (
		<div className={StyleProgres['container-progress-bar']}>
			<div className={StyleProgres["filler-progress-bar"]}>
				<span /* className="progress" */>{`${progress}%`}</span>
			</div>
		</div>
	);
}