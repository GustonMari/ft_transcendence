import s from '../../styles/forms/BackGroundForm.module.css'

export function BackGroundForm ({children}: any) {
    return (
        <section>
            <div className={s.container}>
                <div className={s.draws}>
                    <div>
                        <div className={s.ball_draw}></div>
                        <div className={s.ball_draw}></div>
                    </div>
                    <div>
                        <div className={s.racket_draw}></div>
                        <div className={s.racket_draw}></div>
                    </div>
                </div>
            </div>
            {children}
        </section>
    );
}