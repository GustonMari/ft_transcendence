import React, {
  useState,
  useContext,
  ChangeEvent
} from 'react';
import { AlertContext } from "../../contexts/Alert.context";
import {UserContext} from "../../contexts/User.context";
import API from "../../network/api";

function UpdateProfileForm(props: any) {
  const { me }: any = useContext(UserContext)

  const [firstName, setFirstName] = useState(me.first_name);
  const [lastName, setLastName] = useState(me.last_name);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [description, setDescription] = useState(me.description);
  const [profilePicture, setProfilePicture] = useState('');

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
    }, () => {
      handleSuccess("Profile updated successfully.");
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
      }, (e: any) => {
        handleError(e.message)
      }); 

  }
  

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label>
          First Name:
          <input type="text" value={me?.first_name} onChange={(event) => setFirstName(event.target.value)}/>
        </label>
        <br />
        <label>
          Last Name:
          <input type="text" value={me?.last_name} onChange={(event) => setLastName(event.target.value)}/>
        </label>
        <br />
        <label>
          New Password:
          <input type="password" onChange={(event) => setPassword(event.target.value)} minLength={8}/>
        </label>
        <br />
        <label>
          Confirm Password:
          <input type="password" onChange={(event) => setConfirmPassword(event.target.value)} minLength={8}/>
        </label>
        <br />
        <label>
          Description:
          <textarea value={me?.description} onChange={(event) => setDescription(event.target.value)} />
        </label>
        <br />
        <label>
          Profile Picture:
          <input type="file" onChange={handleProfilePictureChange} />
        </label>
        <br />
        <button type="submit">Update User</button>
      </form>
    </>
  );
}

export default UpdateProfileForm; 