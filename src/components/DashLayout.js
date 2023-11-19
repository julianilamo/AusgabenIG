import { Outlet, useLocation } from "react-router-dom"
import DashHeader from "./DashHeader"
import DashFooter from "./DashFooter"
import useAuth from "../hooks/useAuth"

const DashLayout = () => {

    const { familie } = useAuth()

    function getClassName(pathName) {
        if (familie === "Ilamo Guthnick"){
            switch (pathName) {
                case '/dash/ausgaben':
                  return 'dash-container-dipers';
                default:
                  return 'dash-container';
              }
        }else{
            return 'dash-container-public'
        }

        
    }

    const {pathname} = useLocation()

    return (
        <>
        <DashHeader />
            <div className={getClassName(pathname)}>
                <Outlet ></Outlet>
            </div>
            <DashFooter />
        </>
        
    )
}

export default DashLayout