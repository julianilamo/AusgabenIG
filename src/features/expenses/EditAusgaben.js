import { useParams } from "react-router-dom"
import EditAusgabenForm from "./EditAusgabenForm"
import { useGetAusgabenQuery } from "./ausgabenApiSlice"
import { useGetUsersQuery } from "../users/usersApiSlice"
import useAuth from "../../hooks/useAuth"
import PulseLoader from 'react-spinners/PulseLoader'


const EditAusgaben = () =>{
    const {id} = useParams()

    const {username, isManager, isAdmin, familie} = useAuth()

    const {ausgabe} = useGetAusgabenQuery("ausgabenList", {
        selectFromResult: ({data}) => ({
            ausgabe: data?.entities[id]
        }),
    })

    const { users } = useGetUsersQuery("usersList", {
        selectFromResult: ({ data }) => ({
            users: data?.ids.filter(ids => data?.entities[ids].familie === familie).map(id => data?.entities[id])
        }),
    })

    if (!ausgabe || !users?.length) return <PulseLoader color={"#FFF"} />

    /*
    Es buena seguridad por si queremos editar el ausgaben de otro integrante de la familia

    if (!isManager || !isAdmin){
        if(ausgabe.username !== username){
            return <p className="errmsg">No access</p>
        }
    }*/

    const content = <EditAusgabenForm ausgabe = {ausgabe} users = {users} />

    return content
}

export default EditAusgaben