import s from '../styles/pages/welcome.module.css';

export function Welcome() {

    return (
        <>
            <div className={s.container}>
                <div className={s.title}>
                    <h1>ft_transcendence</h1>
                </div>
                <div className={s.buttons}>
                    <button className={s.button} onClick={() => {window.location.href = "/signin"}}>Sign In</button>
                    <button className={s.button} onClick={() => {window.location.href = "/register"}}>Register</button>
                </div>
            </div>
        </>
    );
}