import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import useAuth from "../../hooks/useAuth"

const Welcome = () => {

    const { username, isManager, isAdmin } = useAuth()

    //const date = new Date()
    //const today = new Intl.DateTimeFormat('de', { dateStyle: 'full', timeStyle: 'long'}).format(date)

    const [dateToday, setDateToday] = useState(new Intl.DateTimeFormat('de', { dateStyle: 'full', timeStyle: 'long'}).format(new Date()))

    useEffect(()=>{
        const interval = setInterval(() => {
            setDateToday(new Intl.DateTimeFormat('de', { dateStyle: 'full', timeStyle: 'long'}).format(new Date()))
          }, 60000)
      
          return () => clearInterval(interval)
    }, [])

    const content = (
        <section className="welcome">
            <div className="welcome__menu">
                <p>{dateToday}</p>

                <h1>Wilkommen <span className="user__span">{username}</span> ! </h1>
                <h3>Wir lieben Mateo so sehr</h3>
                <h3>Und Alejandro Liebe Sarah so so sehr auch</h3>
                <h3>Hier sind einige Optionen für Ihre Ausgaben</h3>
                <div className="welcome__options_container">
                    <p className="option__button"><Link to="/dash/ausgaben" className="Link__class">Ausgaben anzeigen</Link></p>
                    <p className="option__button"><Link to="/dash/ausgaben/new" className="Link__class">Neue Ausgaben schaffen</Link></p>

                    {(isManager|| isAdmin) && <p className="option__button"><Link to="/dash/users" className="Link__class">View User Settings</Link></p>}
                    {(isManager|| isAdmin) && <p className="option__button"><Link to="/dash/users/new" className="Link__class">Add New User</Link></p>}
                </div>
                

                

            </div>

            
        </section>
    )

    return content
}

export default Welcome

/*<p><Link to="/dash/notes" className="Link__class">View techNotes</Link></p>
                <p><Link to="/dash/notes/new" className="Link__class">Add New techNote</Link></p>*/