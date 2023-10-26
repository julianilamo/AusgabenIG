import { Link } from "react-router-dom"
import useAuth from "../../hooks/useAuth"

const Welcome = () => {

    const { username, isManager, isAdmin } = useAuth()

    const date = new Date()
    const today = new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'long'}).format(date)

    const content = (
        <section className="welcome">
            <div className="welcome__menu">
                <p>{today}</p>

                <h1>Wilkommen <span className="user__span">{username}</span> Benutzer! </h1>

                <h2>Wir lieben Mateo so sehr</h2>
                <h2>Und Alejandro Liebe Sarah so so sehr auch</h2>

                <p><Link to="/dash/notes" className="Link__class">View techNotes</Link></p>
                <p><Link to="/dash/notes/new" className="Link__class">Add New techNote</Link></p>

                {(isManager|| isAdmin) && <p><Link to="/dash/users" className="Link__class">View User Settings</Link></p>}
                {(isManager|| isAdmin) && <p><Link to="/dash/users/new" className="Link__class">Add New User</Link></p>}

            </div>

            
        </section>
    )

    return content
}

export default Welcome