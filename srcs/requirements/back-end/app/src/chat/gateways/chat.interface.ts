

export interface InfoRoom {
	room_name: string;
	id_user: number;
}

/*
Sert pour pouvoir add some stuff au user_to en fonction du user_from
dans la room --> room_name
*/
export interface InfoRoomTo {
	room_name: string;
	id_user_from: number;
	login_user_to: string;
}

export interface InfoMessage {
	room: string;
	message: string;
}