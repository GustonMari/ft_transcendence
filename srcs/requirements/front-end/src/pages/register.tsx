import React from 'react';
import RegisterForm from '../components/forms/RegisterForm';
import s from '../styles/pages/register.module.css';

export default function Register () {
    return (
        <div>
            <section className={s.section}>
                <RegisterForm/>
            </section>
        </div>
    );
}