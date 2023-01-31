import React from "react";

// export default function Messages({messages}: {messages: string[]}) {

// 	return (
// 	<div>
// 		<h1>Messages</h1>
// 		{messages.map((message, index) => (
// 			<div key={index}>{message}</div>
// 		))}
// 	</div>
// 	);
// }

export default function Messages(props: any) {

	//! faire interface pour les props
	let {messages, room} = props;
	// console.log("Enter in room: ", room);

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