import { GITHUB_URL, PRESENTATION_TEXT } from '../data/const';
import s from '../styles/pages/welcome.module.css';
import {AiFillGithub} from "react-icons/ai";

export function Welcome() {

    return (
        <>
            <section className={s.section}>
                <div className={s.content}>
                    <h1 className={s.content__title}>ft_transcendence</h1>
                    <p className={s.content__info}>
                        {PRESENTATION_TEXT}
                    </p>
                    <div className={s.content__buttons}>
                        <button className={s.button} onClick={() => {
                            window.location.href = "/authentification"
                        }}>Sign In
                        </button>
                        <button className={s.button} onClick={() => {
                            window.location.href = "/authentification"
                        }}>Register
                        </button>
                    </div>
                    <AiFillGithub className={s.content__github} onClick={() => {
                        window.location.href = GITHUB_URL;
                    }}></AiFillGithub>
                </div>
            </section>

        </>
    );
}
