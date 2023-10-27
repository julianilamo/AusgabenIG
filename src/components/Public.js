import { NavLink } from "react-router-dom";

const Public = () => {
    const content = (
        <section className="public">
            <header className="public__header">
                <h1>Herzlich Wilkommen bei den <span className="nowrap">Ilamo Guthnick - Familieausgaben</span></h1>
            </header>
            <main>
                <div className = "public_container">
            
                    <h1>Um Ausgaben zu erfassen, melden Sie sich an</h1>
                    <p>Wo es nicht an Windeln mangelt und es viel Gelächter gibt</p>

                    <h2><NavLink to="/login" className="Link__class">Employee Login</NavLink></h2>

                    <div className="public__main_bottom">
                        <address className="public__addr">
                            Employee of the year: Alejandro<br />
                            <a href="https://www.youtube.com/watch?v=ZhXL9YNVA_4" className="Link__class">Don't click here</a>
                        </address>
                        <br />
                        <p>Owner: The familie</p>
                    </div>
            
                </div>
            </main>
            <footer>
                <h1 className="public-footer">Sicher is sicher</h1>
            </footer>
        </section>
    )

    return content
}

export default Public