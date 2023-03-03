import { BackGroundForm } from "../components/forms/BackGroundForm";
import LoginForm from "../components/forms/LoginForm";
import s from "../styles/pages/signin.module.css";

export default function SignIn () {
    return (
        <div>
            <BackGroundForm>
                <LoginForm/>
            </BackGroundForm>
        </div>
    );
}