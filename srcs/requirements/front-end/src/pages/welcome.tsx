import s from '../styles/pages/welcome.module.css';
import {AiFillGithub} from "react-icons/ai";

export function Welcome() {

    const presentationText : string = "Vivamus elementum nibh odio, et eleifend velit pretium a. Nunc non quam velit. Curabitur vitae commodo nisl, vel mattis massa.\n"
    const githublink : string = "https://github.com/mathias-mrsn/ft_transcendence";

    return (
        <>
            <section className={s.section}>
                <div className={s.content}>
                    <h1 className={s.content__title}>ft_transcendence</h1>
                    <p className={s.content__info}>
                        {presentationText}
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
                        window.location.href = githublink;
                    }}></AiFillGithub>
                </div>
            </section>

        </>
    );
}


// <div className={s.container}>
//     <div className={s.title}>
//         <h1>ft_transcendence</h1>
//     </div>
//     <div className={s.buttons}>
//     </div>
// </div>
