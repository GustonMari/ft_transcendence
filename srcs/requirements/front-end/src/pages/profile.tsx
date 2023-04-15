import React from 'react';
import UpdateProfileForm from '../components/forms/UpdateProfileForm';
import { NavBar } from '../components/communs/NavBar';

function Profile() {
  return (
    <div>
        <NavBar/>
        <UpdateProfileForm/>
    </div>
  );
}

export default Profile;