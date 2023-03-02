import { useContext, useRef, useState } from "react";
import {
    MdOutlineRemoveCircleOutline,
    MdOutlineCheckCircleOutline
} from "react-icons/md";
import API from "../../network/api";
import { ProfilePopUpContext } from "../../contexts/ProfilePopUp.context";

export const RequestList = ({relations}: any) => {

    const [rel, setRel] = useState<any[]>(relations);

    const {setUser, setShow} : any = useContext(ProfilePopUpContext);

    console.log(rel);
    console.log(relations);

    return (
        <>
            <div className="w-full h-full p-4 text-sm">
                <div className="m-6 overflow-x-auto rounded-md border border-gray-200 shadow-md">
                    <table className="w-full bg-white text-left border-collapse table-fixed">
                        <thead className="bg-gray-50">
                            <tr className="">
                                <th className="px-6 py-3 font-bold text-sm">Username</th>
                                <th className="px-6 py-3 font-bold text-sm w-28 "></th>
                            </tr>
                        </thead>
                        <tbody className="w-full">
                            {rel.map((relation: any) => {
                                const user = relation.user
                                return (
                                    <tr className="w-full hover:bg-gray-50 h-14 p-2 relative" key={relation.id}>
                                        <td className="flex flex-row px-6 py-3 text-sm items-center">
                                            <img className="h-8 w-8 rounded-full mr-4" src="https://placehold.co/150x150"></img>
                                            <div className="flex flex-col">
                                                <p>{user.login}</p>
                                                <p className="text-xs font-normal capitalize text-gray-500">{(!user.first_name ? "" : user.first_name) + " " + (!user.last_name ? "" : user.last_name)}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3 flex flex-row absolute right-0 top-0 gap-2">
                                            <a className="hover:bg-green-500 rounded-full text-gray-600 hover:text-white"
                                                onClick={
                                                    (e) => {
                                                        e.preventDefault();
                                                        API.acceptRequest(relation.id, () => {
                                                            const id = relation.id;
                                                            setRel(rel.filter((r: any) => r.id !== id));
                                                        }, (err: any) => {
                                                            console.log(err);
                                                        });
                                                    }
                                                }>
                                                <MdOutlineCheckCircleOutline className="w-6 h-6"/>
                                            </a>
                                            <a className="hover:bg-red-500 rounded-full text-gray-600 hover:text-white"
                                                onClick={
                                                        (e) => {
                                                            // e.preventDefault();
                                                            API.removeRequest(relation.id, () => {
                                                                const id = relation.id;
                                                                setRel(rel.filter((r: any) => r.id !== id));
                                                            }, (err: any) => {
                                                                console.log(err);
                                                            });
                                                            
                                                        }
                                                    }>
                                                <MdOutlineRemoveCircleOutline className="w-6 h-6"/>
                                            </a>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}
