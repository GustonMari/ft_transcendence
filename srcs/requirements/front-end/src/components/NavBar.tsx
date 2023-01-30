import { useEffect, useState } from "react";
import { BiGroup, BiUser, BiMessage, BiSearch, BiLogOut } from "react-icons/bi";
import s from "../styles/Nav/NavBar.module.css";
import sa from "../styles/Nav/NavBar.hidden.module.css";
import API from "../api/api";
import { useNavigate } from "react-router-dom";


export const NavBar = (props: any) => {
    // const [isOn, setIsOn] = useState(false);
    const [styles, setStyles] = useState(sa as any);

    const navigate = useNavigate();
    
  useEffect(() => {
    const handleMouseMove = (event: any) => {
      if (event.clientX < 80) {
        setStyles(s);
      } else if (event.clientX > 240) {
        setStyles(sa);
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <>
      <div className={styles.container}>
        <nav className={styles.navbar}>
          <ul className={styles.list}>
            <li>
              <div className={styles.search_icon}>
                <BiSearch className={styles.icons} />
              </div>
              <input type="text" placeholder="Search" />
            </li>
            <li>
              <a href="/friends">
                <BiGroup className={styles.icons} />
                <span>Friends</span>
              </a>
            </li>
            <li>
              <a href="/register">
                <BiMessage className={styles.icons} />
                <span>Messages</span>
              </a>
            </li>
            <li>
              <a href="/register">
                <BiUser className={styles.icons} />
                <span>Profile</span>
              </a>
            </li>
          </ul>
        </nav>
        <div className={styles.profile_footer}>
          <div className={styles.avatar}>
            <img src={props.img} />
          </div>
          <div className={styles.profile_info}>
            <a>John Doe</a>
            <div className={styles.match_history}>
              <span>W : 5 | L : 2</span>
            </div>
          </div>
          <a
            className={styles.logout_btn}
            onClick={() => {
              API.logOut(
                () => {
                    navigate("/signin");
                },
                () => {
                    navigate("/signin");
                }
              );
            }}
          >
            <BiLogOut className={styles.logout_btn_icon} />
          </a>
        </div>
      </div>
    </>
  );
};


/*

<div class="relative max-w-md mx-auto md:max-w-2xl mt-6 min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded-xl mt-16">
    <div class="px-6">
        <div class="flex flex-wrap justify-center">
            <div class="w-full flex justify-center">
                <div class="relative">
                    <img src="https://github.com/creativetimofficial/soft-ui-dashboard-tailwind/blob/main/build/assets/img/team-2.jpg?raw=true" class="shadow-xl rounded-full align-middle border-none absolute -m-16 -ml-20 lg:-ml-16 max-w-[150px]"/>
                </div>
            </div>
            <div class="w-full text-center mt-20">
                <div class="flex justify-center lg:pt-4 pt-8 pb-0">
                    <div class="p-3 text-center">
                        <span class="text-xl font-bold block uppercase tracking-wide text-slate-700">3,360</span>
                        <span class="text-sm text-slate-400">Photos</span>
                    </div>
                    <div class="p-3 text-center">
                        <span class="text-xl font-bold block uppercase tracking-wide text-slate-700">2,454</span>
                        <span class="text-sm text-slate-400">Followers</span>
                    </div>

                    <div class="p-3 text-center">
                        <span class="text-xl font-bold block uppercase tracking-wide text-slate-700">564</span>
                        <span class="text-sm text-slate-400">Following</span>
                    </div>
                </div>
            </div>
        </div>
                <div class="text-center mt-2">
                    <h3 class="text-2xl text-slate-700 font-bold leading-normal mb-1">Mike Thompson</h3>
                    <div class="text-xs mt-0 mb-2 text-slate-400 font-bold uppercase">
                        <i class="fas fa-map-marker-alt mr-2 text-slate-400 opacity-75"></i>Paris, France
                    </div>
                </div>
                        <div class="mt-6 py-6 border-t border-slate-200 text-center">
                            <div class="flex flex-wrap justify-center">
                                <div class="w-full px-4">
                                    <p class="font-light leading-relaxed text-slate-600 mb-4">An artist of considerable range, Mike is the name taken by Melbourne-raised, Brooklyn-based Nick Murphy writes, performs and records all of his own music, giving it a warm.</p>
                                    <a href="javascript:;" class="font-normal text-slate-700 hover:text-slate-400">Follow Account</a>
                                </div>
                            </div>
                        </div>
    </div>
</div>


<footer class="relative pt-6 pb-2 mt-6">
    <div class="container mx-auto px-4">
        <div class="flex flex-wrap items-center md:justify-between justify-center">
            <div class="w-full md:w-6/12 px-4 mx-auto text-center">
            <div class="text-sm text-slate-500 font-semibold py-1">
                Tailwind CSS Component from <a href="https://www.creative-tim.com/product/notus-design-system-pro?ref=tailwindcomponents" class="text-slate-700 hover:text-slate-500" target="_blank">Notus PRO Html</a> by <a href="https://www.creative-tim.com" class="text-slate-700 hover:text-slate-500" target="_blank"> Creative Tim</a>.
            </div>
            </div>
        </div>
    </div>
</footer>

*/


/*

<!-- component -->
<div class="overflow-hidden rounded-lg border border-gray-200 shadow-md m-5">
  <table class="w-full border-collapse bg-white text-left text-sm text-gray-500">
    <thead class="bg-gray-50">
      <tr>
        <th scope="col" class="px-6 py-4 font-medium text-gray-900">Name</th>
        <th scope="col" class="px-6 py-4 font-medium text-gray-900">State</th>
        <th scope="col" class="px-6 py-4 font-medium text-gray-900">Role</th>
        <th scope="col" class="px-6 py-4 font-medium text-gray-900">Team</th>
        <th scope="col" class="px-6 py-4 font-medium text-gray-900"></th>
      </tr>
    </thead>
    <tbody class="divide-y divide-gray-100 border-t border-gray-100">
      <tr class="hover:bg-gray-50">
        <th class="flex gap-3 px-6 py-4 font-normal text-gray-900">
          <div class="relative h-10 w-10">
            <img
              class="h-full w-full rounded-full object-cover object-center"
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt=""
            />
            <span class="absolute right-0 bottom-0 h-2 w-2 rounded-full bg-green-400 ring ring-white"></span>
          </div>
          <div class="text-sm">
            <div class="font-medium text-gray-700">Steven Jobs</div>
            <div class="text-gray-400">jobs@sailboatui.com</div>
          </div>
        </th>
        <td class="px-6 py-4">
          <span
            class="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-600"
          >
            <span class="h-1.5 w-1.5 rounded-full bg-green-600"></span>
            Active
          </span>
        </td>
        <td class="px-6 py-4">Product Designer</td>
        <td class="px-6 py-4">
          <div class="flex gap-2">
            <span
              class="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600"
            >
              Design
            </span>
            <span
              class="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-600"
            >
              Product
            </span>
            <span
              class="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2 py-1 text-xs font-semibold text-violet-600"
            >
              Develop
            </span>
          </div>
        </td>
        <td class="px-6 py-4">
          <div class="flex justify-end gap-4">
            <a x-data="{ tooltip: 'Delete' }" href="#">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="h-6 w-6"
                x-tooltip="tooltip"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                />
              </svg>
            </a>
            <a x-data="{ tooltip: 'Edite' }" href="#">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="h-6 w-6"
                x-tooltip="tooltip"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                />
              </svg>
            </a>
          </div>
        </td>
      </tr>
      <tr class="hover:bg-gray-50">
        <th class="flex gap-3 px-6 py-4 font-normal text-gray-900">
          <div class="relative h-10 w-10">
            <img
              class="h-full w-full rounded-full object-cover object-center"
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt=""
            />
            <span class="absolute right-0 bottom-0 h-2 w-2 rounded-full bg-green-400 ring ring-white"></span>
          </div>
          <div class="text-sm">
            <div class="font-medium text-gray-700">Steven Jobs</div>
            <div class="text-gray-400">jobs@sailboatui.com</div>
          </div>
        </th>
        <td class="px-6 py-4">
          <span
            class="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-600"
          >
            <span class="h-1.5 w-1.5 rounded-full bg-green-600"></span>
            Active
          </span>
        </td>
        <td class="px-6 py-4">Product Designer</td>
        <td class="px-6 py-4">
          <div class="flex gap-2">
            <span
              class="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600"
            >
              Design
            </span>
            <span
              class="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-600"
            >
              Product
            </span>
            <span
              class="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2 py-1 text-xs font-semibold text-violet-600"
            >
              Develop
            </span>
          </div>
        </td>
        <td class="px-6 py-4">
          <div class="flex justify-end gap-4">
            <a x-data="{ tooltip: 'Delete' }" href="#">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="h-6 w-6"
                x-tooltip="tooltip"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                />
              </svg>
            </a>
            <a x-data="{ tooltip: 'Edite' }" href="#">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="h-6 w-6"
                x-tooltip="tooltip"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                />
              </svg>
            </a>
          </div>
        </td>
      </tr>
      <tr class="hover:bg-gray-50">
        <th class="flex gap-3 px-6 py-4 font-normal text-gray-900">
          <div class="relative h-10 w-10">
            <img
              class="h-full w-full rounded-full object-cover object-center"
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt=""
            />
            <span class="absolute right-0 bottom-0 h-2 w-2 rounded-full bg-green-400 ring ring-white"></span>
          </div>
          <div class="text-sm">
            <div class="font-medium text-gray-700">Steven Jobs</div>
            <div class="text-gray-400">jobs@sailboatui.com</div>
          </div>
        </th>
        <td class="px-6 py-4">
          <span
            class="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-600"
          >
            <span class="h-1.5 w-1.5 rounded-full bg-green-600"></span>
            Active
          </span>
        </td>
        <td class="px-6 py-4">Product Designer</td>
        <td class="px-6 py-4">
          <div class="flex gap-2">
            <span
              class="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600"
            >
              Design
            </span>
            <span
              class="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-600"
            >
              Product
            </span>
            <span
              class="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2 py-1 text-xs font-semibold text-violet-600"
            >
              Develop
            </span>
          </div>
        </td>
        <td class="px-6 py-4">
          <div class="flex justify-end gap-4">
            <a x-data="{ tooltip: 'Delete' }" href="#">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="h-6 w-6"
                x-tooltip="tooltip"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                />
              </svg>
            </a>
            <a x-data="{ tooltip: 'Edite' }" href="#">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="h-6 w-6"
                x-tooltip="tooltip"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                />
              </svg>
            </a>
          </div>
        </td>
      </tr>
      <tr class="hover:bg-gray-50">
        <th class="flex gap-3 px-6 py-4 font-normal text-gray-900">
          <div class="relative h-10 w-10">
            <img
              class="h-full w-full rounded-full object-cover object-center"
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt=""
            />
            <span class="absolute right-0 bottom-0 h-2 w-2 rounded-full bg-green-400 ring ring-white"></span>
          </div>
          <div class="text-sm">
            <div class="font-medium text-gray-700">Steven Jobs</div>
            <div class="text-gray-400">jobs@sailboatui.com</div>
          </div>
        </th>
        <td class="px-6 py-4">
          <span
            class="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-600"
          >
            <span class="h-1.5 w-1.5 rounded-full bg-green-600"></span>
            Active
          </span>
        </td>
        <td class="px-6 py-4">Product Designer</td>
        <td class="px-6 py-4">
          <div class="flex gap-2">
            <span
              class="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600"
            >
              Design
            </span>
            <span
              class="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-600"
            >
              Product
            </span>
            <span
              class="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2 py-1 text-xs font-semibold text-violet-600"
            >
              Develop
            </span>
          </div>
        </td>
        <td class="px-6 py-4">
          <div class="flex justify-end gap-4">
            <a x-data="{ tooltip: 'Delete' }" href="#">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="h-6 w-6"
                x-tooltip="tooltip"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                />
              </svg>
            </a>
            <a x-data="{ tooltip: 'Edite' }" href="#">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="h-6 w-6"
                x-tooltip="tooltip"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                />
              </svg>
            </a>
          </div>
        </td>
      </tr>
      <tr class="hover:bg-gray-50">
        <th class="flex gap-3 px-6 py-4 font-normal text-gray-900">
          <div class="relative h-10 w-10">
            <img
              class="h-full w-full rounded-full object-cover object-center"
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt=""
            />
            <span class="absolute right-0 bottom-0 h-2 w-2 rounded-full bg-green-400 ring ring-white"></span>
          </div>
          <div class="text-sm">
            <div class="font-medium text-gray-700">Steven Jobs</div>
            <div class="text-gray-400">jobs@sailboatui.com</div>
          </div>
        </th>
        <td class="px-6 py-4">
          <span
            class="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-600"
          >
            <span class="h-1.5 w-1.5 rounded-full bg-green-600"></span>
            Active
          </span>
        </td>
        <td class="px-6 py-4">Product Designer</td>
        <td class="px-6 py-4">
          <div class="flex gap-2">
            <span
              class="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600"
            >
              Design
            </span>
            <span
              class="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-600"
            >
              Product
            </span>
            <span
              class="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2 py-1 text-xs font-semibold text-violet-600"
            >
              Develop
            </span>
          </div>
        </td>
        <td class="px-6 py-4">
          <div class="flex justify-end gap-4">
            <a x-data="{ tooltip: 'Delete' }" href="#">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="h-6 w-6"
                x-tooltip="tooltip"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                />
              </svg>
            </a>
            <a x-data="{ tooltip: 'Edite' }" href="#">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="h-6 w-6"
                x-tooltip="tooltip"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                />
              </svg>
            </a>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</div>

https://tailwindcomponents.com/component/multi-line-table

*/