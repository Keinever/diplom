import { ChevronLast, ChevronFirst } from "lucide-react"
import {useState, createContext, useContext} from 'react';
import ITMOLogo from '../../assets/icons/mini-logo.jpg'
import ITMOFullLogo from '../../assets/icons/big-logo.jpg'

const NavBarContext = createContext()

export default function NavBar({ children }) {
    const [collapsed, setCollapsed] = useState(true);
    return (
        <nav className="h-screen sticky top-0 flex flex-col bg-white border-r shadow-sm">
            <div className="relative justify-between items-center">
                <div className={`overflow-hidden h-20 transition-all pt-5 ${
                    collapsed ? "w-64 pl-3" : "w-20 pl-0"
                }`}>
                    <img
                        src={collapsed ? ITMOFullLogo : ITMOLogo }
                        className="w-full h-full"
                        alt=""
                    />
                </div>
                <button
                    onClick={() => setCollapsed((curr) => !curr)}
                    className="absolute -right-3 -bottom-4 rounded-lg bg-gray-50 hover:bg-gray-100"
                >
                    {collapsed ? <ChevronFirst /> : <ChevronLast />}
                </button>
            </div>
            <NavBarContext.Provider value={{ collapsed }}>
                <ul className="flex-1 px-2 mt-1">{children}</ul>
            </NavBarContext.Provider>
        </nav>
    )
}

export function NavBarRow({ icon, text, active }) {
    const { collapsed } = useContext(NavBarContext)

    return (
        <li className={`
        relative flex items-center py-2 px-3 my-1
        font-medium rounded-md cursor-pointer
        transition-colors group
        ${
            active
                ? "bg-gradient-to-tr from-indigo-100 to-blue-300 text-blue-700"
                : "hover:bg-indigo-50 hover:text-blue-700"
        }
        `}>
                {icon}
            <span
                className={`overflow-hidden transition-all ${
                    collapsed ? "ml-3" : "w-0"
                }`}
            >
                {text}
            </span>
        </li>
    )
}
