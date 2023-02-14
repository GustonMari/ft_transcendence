import React from "react";
import "./Style.message.css";

export default function MessageInput({send}: {send: (value: string) => void}) {

	const [value, setValue] = React.useState("");

	return (
	<div className="inputmessage">
		<input className="borderbox" onChange={(e) => setValue(e.target.value)} placeholder="type your message..." value={value} />
		<button onClick={() => send(value)}>Send</button>
	</div>
	);
}