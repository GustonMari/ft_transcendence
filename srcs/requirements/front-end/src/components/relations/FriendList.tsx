import { MdOutlineRemoveCircleOutline } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { useContext } from "react";
import { ProfilePopUpContext } from "../../contexts/ProfilePopUp.context";

export const FriendList = ({relations}: any) => {

    const {setUser, setShow}: any = useContext(ProfilePopUpContext);

    return (
        <>
            <div className="w-full h-ful p-4 text-sm">
                <div className="m-6 overflow-x-auto rounded-md border border-gray-200 shadow-md">
                    <table className="w-full bg-white text-left border-collapse table-fixed">
                        <thead className="bg-gray-50">
                            <tr className="">
                                <th className="px-6 py-3 font-bold text-sm w-80">Username</th>
                                <th className="px-6 py-3 font-bold text-sm w-28">State</th>
                                <th className="px-6 py-3 font-bold text-sm w-36 sm:w-auto">Description</th>
                                <th className="px-6 py-3 font-bold text-sm w-20"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {relations.map((relation: any) => {
                                const user = relation.user;
                                return (
                                    <tr className="hover:bg-gray-50 h-14 relative p-2" key={relation.id}>

                                        <td className="flex flex-row px-6 py-3 text-sm items-center">
                                            <img className="h-8 w-8 rounded-full mr-4" src="https://placehold.co/150x150"></img>
                                            <div className="flex flex-col">
                                                <p>{user.login}</p>
                                                <p className="text-xs font-normal capitalize text-gray-500">{(!user.first_name ? "" : user.first_name) + " " + (!user.last_name ? "" : user.last_name)}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3">
                                            {
                                            user.state ?
                                            <div className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs">
                                                <span className="h-1.5 w-1.5 bg-green-600 rounded-full"></span>
                                                <span className="font-semibold text-green-600">Online</span>
                                            </div>
                                            :
                                            <div className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-xs">
                                                <span className="h-1.5 w-1.5 bg-red-600 rounded-full"></span>
                                                <span className="font-semibold text-red-600">Offline</span>
                                            </div>
                                            }
                                        </td>
                                        <td className="px-6 py-3 text-gray-600 whitespace-nowrap overflow-hidden w-32"
                                        >
                                            {user.description}
                                        </td>
                                        <td className="px-6 py-3 flex flex-row justify-center gap-2">
                                            <a className="hover:bg-yellow-500 rounded-full text-gray-600 hover:text-white"
                                                onClick={
                                                    (e) => {
                                                        e.preventDefault();
                                                        setShow(true);
                                                        setUser(user);
                                                    }
                                                }>
                                                <CgProfile className="w-6 h-6"/>
                                            </a>
                                            <a className="hover:bg-red-500 rounded-full text-gray-600 hover:text-white">
                                                { /* TODO: Remove friend from list */ }
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
