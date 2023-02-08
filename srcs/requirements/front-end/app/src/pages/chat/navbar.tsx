import React, { useState, useEffect } from 'react';
import io, { Socket } from "socket.io-client";
import Create_socket from './socket';
import { APP } from "../../api/app";

export function RoomList(props : any) {
	let {current_user} = props;

	const [rooms, setRooms] = useState<any>([]);
	
	useEffect(() => {
		const getRooms = async () => {
			try {
				const res = await APP.get("/chat/get_user_rooms");
				console.log('fetched', res.data);
				setRooms(res.data);
			} catch (error) {
				console.error(error);
			}
		};
		getRooms();
	}, []);


	return (
		<div>
			<h1>Liste de vos Rooms</h1>
			<ul>
				{rooms.map(room => (
					<li key={room.id}>
						{room.name}
					</li>
				))}
			</ul>
		</div>
	);

}


// return (
//     <div>
//       <Navbar users={users} onUserClick={handleUserClick} />
//       <MessageList messages={messages} />
//     </div>
//   );
// };

// const Navbar = ({ users, onUserClick }) => (
//   <nav>
//     {users.map(user => (
//       <div key={user.id} onClick={() => onUserClick(user.id)}>
//         {user.username}
//       </div>
//     ))}
//   </nav>
// );

export default RoomList;