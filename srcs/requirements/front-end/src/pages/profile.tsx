import { useState } from "react";
import API from "../network/api";

export const Profile = ({user}: any) => {

    return (
        <>
            <main>

                <section className="bg-black w-full h-96">

                    <img src=""></img>
                    <h1>{user.login}</h1>
                    <form onSubmit={
                        (e: any) => {
                            e.preventDefault();
                            API.updateProfile({
                                firstName: e.currentTarget.elements.fn.value,
                                lastName: e.currentTarget.elements.ln.value,
                                description: e.currentTarget.elements.des.value,
                            }, () => {
                                console.log("success");
                            }, (err: any) => {
                                console.log("error", err);
                            });
                        } 
                    }>
                        <input type="text" id="fn" placeholder={(!user.first_name ? "first name" : user.first_name)} ></input>
                        <input type="text" id="ln" placeholder={(!user.last_name ? "last name" : user.last_name)}></input>
                        <input type="text" id="des" placeholder={(!user.description ? "description" : user.description)}></input>
                        <input id="file" type="file"></input>
                        <button type="submit">Save</button>
                    </form>


                </section>

            </main>
        </>
    )
} 