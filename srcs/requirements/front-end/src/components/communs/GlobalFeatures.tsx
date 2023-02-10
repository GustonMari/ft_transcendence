import { useContext } from "react";
import { ProfilePopUpContext } from "../../contexts/ProfilePopUp.context";
import { NavBar } from "../NavBar";
import { ProfileComponent } from "../user/ProfileComponent";

export const GlobalFeatures = ({children}: any) => {

    const {show} : any = useContext(ProfilePopUpContext);

    return (
        <>
            <NavBar/>
            {children}
            <div>
                    {show && <ProfileComponent/>}
            </div>
        </>
    );
}