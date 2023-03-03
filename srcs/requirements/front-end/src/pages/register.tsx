import React from 'react';
import { BackGroundForm } from '../components/forms/BackGroundForm';
import RegisterForm from '../components/forms/RegisterForm';
import styles from './../styles/pages/register.module.css';

export default function Register () {
    return (
        <div>
            <BackGroundForm>
                <RegisterForm/>
            </BackGroundForm>
        </div>
    );
}