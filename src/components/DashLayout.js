import { Outlet, useLocation } from "react-router-dom"
import DashHeader from "./DashHeader"
import DashFooter from "./DashFooter"

const DashLayout = () => {

    function getClassName(pathName) {
        switch (pathName) {
          case '/dash/ausgaben':
            return 'dash-container-dipers';
          default:
            return 'dash-container';
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