import { NavBar } from '../components/communs/NavBar';
import { PopUpHistory } from '../components/history/PopUpHistory';

import g from '../styles/communs/global.module.css';

export default function Home () {
    return (
        <>
        <div className={g.background}>
            {/* <NavBar /> */}
            <PopUpHistory show={true} id={1} onClose={() => {}}/>
        </div>
        </>
    );
}