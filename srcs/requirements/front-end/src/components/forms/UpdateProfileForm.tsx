import { useContext, useRef, useState } from "react";
import { UserContext } from "../../contexts/User.context";
import { InputForm } from "../auth/InputForm";
import { AuthButton } from "../auth/AuthButton";
import { FormControlLabel, Switch } from "@mui/material";
import { TextareForm } from "../auth/TextareaForm";
import { AlertContext } from "../../contexts/Alert.context";
import { APP } from "../../network/app";
import { ChangePP } from "../users/ChangePP";

export const UpdateProfileForm = () => {

    /* -- Context -- */
    const { me }: any = useContext(UserContext);
    const { handleError, handleSuccess }: any = useContext(AlertContext);

    /* -- Refs -- */
    const [firstName, setFirstName] = useState<string>(me.first_name);
    const [lastName, setLastName] = useState<string>(me.last_name);
    const [username, setUsername] = useState<string>(me.login);
    const password = useRef<string>("");
    const passwordConfirm = useRef<string>("");
    const [tfa, setTFA] = useState<boolean>(me.tfa);
    const [description, setDescription] = useState<string>(me.description);

    const handleSubmit = (event: any) => {
        event.preventDefault();
        if (password.current !== passwordConfirm.current) {
            handleError("Password doesn't match with confirm password.")
            return;
        }

        APP.patch(
            `/user/profile/me/update`,
            {
                firstName: firstName,
                lastName: lastName,
                password: password.current,
                description: description,
                tfa: tfa,
                username: username,
            }
        ).then(() => {
            handleSuccess("Profile updated successfully.");
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
                flex-col
                gap-4
                justify-center
                "
            >
                <ChangePP
                    username={me.login}
                />
                <div
                    className="
                    flex
                    flex-row
                    gap-4
                    "
                >
                    <InputForm
                        id="first-name-form"
                        label="First Name"
                        type="text"
                        onChange={(event) => setFirstName(event.target.value)}
                        readonly={false}
                        value={firstName}
                    />
                    <InputForm
                        id="last-name-form"
                        label="Last Name"
                        type="text"
                        onChange={(event) => setLastName(event.target.value)}
                        readonly={false}
                        value={lastName}
                    />
                </div>
                <InputForm
                    id="username-form"
                    label="Username"
                    type="text"
                    onChange={(event) => {setUsername(event.target.value)}}
                    readonly={false}
                    value={username}
                />
                <InputForm
                    id="email-form"
                    label="Email"
                    type="email"
                    onChange={() => {}}
                    readonly={true}
                    value={me.email}
                />
                <InputForm
                        id="password-form"
                        label="Password"
                        type="password"
                        onChange={(event) => password.current = event.target.value}
                        readonly={false}
                        value={undefined}
                />
                <InputForm
                        id="password-confirm-form"
                        label="Confirm Password"
                        type="password"
                        onChange={(event) => passwordConfirm.current = event.target.value}
                        readonly={false}
                        value={undefined}
                />
                <TextareForm
                    id="description-form"
                    label="Description"
                    onChange={(event) => setDescription(event.target.value)}
                    value={description}
                    readonly={false}
                />
                <FormControlLabel
                    control={
                        <Switch
                            checked={tfa}
                            onChange={(event) => setTFA((p) => !p)}
                            name="tfa"
                        />
                    }
                    label="Two Factor Authentication"
                    sx={{
                        color: "#858585",
                    }}
                />
                <AuthButton
                        title="Update"
                        onClick={(event) => handleSubmit(event)}
                />
            </div>
        </>
    );
};
