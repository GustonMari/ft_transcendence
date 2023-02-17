import React from "react";
import "./Style.message.css";

export default function MessageInput({send}: {send: (value: string) => void}) {

	const [value, setValue] = React.useState("");

	return (
	<div className="inputmessage">
		<input className="borderbox-msg" onChange={(e) => setValue(e.target.value)} placeholder="type your message..." value={value} />
		<button className="input-msg-button" onClick={() => send(value)}>
		<img className='icon-send-msg' src="./send-message.png" alt="Send message" />
		</button>
	</div>
	);
}