export const UserList = (props: any) => {

    const user: any[] = [{
        username: "mamaura",
        description: "salut je suis mamaurai",
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
        description: "slaut je suis noe",
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
                <div className="m-6 overflow-hidden rounded-md border border-gray-200 shadow-md">
                    <table className="w-full bg-white text-left border-collapse table-fixed">
                        <thead className="bg-gray-50">
                            <tr className="">
                                <th className="px-6 py-3 font-bold text-sm w-1/5">Username</th>
                                <th className="px-6 py-3 font-bold text-sm w-1/12">State</th>
                                <th className="px-6 py-3 font-bold text-sm w-3/5">Description</th>
                                <th className="px-6 py-3 font-bold text-sm"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {user.map((elem, index) => {
                                return (
                                    <tr className="hover:bg-gray-50 h-14 relative p-2" key={index}>

                                        <td className="flex flex-row px-6 py-3 text-sm relative">
                                            <img className="transform -translate-x-1/2 -translate-y-1/2 h-8 w-8 rounded-full mr-4 relative top-1/2 left-4" src="https://placehold.co/150x150"></img>
                                            <div className="flex flex-col">
                                                <p>{elem.username}</p>
                                                <p className="text-xs font-normal capitalize text-gray-500">{elem.first_name + " " + elem.last_name}</p>
                                            </div>
                                        </td>
                                        <td>{elem.state ? "Online" : "Offline"}</td>
                                        <td>{elem.description}</td>
                                        <td><button>add</button></td>
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