import { Button, Modal } from 'react-bootstrap';
import { useState } from "react";
import StyleUtils from './Style.utils.module.css';
import { APP } from "../../network/app";
// import { useNavigate } from 'react-router-dom';

export function PopupWinLose(props : any) {
	const { popupwinlose, setPopupWinLose, socket, gameName} = props;
	const [show, setShow] = useState(true);
	// const navigate = useNavigate();

	const handleClose = async () => {
		setShow(false)
		setPopupWinLose({winlose: false, winlosemessage: ""});
		console.log("Master, go delete game bitch");
		await APP.post("/pong/delete_game", {gameName: gameName});
		console.log("in handleclose");
		socket?.emit("navigate_to_game", gameName);
	};

	async function RestartGame()
	{
		socket.emit("joinWaitingReplay", gameName);
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