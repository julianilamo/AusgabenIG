import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from 'react-router-dom'

import { memo } from 'react'

const AusgabeSum = ({ valuesDuplicated }) => {


    const navigate = useNavigate()


    const valuesAusgabenDuplicated = JSON.parse(JSON.stringify(valuesDuplicated))
    let valuesAusgaben = {}

    for (let idAusgaben in valuesAusgabenDuplicated){
        let changed = false
        if (Object.keys(valuesAusgaben).length === 0){
            valuesAusgaben[idAusgaben] = valuesAusgabenDuplicated[idAusgaben]
            continue
        }

        for (let idValAusgaben in valuesAusgaben){
            if(valuesAusgaben[idValAusgaben].expenseName === valuesAusgabenDuplicated[idAusgaben].expenseName){
                valuesAusgaben[idValAusgaben].valueAusgaben = valuesAusgaben[idValAusgaben].valueAusgaben + valuesAusgabenDuplicated[idAusgaben].valueAusgaben
                changed = true
                break
            }
        }    

        if (!changed) {
            valuesAusgaben[idAusgaben] = valuesAusgabenDuplicated[idAusgaben]
        }
            
    }

    if (Object.keys(valuesAusgaben).length > 0) {

        let tableObject = []
        for (let ausg in valuesAusgaben){
            const handleEdit = () => navigate(`/dash/ausgaben/${valuesAusgaben[ausg].id}`)
            const boughtDateAusg = new Date(valuesAusgaben[ausg].boughtDate).toLocaleString('DE', { day: 'numeric', month: 'long' })
            const value = (valuesAusgaben[ausg].valueAusgaben).toFixed(2)

            tableObject.push(
            <tr key={valuesAusgaben[ausg].id}>
                <td className="table__cell" data-cell="spesenname">{valuesAusgaben[ausg].expenseName}</td>
                <td className="table__cell" data-cell="kostenwert">€{value}</td>
                <td className="table__cell" data-cell="beschreibung">
                    <div className='row__text_line'>
                     {valuesAusgaben[ausg].textAusgaben}
                    </div>
                </td>
                <td className="table__cell" data-cell="kaufdatum">{boughtDateAusg}</td>
                <td className="table__cell" data-cell="nutzer">{valuesAusgaben[ausg].username}</td>
                <td className="table__cell" data-cell="bearbeiten">
                    <button
                        className="icon-button"
                        onClick={handleEdit}
                    >
                        <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                </td>
            </tr>)
        }
        return (tableObject)

    } else return null
}
const memoizedAusgabeSum = memo(AusgabeSum)

export default memoizedAusgabeSum

/*
                <td className="table__cell note__created">{created}</td>
                <td className="table__cell note__updated">{updated}</td>

*/