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
            window.location.reload();
        }).catch((err) => {
            handleError(err?.message)
        });

}

    return (
    <>
        <div
            className="
            flex
            justify-center
            w-full
            "
        >
            <img
                src={"http://localhost:3000/api/public/picture/" + username}
                className="
                w-32
                h-32
                rounded-md
                "
            />
            <input
                id="change-pp-file"
                type="file"
                name="file"
                onChange={handleProfilePictureChange}
                className="
                absolute
                w-32
                h-32
                opacity-0

                hover:cursor-pointer
                "
            />

        </div>
    </>
    )
}