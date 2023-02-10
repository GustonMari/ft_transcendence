import React, { Children } from "react";
import { ProfilePopUpProvider } from "./ProfilePopUp.context";
import { UserProvider } from "./User.context";

export default function WrapContext ({components}: any) {

    return (
        <ProfilePopUpProvider>
        <UserProvider>
            {components}
        </UserProvider>
        </ProfilePopUpProvider>
    )
} 