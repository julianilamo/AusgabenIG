import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from 'react-router-dom'

import { useGetAusgabenQuery } from './ausgabenApiSlice'
import { memo } from 'react'

const Ausgabe = ({ ausgabeId }) => {

    const { ausgabe } = useGetAusgabenQuery("ausgabenList", {
        selectFromResult: ({ data }) => ({
            ausgabe: data?.entities[ausgabeId]
        }),
    })

    const navigate = useNavigate()

    

    if (ausgabe) {
        //const created = new Date(ausgabe.createdAt).toLocaleString('en-US', { day: 'numeric', month: 'long' })

        //const updated = new Date(ausgabe.updatedAt).toLocaleString('en-US', { day: 'numeric', month: 'long' })
        const handleEdit = () => navigate(`/dash/ausgaben/${ausgabeId}`)
        const boughtDateAusg = new Date(ausgabe.boughtDate).toLocaleString('DE', { day: 'numeric', month: 'long' })
        console.log(boughtDateAusg)
        return (
            <tr>
                <td className="table__cell" data-cell="spesenname">{ausgabe.expenseName}</td>
                <td className="table__cell" data-cell="kostenwert">{ausgabe.valueAusgaben}</td>
                <td className="table__cell" data-cell="beschreibung">{ausgabe.textAusgaben}</td>
                <td className="table__cell" data-cell="kaufdatum">{boughtDateAusg}</td>
                <td className="table__cell" data-cell="nutzer">{ausgabe.username}</td>
                <td className="table__cell" data-cell="bearbeiten">
                    <button
                        className="icon-button"
                        onClick={handleEdit}
                    >
                        <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                </td>
            </tr>
        )

    } else return null
}
const memoizedAusgabe = memo(Ausgabe)

export default memoizedAusgabe

/*
                <td className="table__cell note__created">{created}</td>
                <td className="table__cell note__updated">{updated}</td>

*/