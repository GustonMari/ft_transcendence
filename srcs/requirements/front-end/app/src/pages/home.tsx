import React from 'react';
import API from '../api/api';
import LogOutButton from '../components/buttons/LogOutButton';
import './../styles/home.css';

export default function Home () {
    return (
        <div className='HOME'>
            <h1>Home</h1>
            <LogOutButton/>
        </div>
    );
}