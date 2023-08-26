"use client";


import Image from "@/node_modules/next/image" 
import { useBoardStore } from "@/store/BoardStore";
import { MagnifyingGlassIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import Avatar from 'react-avatar';
function Header() {
  const [board,searchString,setSearchString]=useBoardStore((state)=>[
    state.board,
    state.searchString,
    state.setSearchString,
  ])
  return (
    <header>
        <div className="flex flex-col md:flex-row items-center p-5 bg-gray-500/10">
        <div className="
        absolute 
        top-0
        left-0
        w-full
        h-96
        bg-gradient-to-br
        from-yellow-300
        to-red-400
        rounded-md
        filter
        blur-3xl
        opacity-50
        -z-50
        "
         />
  
  <Image
        src="/logo.png" 
        alt="logo"
        width={100}
        height={100} 
        className="pb-10 md:pb-0 object-contain"
        //layout="fixed"
        />

        <div className="flex items-center space-x-5 flex-1 justify-end w-full">
            <form className="flex items-center space-x-5 bg-white rounded-md p-2 shadow-md flex-1 md:flex-initial">
                <MagnifyingGlassIcon className="h-6 w-6 text-gray-400"/>
                <input type="text" placeholder="Search" value={searchString} 
                onChange={(e)=>setSearchString(e.target.value)}
                className="flex-1 outline-none p-2"/>
                <button type="submit" hidden>Search</button>
            </form>

   <Avatar name='Aryan Shrivastava' round size="50"/>
        </div>
        </div>
        <div className="flex items-center  justify-center px-5 py-2 md:py-5">
        <p className="flex items-center p-5 text-sm font-light pr-5 shadow-xl rounded-xl w-fit bg-white italic max-w-3xl text-[#0055D1]">
            <UserCircleIcon className="inline-block h-10 w-10 text-[#0055D1] mr-1"/>
            GPT is summarising your tasks for the day...
        </p>
        </div>
    </header>
  )
}

export default Header