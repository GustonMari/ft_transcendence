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
                    {props.title}
                </DialogTitle>
                <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {props.content}
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button
                    onClick={props.onClose}
                >
                    No
                </Button>
                <Button
                    onClick={(e) => {
                        e.preventDefault();
                        props.onClose();
                        props.onConfirm();
                    }} autoFocus
                    variant="contained"
                >
                    Yes
                </Button>
                </DialogActions>
            </Dialog>
            </>
    )
}