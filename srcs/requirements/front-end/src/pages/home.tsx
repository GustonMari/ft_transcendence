import { NavBar } from '../components/NavBar';
import styles from './../styles/home.module.css';
import { ProfileComponent } from '../components/ProfileComponent';

export default function Home () {
    return (
        <div className={styles.home}>
            <NavBar img="../../static/logo192.png"/>
            <ProfileComponent/>
        </div>
    );
}