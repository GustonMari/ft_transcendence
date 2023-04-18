
export interface HistoryDto {
	id: number;
	created_at: Date;
	updated_at: Date;
	current_message: string;
	sender_id: number;
	room_id: number;
	sender_name: string;
	sender: User;
}

export interface InfoMessage {
	room: string;
	message: string;
	current_user: User;
}

export interface User {
	id: number
	created_at: Date
	updated_at: Date
	login: string
	first_name: string | null
	last_name: string | null
	avatar_url: string | null
	email: string
	state: boolean
	password: string
	rt: string | null
}