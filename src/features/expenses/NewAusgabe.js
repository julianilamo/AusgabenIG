import NewAusgabeForm from "./NewAusgabeForm"
import { useGetUsersQuery } from "../users/usersApiSlice"
import PulseLoader from 'react-spinners/PulseLoader'
import useAuth from "../../hooks/useAuth"

const NewAusgabe = () => {
    const { familie } = useAuth()
    const { users, idsFilter } = useGetUsersQuery("usersList", {
        selectFromResult: ({ data }) => ({
            //users: data?.ids.map(id => data?.entities[id])
            users: data?.ids.filter(ids => data?.entities[ids].familie === familie).map(id => data?.entities[id])
        }),
    })

    //if (!users?.length) return <p>Not Currently Available</p>
    if (!users?.length) return <PulseLoader color="#FFF" />

    const content = <NewAusgabeForm users = {users} />

    return content
}

export default NewAusgabe