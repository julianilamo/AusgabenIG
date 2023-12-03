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

        const handleEdit = () => navigate(`/dash/ausgaben/${ausgabeId}`)
        const boughtDateAusg = new Date(new Date(ausgabe.boughtDate).toISOString().split('T')[0].replace(/-/g, '\/')).toLocaleString('DE', { day: 'numeric', month: 'long' })
        const value = (ausgabe.valueAusgaben).toFixed(2)
        console.log()
        return (
                <tr>
                    <td className="table__cell" data-cell="spesenname">{ausgabe.expenseName}</td>
                    <td className="table__cell" data-cell="kostenwert">€{value}</td>
                    <td className="table__cell" data-cell="beschreibung">
                        <div className='row__text_line'>
                         {ausgabe.textAusgaben}
                        </div>
                    </td>
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