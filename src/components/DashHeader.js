import { useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
    faFileCirclePlus,
    faFilePen,
    faUserGear,
    faUserPlus,
    faRightFromBracket
} from "@fortawesome/free-solid-svg-icons"
import { useNavigate, Link, useLocation } from "react-router-dom";

import { useSendLogoutMutation } from "../features/auth/authApiSlice";

import useAuth from "../hooks/useAuth";

const DASH_REGEX = /^\/dash(\/)?$/
const AUSGABEN_REGEX = /^\/dash\/ausgaben(\/)?$/
const USERS_REGEX = /^\/dash\/users(\/)?$/

const DashHeader = () => {
    const { isManager, isAdmin } = useAuth()

    const navigate = useNavigate()
    const { pathname } = useLocation()
    const [sendLogout,{
        isLoading,
        isSuccess,
        isError,
        error
    }] = useSendLogoutMutation()


    useEffect(()=>{
        if (isSuccess) navigate('/')
    }, [isSuccess, navigate])

    const onNewAusgabenClicked = () => navigate('/dash/ausgaben/new')
    const onNewUserClicked = () => navigate ('/dash/users/new')
    const onAusgabenClicked = () => navigate('/dash/ausgaben')
    const onUsersClicked = () => navigate('/dash/users')

    const onLogoutClicked = () => sendLogout()
    
    let dashClass = null
    if (!DASH_REGEX.test(pathname) && !AUSGABEN_REGEX.test(pathname) && !USERS_REGEX.test(pathname)) {
        dashClass = "dash-header__container--small"
    }

    let newAusgabenButton = null
    if (AUSGABEN_REGEX.test(pathname)) {
        newAusgabenButton = (
            <button
                className="icon-button"
                title="New Ausgabe"
                onClick={onNewAusgabenClicked}
            >
                <FontAwesomeIcon icon={faFileCirclePlus} />
            </button>
        )
    }

    let newUserButton = null
    if (USERS_REGEX.test(pathname)) {
        newUserButton = (
            <button
                className="icon-button"
                title="New User"
                onClick={onNewUserClicked}
            >
                <FontAwesomeIcon icon={faUserPlus} />
            </button>
        )
    }

    let userButton = null
    if (isManager || isAdmin){
        if (!USERS_REGEX.test(pathname) && pathname.includes('/dash')) {
            userButton = (
                <button
                    className="icon-button"
                    title="Users"
                    onClick={onUsersClicked}
                >
                    <FontAwesomeIcon icon={faUserGear} />
                </button>
            )
        }
    }

    let ausgabenButton = null
    if (!AUSGABEN_REGEX.test(pathname) && pathname.includes('/dash')) {
        ausgabenButton = (
            <button
                className="icon-button"
                title="Ausgaben"
                onClick={onAusgabenClicked}
            >
                <FontAwesomeIcon icon={faFilePen} />
            </button>
        )
    }


    

    const logoutButton = (
        <button
            className="icon-button"
            title="Logout"
            onClick={onLogoutClicked}
        >
            <FontAwesomeIcon icon={faRightFromBracket} />
        </button>
    )

        const errClass = isError ? "errmsg" : "offscreen"

        let buttonContent
        if (isLoading) {
            buttonContent = <p>Logging Out...</p>
        }else{
            buttonContent = (
                <>
                    {newAusgabenButton}
                    {newUserButton}
                    {ausgabenButton}
                    {userButton}
                    {logoutButton}
                </>
            )
        }
    const content = (
        <>
            <p className={errClass}>{error?.data?.message}</p>

            <header className="dash-header">
                <div className={`dash-header__container ${dashClass}`}>
                    <Link to="/dash">
                        <h1 className="dash-header__title">AUSGABEN</h1>
                    </Link>
                    <nav className="dash-header__nav">
                            {buttonContent}
                    </nav>
                </div>

                
            </header>
        </>
    )
    
    return content

}

export default DashHeader
