export const Loading = (props: any) => {

    return (
        <>
            <div className="transform -translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 flex flex-col justify-center gap-2 ">
                <div className="rounded-full h-10 w-10 border-2 border-gray-900 animate-bounce m-auto"></div>
                <p>
                    Loading...
                </p>
            </div>
        
        </>
    )
}