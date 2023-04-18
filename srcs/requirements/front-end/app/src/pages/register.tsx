import React from 'react';
import RegisterForm from '../components/Forms/RegisterForm';
// import RegisterForm from '../components/forms/RegisterForm';
import styles from './../styles/pages/register.module.css';

export default function Register () {
    return (
        <div className={styles.REGISTER}>
            <RegisterForm/>
        </div>
    );
}