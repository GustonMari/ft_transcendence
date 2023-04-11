import LoginForm from "../components/forms/LoginForm";
import s from "../styles/pages/signin.module.css";

export default function SignIn () {
    return (
        <div>
            <section className={s.section}>
                <LoginForm/>
            </section>
        </div>
    );
}