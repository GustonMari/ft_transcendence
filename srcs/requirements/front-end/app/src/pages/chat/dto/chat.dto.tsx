
export interface HistoryDto {
	id: number;
	created_at: Date;
	updated_at: Date;
	current_message: string;
	sender_id: number;
	room_id: number;
	sender_name: string;
}