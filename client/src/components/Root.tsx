import Header from "./header";
import { Outlet } from "react-router-dom";

function Root() {
    return (
        <>
            <Header />
            <Outlet />
        </>
    );
}

export default Root;
