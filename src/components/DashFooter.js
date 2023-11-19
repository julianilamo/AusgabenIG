import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHouse } from "@fortawesome/free-solid-svg-icons"
import { useNavigate, useLocation } from "react-router-dom"
import useAuth from "../hooks/useAuth"

const DashFooter = () => {

    const {username, familie} = useAuth()

    const navigate = useNavigate()
    const { pathname } = useLocation()

    const onGohomeClicked = () => navigate('/dash')

    let goHomeButton = null
    if(pathname !== '/dash'){
        goHomeButton = (
            <button
                className="dash-footer__button icon-button"
                title="Home"
                onClick={onGohomeClicked}
            >
                <FontAwesomeIcon icon={faHouse} />
            </button>
            
        )
    }

    const content = (
        <footer className="dash-footer">
            <div className="nav_foot_background">{goHomeButton}</div>
            
            <p>Current User: {username}</p>
            <p>Familie: {familie}</p>
        </footer>
    )

    return content
}

export default DashFooter