import { Button, Modal, Form } from 'react-bootstrap';
import React, { useEffect, useRef, useState } from "react";
import StyleUtils from './Style.utils.module.css';
import { Navigate, useNavigate } from "react-router-dom";
import { APP } from "../../network/app";




export function PopupWinLose(props : any) {
	const { popupwinlose, setPopupWinLose, isMaster, socket, gameName} = props;
	const [show, setShow] = useState(true);
	const navigate = useNavigate();

	// const handleClose = async () => {
	// 	setShow(false)
	// 	setPopupWinLose({winlose: false, winlosemessage: ""});
	// 	await APP.post("/pong/delete_game", {
	// 		game_name: gameName
	// 	});
	// 	navigate("/homepong");
	// };

	const handleClose = () => {
		setShow(false)
		setPopupWinLose({winlose: false, winlosemessage: ""});
		navigate("/homepong");
	};

	function RestartGame()
	{
		socket?.emit('playGame', gameName);
		setShow(false)
		setPopupWinLose({winlose: false, winlosemessage: ""});
	}

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