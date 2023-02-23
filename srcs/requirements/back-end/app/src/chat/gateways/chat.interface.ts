/* eslint-disable prettier/prettier */

import { User } from "@prisma/client";


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


/*
Sert pour qu'un admin puisse ban un user
*/
export interface InfoBanTo {
	room_name: string;
	id_user_from: number;
	login_user_to: string;
	ban_till: number;
}
/*
Sert pour qu'un admin puisse mute un user
*/
export interface InfoMuteTo {
	room_name: string;
	id_user_from: number;
	login_user_to: string;
	mute_till: number;
}

export interface InfoMessage {
	room: string;
	message: string;
	current_user: User;
}

export interface InfoInvite {
	current_user: User; 
	invited: string;
}