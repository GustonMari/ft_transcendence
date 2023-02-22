import React, { useState, useEffect, useRef } from 'react';
import Popup from 'reactjs-popup';
import io, { Socket } from "socket.io-client";
import Create_socket from './socket';
import { APP } from "../../api/app";
import './Style.message.css';
import { GetMessagesByRoom } from './Message';
import { setMaxIdleHTTPParsers } from 'http';
// import 'reactjs-popup/dist/index.css';


export function RoomForm(props : any)
{
	let {define_room, current_room, current_user, socket, handle_history, trigger, setTrigger, setMessage} = props;
	// const [value, setValue] = React.useState("");
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

	return (
		<div className='between-room-input'>
			<span ref={roomContainer} className='room-list'>
				{rooms.map(room => (
					<li key={room.id}>
						<span className="line-room">
							<div className='split'>
								<img className='line-room-img' src="" alt="" />
								<button className='line-room-button' onClick={() => {
									
									const is_ban = async () => {
										const res = await APP.post("/chat/get_isban_user", {room_name: room.name, id_user: current_user.id});
										let ban = res.data;
										ban ? "" : socket?.emit("changeRoom", { room_name: current_room, id_user: current_user.id});
										AuthorizeUser({ban, setMessage, GetMessagesByRoom, define_room, room, handle_history})
									}
									is_ban();
									socket?.on('renderReact', render_react);
									}}>{ ShortedName(room.name) }</button>
							</div>
							<div className='split'>
								<PopupLeave setMessage={setMessage} socket={socket} room={room} current_user={current_user} render_react={render_react}></PopupLeave>
								<PopupDelete setMessage={setMessage} socket={socket} room={room} current_user={current_user} render_react={render_react}></PopupDelete>
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
			render_react={render_react}/>
	</div>
	);
}

function InputRoom(props: any) {
	
	let {define_room, current_room, current_user, socket, handle_history, setMessage, render_react} = props;
	
	const [value, setValue] = React.useState("");

	function addRoom() {
		setMessage([]);
		define_room(value);
		socket?.emit("message", {room: value, message: `${current_user.login} has join the room ${value}`})
		socket?.on('renderReact', render_react);
		setValue("");
	}

	function handleKeyDown(event: any) {
		console.log(event.key);
		if (event.key === "Enter") {
			event.preventDefault();
			addRoom();
		}
	  }

	return (
	<div className='input-room'>
		<input className='borderbox-room' onChange={(e) => setValue(e.target.value)} onKeyDown={handleKeyDown} placeholder="define your room..." value={value} />
		<button className='input-room-button'  onClick={() => addRoom()}>
			<img className='icon-enter-room' src="./enter-room.png" alt="create room" />
		</button>
	</div>
	);
}

export function PopupLeave(props: any) {
	let { setMessage, socket, room, current_user, render_react } = props;
	const ref = useRef<any>();
	const closeTooltip = () => ref.current.close();
  
	return (
	  <div>
		<Popup
		  ref={ref}
		  position='bottom center'
		//   arrow={false}
		  className='popup-content'
		  trigger={(open) => (
			  <button
			  type="submit"
			  className="line-room-button"
			  onClick={() => {}}
			  >
			  <img className="icon-room" src="./leave-room.png" alt="leave room" />
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
			  }}
			>
				<img className="icon-room-popup" src="./accept.png" alt="leave room" />
			</button>
			<button className='line-room-button-popup' onClick={closeTooltip}>
				<img className="icon-room-popup" src="./cancel.png" alt="leave room" />
			</button>
		  </div>
		</Popup>
	  </div>
	);
}



export function PopupDelete(props: any) {
	let { setMessage, socket, room, current_user, render_react } = props;
	const ref = useRef<any>();
	const closeTooltip = () => ref.current.close();
  
	return (
	  <div>
		<Popup
		  ref={ref}
		  trigger={(open) => (
			<button
			  type="submit"
			  className="line-room-button"
			  onClick={() => {}}
			>
			  <img className="icon-room" src="./delete-room.png" alt="delete room" />
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
			  }}
			>
				<img className="icon-room-popup" src="./accept.png" alt="leave room" />
			</button>
			<button className='line-room-button-popup' onClick={closeTooltip}>
				<img className="icon-room-popup" src="./cancel.png" alt="leave room" />
			</button>
		  </div>
		</Popup>
	  </div>
	);
}

export function PopupPassword(props: any) {
	let { setMessage, socket, room, current_user, render_react } = props;
	const ref = useRef<any>();
	const closeTooltip = () => ref.current.close();
  
	return (
	<div>
		<Popup
		ref={ref}
 		   trigger={
		   	<button className="line-room-button">
				<img className="icon-room" src="./lock-room.png" alt="lock room" />
			</button>}
 		   modal
 		   nested
 		 >

      <div className="modal">
        <button className="close" onClick={close}>
          &times;
        </button>
        <div className="header"> Modal Title </div>
        <div className="content">
          {' '}
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque, a nostrum.
          Dolorem, repellat quidem ut, minima sint vel eveniet quibusdam voluptates
          delectus doloremque, explicabo tempore dicta adipisci fugit amet dignissimos?
          <br />
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequatur sit
          commodi beatae optio voluptatum sed eius cumque, delectus saepe repudiandae
          explicabo nemo nam libero ad, doloribus, voluptas rem alias. Vitae?
        </div>
        <div className="actions">
          <Popup
            trigger={<button className="button"> Trigger </button>}
            position="top center"
            nested
          >
            <span>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae
              magni omnis delectus nemo, maxime molestiae dolorem numquam
              mollitia, voluptate ea, accusamus excepturi deleniti ratione
              sapiente! Laudantium, aperiam doloribus. Odit, aut.
            </span>
          </Popup>
          <button
            className="button"
            onClick={() => {
              console.log('modal closed ');
              close();
            }}
          >
            close modal
          </button>
        </div>
      </div>

			
			  
		</Popup>

		
	</div>
	);
}



export async function AuthorizeUser(props : any) : Promise<void>
{
	let { ban, setMessage, GetMessagesByRoom, define_room, room, handle_history} = props;
	if (ban === false) {
		setMessage([]);
		GetMessagesByRoom(handle_history, room.name);
		define_room(room.name);
	}
	else {

	}
}

export function ShortedName(name : string) : string
{
	if (name.length > 10)
		return (name.slice(0, 10) + "...");
	return (name);
}

export function LeaveRoom(props : any)
{
	let { define_room, current_user, socket  } = props;
	const [value, setValue] = React.useState("");
	return (
		<div>
		<input onChange={(e) => setValue(e.target.value)} placeholder="exit your room..." value={value} />
			<button onClick={() => socket?.emit("leaveRoom", { room_name: value, id_user: current_user.id})}>Leave room</button>
		</div>
	)

}

export function DeleteRoom(props : any)
{
	let { define_room, current_user, socket  } = props;
	const [value, setValue] = React.useState("");
	return (
		<div>
		<input onChange={(e) => setValue(e.target.value)} placeholder="delete your room..." value={value} />
			<button onClick={() => socket?.emit("deleteRoom", { room_name: value, id_user: current_user.id})}>Delete room</button>
		</div>
	)
}

export function SetAdmin(props : any)
{
	let { define_room, current_room, current_user, socket  } = props;
	const [value, setValue] = React.useState("");

	function emitAndClear() {
		socket?.emit("setAdmin", { room_name: current_room, id_user_from: current_user.id, login_user_to: value});
		// send(value);
		setValue("");
	}

	function handleKeyDown(event: any) {
		console.log(event.key);
		if (event.key === "Enter") {
		  event.preventDefault();
		//   send(value);
		emitAndClear();
		}
	}

	return (
		<div className='inputparam'>
			<input className='borderbox-param' onChange={(e) => setValue(e.target.value)} onKeyDown={handleKeyDown} placeholder="set admin login..." value={value} />
				<button className='input-param-button' onClick={() => emitAndClear() }>Set admin</button>
		</div>
	)
}



export function BanUser(props : any)
{
	let { define_room, current_room, current_user, socket  } = props;
	const [value, setValue] = React.useState("");
	const [date_value, setDate] = React.useState("");

	function emitAndClear() {
		socket?.emit("banUser", { room_name: current_room, id_user_from: current_user.id, login_user_to: value, ban_till: date_value});
		setDate("");
		setValue("");
	}

	return (
		<div className='inputparam'>
			<input className='borderbox-param' onChange={(e) => setValue(e.target.value)} placeholder="ban user login..." value={value} />
			<input className='borderbox-param' onChange={(e) => setDate(e.target.value)} placeholder="duration ban in min..." value={date_value} />
				<button className='input-param-button' onClick={() => emitAndClear()}>Ban</button>
		</div>
	);
}

export function UnbanUser(props : any)
{
	let { define_room, current_user, socket  } = props;
	const [value, setValue] = React.useState("");
	const [room_value, setRoom] = React.useState("");

	return (
		<div >
		<input className='borderbox-param' onChange={(e) => setRoom(e.target.value)} placeholder="define your room..." value={room_value} />
		<input className='borderbox-param' onChange={(e) => setValue(e.target.value)} placeholder="unban user login..." value={value} />
			<button className='input-param-button' onClick={() => socket?.emit("unbanUser", { room_name: room_value, id_user_from: current_user.id, login_user_to: value})}>Unban</button>
		</div>
	)
}

export function MuteUser(props: any)
{
	let { define_room, current_room, current_user, socket  } = props;
	const [value, setValue] = React.useState("");
	const [date_value, setDate] = React.useState("");


	function emitAndClear() {
		socket?.emit("muteUser", { room_name: current_room, id_user_from: current_user.id, login_user_to: value, mute_till: date_value});
		setDate("");
		setValue("");
	}


	return (
		<div className='inputparam'>
			<input className='borderbox-param' onChange={(e) => setValue(e.target.value)} placeholder="mute user login..." value={value} />
			<input className='borderbox-param' onChange={(e) => setDate(e.target.value)} placeholder="duration mute in min..." value={date_value} />
				<button className='input-param-button' onClick={() => emitAndClear()}>Mute</button>
		</div>
	)
}

export default RoomForm;