import React, { Children } from "react";
import { ProfilePopUpProvider } from "./ProfilePopUp.context";
import { UserProvider } from "./User.context";

export default function WrapContext ({components}: any) {

    return (
        <UserProvider>
        <ProfilePopUpProvider>
            {components}
        </ProfilePopUpProvider>
        </UserProvider>
    )
} 