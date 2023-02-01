import { NavBar } from '../components/NavBar';
import { ProfileComponent } from '../components/user/ProfileComponent';
import styles from './../styles/home.module.css';
import g from './../styles/background.module.css';

export default function Home () {
    return (
        <div className={g.bg}>
            <NavBar img="../../static/logo192.png"/>
        </div>
    );
}