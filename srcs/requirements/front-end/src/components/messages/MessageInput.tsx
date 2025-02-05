import React from "react";
import Style from "../../styles/messages/Style.message.module.css";
import { TbSend } from 'react-icons/tb';

export default function MessageInput({send}: {send: (value: string) => void}) {

	const [value, setValue] = React.useState("");
	
	function sendAndClear() {
		if (value !== "")
		{
			send(value);
			setValue("");
		}
	}

	function handleKeyDown(event: any) {
		if (event.key === "Enter") {
		  event.preventDefault();
		sendAndClear();
		}
	  }


	return (
    <div className={Style["inputmessage"]}>
      <input className={Style["borderbox-msg"]} onChange={(e) => setValue(e.target.value)} onKeyDown={handleKeyDown}  placeholder="type your message..." value={value} />
      <button className={Style["input-msg-button"]} onClick={() => sendAndClear()} /* onKeyDown={() => send(value)} */ >
        {/* <img className={Style['icon-send-msg']} src="./send-message.png" alt="Send message" /> */}
        <TbSend title="Send msg"/>
      </button>
    </div>
	);
}