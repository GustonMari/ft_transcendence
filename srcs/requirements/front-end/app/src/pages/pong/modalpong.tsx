import { Button, Modal, Form } from 'react-bootstrap';
import React, { useEffect, useRef, useState } from "react";

export function PopupWinLose(props : any) {
	const { popupwinlose, setPopupWinLose, isMaster } = props;
	const [show, setShow] = useState(true);
	// const [triggerPong, setTriggerPong] = React.useState(false);
	const handleClose = () => {
		setShow(false)
		setPopupWinLose({winlose: false, winlosemessage: ""});
		// setPopup_pong(null);
	};

	// function InviteToPong()
	// {
	// 	socket?.emit('invite_pong_response', {sender_invite: sender_invite, currentUser: currentUser});
	// 	setTriggerPong(true);
	// }

	// if (triggerPong == true) {
		
	// 	return (
	// 		<Navigate to="/pong" />
	// 	);
	// }
	// else {
		return (
		  <>

			<Modal show={show} onHide={handleClose}>
			  <Modal.Header closeButton>
				<Modal.Title>Invite</Modal.Title>
			  </Modal.Header>
			  <Modal.Body className="text-center">
				<h1>
					{ popupwinlose.winlosemessage }
				</h1>
				{/* <div>
					<Button className={StyleUtils["between-button"]} variant="primary" onClick={InviteToPong}>
									Accept
					</Button>
					<Button className={StyleUtils["between-button"]} variant="primary" onClick={handleClose}>
									Refuse
					</Button>
				</div> */}
			  </Modal.Body>
			  <Modal.Footer>
				<Button variant="secondary" onClick={handleClose}>
				  Close
				</Button>
			  </Modal.Footer>
			</Modal>
		  </>
		);
	// }
}