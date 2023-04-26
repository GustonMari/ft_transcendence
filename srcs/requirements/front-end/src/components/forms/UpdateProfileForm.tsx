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
                    onChange={() => {}}
                    readonly={true}
                    value={me.login}
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
                    value={me.description}
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

// import React, {
//     useState,
//     useContext,
//     ChangeEvent
// } from 'react';
// import { AlertContext } from "../../contexts/Alert.context";
// import {UserContext} from "../../contexts/User.context";
// import API from "../../network/api";
// import Switch from '@mui/material/Switch';

// import s from '../../styles/forms/UpdateProfileForm.module.css';
// import {FormControlLabel} from "@mui/material";
// import { NavBar } from '../communs/NavBar';

// function UpdateProfileForm(props: any) {
//     const { me }: any = useContext(UserContext)

//     const [firstName, setFirstName] = useState(me.first_name);
//     const [lastName, setLastName] = useState(me.last_name);
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [confirmPassword, setConfirmPassword] = useState('');
//     const [description, setDescription] = useState(me.description);
//     const [tfa, setTfa] = useState(me.tfa);

//     const { handleError, handleSuccess }: any = useContext(AlertContext);

//     const handleSubmit = (event: any) => {
//         event.preventDefault();
//         if (password !== confirmPassword) {
//             handleError("Password doesn't match with confirm password.")
//             return;
//         }

//         API.updateProfile({
//             firstName: firstName,
//             lastName: lastName,
//             password: password,
//             description: description,
//             tfa: tfa,
//         }, () => {
//             handleSuccess("Profile updated successfully.");
//             window.location.reload();
//         }, () => {
//             handleError("Error while updating the profile");
//         });
// }



//     return (
//         <>
//                 {/* <NavBar/> */}
//             <form className={s.form} onSubmit={handleSubmit}>
//                 <img className={s.profile_picture} src={"http://localhost:3000/api/public/picture/" + me.login}></img>
//                 <input
//                         type="file"
//                         name="file-input"
//                         id="file-input"
//                         className={s.input__button}
//                         onChange={handleProfilePictureChange}
//                 />
//                 {/*<span className={s.input__overlay}>Upload file</span>*/}
//                 <label className={s.labels}>
//                     First Name:
//                     <input className={s.inputs} type="text" value={firstName ? firstName : ""} onChange={(event) => setFirstName(event.target.value)} maxLength={30}/>
//                 </label>
//                 <br />
//                 <label className={s.labels}>
//                     Last Name:
//                     <input className={s.inputs} type="text" value={lastName    ? lastName : ""} onChange={(event) => setLastName(event.target.value)} maxLength={30}/>
//                 </label>
//                 <br />
//                 <label className={s.labels}>
//                     New Password:
//                     <input className={s.inputs} type="password" onChange={(event) => setPassword(event.target.value)} minLength={8} maxLength={50}/>
//                 </label>
//                 <br />
//                 <label className={s.labels}>
//                     Confirm Password:
//                     <input className={s.inputs} type="password" onChange={(event) => setConfirmPassword(event.target.value)} minLength={8} maxLength={50}/>
//                 </label>
//                 <br />
//                 <label className={s.labels}>
//                     Description:
//                         <textarea
//                                 className={[s.description, s.inputs].join(' ')}
//                                 onChange={(event) => setDescription(event.target.value)}
//                                 maxLength={200}
//                                 value={description    ? description : ""}
//                         />
//                 </label>
//                 <br />
//                 {/*<Switch checked={me.tfa}></Switch>*/}
//                 <FormControlLabel
//                         control={
//                             <Switch checked={tfa} onChange={(event) => setTfa(!tfa)} name="tfa" />
//                         }
//                         label="Two Factor Authentication"
//                 />
//                 <button className={s.button} type="submit">Update User</button>
//             </form>
//         </>
//     );
// }

// export default UpdateProfileForm;
