import React from "react";

export default function Messages({messages}: {messages: string[]}) {

	return (
	<div>
		<h1>Messages</h1>
		{messages.map((message, index) => (
			<div key={index}>{message}</div>
		))}
	</div>
	);
}