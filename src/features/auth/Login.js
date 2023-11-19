import { useRef, useState, useEffect } from "react"
import { useNavigate, Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faUser,
    faLock,
    faChevronRight
} from "@fortawesome/free-solid-svg-icons"
import { faLinkedin } from '@fortawesome/free-brands-svg-icons'
import { useDispatch } from 'react-redux'
import { setCredentials } from "./authSlice"
import { useLoginMutation } from "./authApiSlice"

import usePersist from "../../hooks/usePersist"

const Login = () => {
    const userRef = useRef()
    const errRef = useRef()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errMsg, setErrMsg] = useState('')
    const [persist, setPersist] = usePersist()
    
    const navigate = useNavigate()
    const dispath = useDispatch()

    const [login, { isLoading }] = useLoginMutation()

    useEffect(()=>{
        userRef.current.focus()
    }, [])

    useEffect(()=>{
        setErrMsg('');
    }, [username, password])

    const handleSubmit = async (e) =>{
        e.preventDefault()

        try {
            const{ accessToken } = await login({ username, password }).unwrap()
            dispath(setCredentials({ accessToken }))
            setUsername('')
            setPassword('')
            navigate('/dash')
        } catch (err) {
            if (!err.status){
                setErrMsg('No Server Response');
            } else if (err.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg(err.data?.message);
            }
            errRef.current.focus();
        }

    }

    const handleUserInput = (e) => setUsername(e.target.value)
    const handlePwdInput = (e) => setPassword(e.target.value)
    const handleToggle = () => setPersist(prev => !prev)

    const errClass = errMsg ? "errmsg" : "offscreen"

    if (isLoading) return <p>Loading...</p>

    const content = (
        <section className="public">
            <header>
                <h1>Familie Nutzer</h1>
            </header>

            <main className="main_container">
                <div className="login_screen">
                    <div className="login_screen_content">
                        <p ref={errRef} className={errClass} aria-live="assertive">{errMsg}</p>

                        <form className="login__form" onSubmit={handleSubmit}>
                            <div className="login__field">
                                <FontAwesomeIcon className="login__icon" icon={faUser} />
                                <input
                                className="login__input"
                                type="text"
                                id="username"
                                ref={userRef}
                                value={username}
                                onChange={handleUserInput}
                                placeholder="Nutzer / Email"
                                autoComplete="off"
                                required
                            />
                            </div>
                                
                            <div className="login__field">
                                <FontAwesomeIcon className="login__icon" icon={faLock} />
                                    <input
                                        className="login__input"
                                        type="password"
                                        id="password"
                                        onChange={handlePwdInput}
                                        value={password}
                                        placeholder="PassWort"
                                        required
                                    />
                            </div>
                            <button className="login__submit">Anmelden
                            <FontAwesomeIcon className="button__icon" icon={faChevronRight} />
                            </button>

                            
                            <label htmlFor="persist" className="persist__icon">
                                <input
                                    type="checkbox"
                                    id="persist"
                                    onChange={handleToggle}
                                    checked={persist}
                                />
                                Vertrauen Sie diesem Gerät
                            </label>
                        </form>

                        <div>
                            <a href="https://www.linkedin.com/in/julian-alejandro-ilamo-sarria-0a2890200/" className="login__instagram" target="_blank"><FontAwesomeIcon className="instagram_icon" icon={faLinkedin} /></a>
                        </div>   	
                    </div>
                    <div class="screen__background">
                            <span class="screen__background__shape screen__background__shape4"></span>
                            <span class="screen__background__shape screen__background__shape3"></span>		
                            <span class="screen__background__shape screen__background__shape2"></span>
                            <span class="screen__background__shape screen__background__shape1"></span>
                        </div>	
                </div>
            </main>

            <footer>
                <Link to="/" className="Link__class">Zurück zur Hauptseite</Link>
            </footer>
        </section>
    )

    return(content)
}

export default Login