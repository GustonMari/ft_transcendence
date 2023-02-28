import React from "react";
import "./Style.message.css";

export default function MessageInput({send}: {send: (value: string) => void}) {

	const [value, setValue] = React.useState("");
	
	function sendAndClear() {
		send(value);
		setValue("");
	}

	function handleKeyDown(event: any) {
		if (event.key === "Enter") {
		  event.preventDefault();
		sendAndClear();
		}
	  }


	return (
	<div className="inputmessage">
		<input className="borderbox-msg" onChange={(e) => setValue(e.target.value)} onKeyDown={handleKeyDown}  placeholder="type your message..." value={value} />
		<button className="input-msg-button" onClick={() => sendAndClear()} /* onKeyDown={() => send(value)} */ >
		<img className='icon-send-msg' src="./send-message.png" alt="Send message" />
		</button>
	</div>
	);
}