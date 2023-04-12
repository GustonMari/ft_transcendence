import React, {
  useState,
  useContext,
  ChangeEvent
} from 'react';
import { AlertContext } from "../../contexts/Alert.context";
import {UserContext} from "../../contexts/User.context";
import API from "../../network/api";
import Switch from '@mui/material/Switch';

import s from '../../styles/forms/UpdateProfileForm.module.css';
import {FormControlLabel} from "@mui/material";

function UpdateProfileForm(props: any) {
  const { me }: any = useContext(UserContext)

  const [firstName, setFirstName] = useState(me.first_name);
  const [lastName, setLastName] = useState(me.last_name);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [description, setDescription] = useState(me.description);
  const [tfa, setTfa] = useState(me.tfa);

  const { handleError, handleSuccess }: any = useContext(AlertContext);

  const handleSubmit = (event: any) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      handleError("Password doesn't match with confirm password.")
      return;
    }

    API.updateProfile({
      firstName: firstName,
      lastName: lastName,
      password: password,
      description: description,
      tfa: tfa,
    }, () => {
      handleSuccess("Profile updated successfully.");
      window.location.reload();
    }, () => {
      handleError("Error while updating the profile");
    });
}

  const handleProfilePictureChange = (event: ChangeEvent<HTMLInputElement>) => {
      if (!event.target.files) {
        return;
      }
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append('file', file, file.name);
      API.changePP(formData, () => {
        handleSuccess("Profile Picture uploaded")
        window.location.reload();
      }, (e: any) => {
        handleError(e.message)
      }); 

  }
  

  return (
    <>
      <form className={s.form} onSubmit={handleSubmit}>
        {/*<input type="file" onChange={handleProfilePictureChange} />*/}
        <img className={s.profile_picture} src={"http://localhost:3000/api/public/picture/" + me.login}></img>
        {/*<input  className={s.button} type="file" onChange={handleProfilePictureChange}/>*/}
        <input
            type="file"
            name="file-input"
            id="file-input"
            className={s.input__button}
            onChange={handleProfilePictureChange}
        />
        {/*<span className={s.input__overlay}>Upload file</span>*/}
        <label className={s.labels}>
          First Name:
          <input className={s.inputs} type="text" value={me?.first_name} onChange={(event) => setFirstName(event.target.value)}/>
        </label>
        <br />
        <label className={s.labels}>
          Last Name:
          <input className={s.inputs} type="text" value={me?.last_name} onChange={(event) => setLastName(event.target.value)}/>
        </label>
        <br />
        <label className={s.labels}>
          New Password:
          <input className={s.inputs} type="password" onChange={(event) => setPassword(event.target.value)} minLength={8}/>
        </label>
        <br />
        <label className={s.labels}>
          Confirm Password:
          <input className={s.inputs} type="password" onChange={(event) => setConfirmPassword(event.target.value)} minLength={8}/>
        </label>
        <br />
        <label className={s.labels}>
          Description:
          <textarea className={[s.description, s.inputs].join(' ')} onChange={(event) => setDescription(event.target.value)}>
            {me?.description}
          </textarea>
        </label>
        <br />
        {/*<Switch checked={me.tfa}></Switch>*/}
        <FormControlLabel
            control={
              <Switch checked={tfa} onChange={(event) => setTfa(!tfa)} name="tfa" />
            }
            label="Two Factor Authentication"
        />
        <button className={s.button} type="submit">Update User</button>
      </form>
    </>
  );
}

export default UpdateProfileForm; 