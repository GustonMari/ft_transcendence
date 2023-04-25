import { ChangeEvent, useContext } from "react";
import { AlertContext } from "../../contexts/Alert.context";
import { APP } from "../../network/app";

export const ChangePP = ({
    username
} : {
    username: string
}) => {

    const { handleError, handleSuccess }: any = useContext(AlertContext);

    const handleProfilePictureChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files) {
            return;
        }

        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('file', file, file.name);

        APP.post(
            "/user/profile/upload",
            formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(() => {
            handleSuccess("Profile Picture uploaded")
            window.location.reload(); // TODO: check to reload the component only
        }).catch((err) => {
            handleError(err.response?.data?.message || 'An error occured, please try again later.')
        });

}

    return (
    <>
        
    </>
    )
}