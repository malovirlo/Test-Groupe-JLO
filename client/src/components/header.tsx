import { Link, useLocation } from "react-router-dom";

function Header() {
    const location = useLocation();

    return (
        <header className="flex justify-center items-center h-20 bg-[#444] border-b-4 border-b-violet-400">
            <h1 className="font-bold text-3xl text-white uppercase">
                Bienvenue à mon JLO Test
            </h1>
            {location.pathname === "/theme" ? (
                <Link to={"/"}>
                    <button className="ml-4 bg-violet-400 hover:bg-violet-300 text-white font-semibold py-2 px-4 border border-violet-500 hover:border-violet-400 rounded shadow">
                        Accueil
                    </button>
                </Link>
            ) : (
                <Link to={"/theme"}>
                    <button className="ml-4 bg-violet-400 hover:bg-violet-300 text-white font-semibold py-2 px-4 border border-violet-500 hover:border-violet-400 rounded shadow">
                        Theme
                    </button>
                </Link>
            )}
        </header>
    );
}

export default Header;
