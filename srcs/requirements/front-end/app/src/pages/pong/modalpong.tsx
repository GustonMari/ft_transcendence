import { Button, Modal, Form } from 'react-bootstrap';
import React, { useEffect, useRef, useState } from "react";
import StyleUtils from '../chat/Style.utils.module.css';
// import StyleUtils from './Style.utils.module.css';


export function PopupWinLose(props : any) {
	const { popupwinlose, setPopupWinLose, isMaster, socket} = props;
	const [show, setShow] = useState(true);
	// const [triggerPong, setTriggerPong] = React.useState(false);
	const handleClose = () => {
		setShow(false)
		setPopupWinLose({winlose: false, winlosemessage: ""});
		// setPopup_pong(null);
	};

	function RestartGame()
	{
		socket?.emit('playGame', "");
		setShow(false)
		setPopupWinLose({winlose: false, winlosemessage: ""});
		// setTriggerPong(true);
	}

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
				<Modal.Title>Game Finished</Modal.Title>
			  </Modal.Header>
			  <Modal.Body className="text-center">
				<h1>
					{ popupwinlose.winlosemessage  + "\n Do you want to play again ?"}
				</h1>
				<div>
					<Button className={StyleUtils["between-button"]} variant="primary" onClick={RestartGame}>
									Accept
					</Button>
					<Button className={StyleUtils["between-button"]} variant="primary" onClick={handleClose}>
									Refuse
					</Button>
				</div>
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