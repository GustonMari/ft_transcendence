import { MdOutlineRemoveCircleOutline } from "react-icons/md";

export const FriendList = (props: any) => {

    const user: any[] = [{
        username: "mamaura",
        description: "Morbi scelerisque urna velit, ut posuere tellus consectetur egestas. Sed tristique risus eget accumsan tristique. Pellentesque neque erat, hendrerit a elit quis, ullamcorper semper metus. Curabitur dapibus velit aliquam venenatis pulvinar. Curabitur vel placerat tellus, at faucibus augue. Nulla tristique convallis nunc, eget scelerisque justo mollis eu. Ut iaculis sagittis felis non pulvinar. Sed ut commodo lorem. Vestibulum efficitur pretium diam sed accumsan. Nam vehicula aliquet cursus. Sed vel odio nec tortor ornare lobortis. Suspendisse potenti. Maecenas dui nunc, fermentum non dignissim nec, consequat eget justo.",
        first_name: "mathias",
        last_name: "mauraisin",
        state: true
    },
    {
        username: "gmary",
        description: "salut je suis gus",
        first_name: "gustave",
        last_name: "mary",
        state: false
    },
    {
        username: "ndormoy",
        description: "salut je suis noe",
        first_name: "noe",
        last_name: "dormoy",
        state: false
    },
    {
        username: "ldermign",
        description: "salut je suis liena",
        first_name: "liena",
        last_name: "dermigny",
        state: true
    }]

    return (
        <>
            <div className="w-full h-full bg-white p-4 text-sm">
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
                            {props.relations.map((relation: any) => {
                                console.log("relations", relation);
                                const user = relation.user;
                                return (
                                    <tr className="hover:bg-gray-50 h-14 relative p-2" key={relation.id}>

                                        <td className="flex flex-row px-6 py-3 text-sm items-center">
                                            <img className="h-8 w-8 rounded-full mr-4" src="https://placehold.co/150x150"></img>
                                            <div className="flex flex-col">
                                                <p>{user.login}</p>
                                                <p className="text-xs font-normal capitalize text-gray-500">{user.first_name + " " + user.last_name}</p>
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
                                            {/* {user.description} */}
                                            <p>je suis une description</p>
                                        </td>
                                        <td className="px-6 py-3 flex flex-row justify-center">
                                            <a className="hover:bg-red-500 rounded-full text-gray-600 hover:text-white">
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
