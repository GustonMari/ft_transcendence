import React from 'react';
import UpdateProfileForm from '../components/forms/UpdateProfileForm';
import { NavBar } from '../components/communs/NavBar';

import g from '../styles/communs/global.module.css';

function Profile() {
  return (
    <div className={g.background}>
        <UpdateProfileForm/>
    </div>
  );
}

export default Profile;