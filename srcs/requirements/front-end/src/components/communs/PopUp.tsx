import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from "@mui/material";

interface IPopUpProps {
    show: boolean;
    title: string;
    content: string;
    onClose: () => void;
    onConfirm: (() => void) | any;
}

export const PopUp = (props: IPopUpProps) => {

    return (
        <>
            <Dialog
                open={props.show}
                onClose={props.onClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Use Google's location service?"}
                </DialogTitle>
                <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Let Google help apps determine location. This means sending anonymous
                    location data to Google, even when no apps are running.
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={props.onClose}>Disagree</Button>
                <Button onClick={(e) => {
                    e.preventDefault();
                    props.onClose();
                    props.onConfirm();
                }} autoFocus>
                    Agree
                </Button>
                </DialogActions>
            </Dialog>
            </>
    )
}