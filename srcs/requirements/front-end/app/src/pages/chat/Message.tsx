import React from "react";

export default function Messages(props: any) {

	//! faire interface pour les props
	let {messages, room} = props;

	return (
	<div>
		<h1>Messages</h1>
		<h1>c'est le = {room}</h1>
		{messages.map((message: string[], index: number) => (
			<div key={index}>{message}</div>
		))}
	</div>
	);
}