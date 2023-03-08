import { useContext } from "react";
import { ProfilePopUpContext } from "../../contexts/ProfilePopUp.context";
import { NavBar } from "./NavBar";
import { ProfileComponent } from "../users/ProfileComponent";

import s from "../../styles/communs/GlobalFeatures.module.css";

export const GlobalFeatures = ({children}: any) => {

    const {show} : any = useContext(ProfilePopUpContext);

    return (
        <>
            <NavBar/>
            {children}
        </>
    );
}