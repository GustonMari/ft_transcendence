import { BsXLg } from "react-icons/bs";

export const ProfileComponent = (props: any) => {
  return (
    <>
        <div className="container max-w-md mx-auto md:max-w-2xl bg-white w-full rounded-lg p-2 mt-32">
            <div className="relative px-6 flex flex-wrap flex-col justify-center w-full h-full">
                <div className="w-full absolute left-1/2 -top-2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl"
                    style={{height: '150px', width: '150px'}}>
                    <img className="w-full h-full rounded-xl" src="https://placehold.co/150x150"></img>
                </div>
                <a className="absolute top-2 left-3">
                    <BsXLg/>
                </a>
                <div className="w-full">
                    <div className="text-2xl font-bold text-center mt-20">
                        <h2 className="font-open">MAMAURAI</h2>
                    </div>
                    <div className="text-center text-sm font-bold text-gray-500 m-2">
                        <h3>Mathias Mauraisin</h3>
                    </div>
                    <div className="flex flex-row justify-center m-6 text-xs">
                        <div className="flex flex-col text-center mr-4">
                            <span className="text-xl font-bold">9</span>
                            <span className="text-gray-500">Wins</span>
                        </div>
                        <div className="flex flex-col text-center ml-4">
                            <span className="text-xl font-bold font">5</span>
                            <span className="text-gray-500">Loses</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="border mx-12 rounded mb-3"></div>
            <div className="p-4 text-center text-sm">
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus pulvinar, quam luctus euismod interdum, dolor metus interdum metus, vel pretium justo ipsum ut justo. Duis convallis in nibh sed elementum. Aliquam malesuada sodales pretium. Quisque sit amet laoreet risus. Cras maximus dictum turpis ut maximus. In vulputate urna justo, vitae luctus quam condimentum id. Nam sit amet ante in nisl vehicula facilisis tristique vitae neque.</p>

                {/* description */}

            </div>
            


        </div>
    </>
  );
};
