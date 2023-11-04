import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAddNewAusgabenMutation } from "./ausgabenApiSlice"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave } from "@fortawesome/free-solid-svg-icons"
import currencyRow from "./currencyRow"

const NewAusgabeForm = ({users})=>{
    const [addNewAusgabe, {
        isLoading,
        isSuccess,
        isError,
        error
    }]= useAddNewAusgabenMutation()

    const [maxDate] = useState(new Date().toISOString().split('T')[0]);
    //const navigate = useNavigate()

    const [expense, setExpense] = useState('')
    const [valueAusgaben, setValueAusgaben] = useState('')
    const [textAusgaben, setTextAusgaben] = useState('')
    const [boughtDate, setBoughtDate] = useState(maxDate)    
    const [userId, setUserId] = useState(users[0].id)
    const [message, setMessage] = useState('')

    useEffect(()=>{
        if (isSuccess){
            setExpense('')
            setValueAusgaben('')
            setTextAusgaben('')
            setBoughtDate(maxDate)
            setUserId('')
            //navigate('/dash/notes')
        }
        if (message){
            alert(message)
        }
    }, [isSuccess, message]) //[isSuccess, navigate])

    const onExpenseChanged = e => setExpense(e.target.value)
    const onValueAusgabenChanged = e => setValueAusgaben(e.target.value)
    const onTextChanged = e => setTextAusgaben(e.target.value)
    const onBoughtDateChanged = e => setBoughtDate(e.target.value)
    const onUserIdChanged = e=> setUserId(e.target.value)

    const canSave = [expense, valueAusgaben, boughtDate, userId].every(Boolean) && !isLoading

    const onSaveAusgabenClicked = async (e) => {
        e.preventDefault()

        if (canSave){
            await addNewAusgabe({userAusgaben: userId,  expenseName: expense, valueAusgaben, textAusgaben, boughtDate})
            setMessage("Your form has been correctly submited!")
        }else{
            alert("Cannot save yet")
        }
    }

    const options = users.map(user=>{
        return(
            <option
                key={user.id}
                value={user.id}
                >
                    {user.username}
                </option>
        )
    })

    const errClass = isError ? "errmsg" : "offscreen"
    

    const content = (
        <>
            <p className={errClass}>{error?.data?.message}</p>

            <form className="form" onSubmit={onSaveAusgabenClicked}>
                <div className="form__title-row">
                    <h2>New Ausgaben</h2>
                    <div className="form__action-buttons">
                        <button
                            className="icon-button"
                            title="Save"
                            disabled={!canSave}
                            
                        >
                            <FontAwesomeIcon icon={faSave} />          
                        </button>
                    </div>
                </div>

                <label className="form__label" htmlFor="expenseName">
                Spesenname:</label>
                <input
                    className={`form__input`}
                    id="expenseName"
                    name="expenseName"
                    type="text"
                    autoComplete="on"
                    value={expense}
                    onChange={onExpenseChanged}
                />

                <label className="form__label" htmlFor="valAusgaben">
                    Kostenwert</label>
                <input className=""
                    type="number"
                    id="valAusgaben" 
                    name="valAusgaben"
                    min="0"
                    max="10000000"
                    value={valueAusgaben}
                    onChange={onValueAusgabenChanged}
                />

                <currencyRow/>

                <label className="form__label" htmlFor="textAusgaben">
                    Beschreibung:</label>
                <textarea
                    className={`form__input form__input--text`}
                    id="textAusgaben"
                    name="textAusgaben"
                    value={textAusgaben}
                    onChange={onTextChanged}
                />

                <label className="form__label" htmlFor="boughtAusgaben">
                    Kaufdatum:</label>
                <input 
                    type="date"
                    id="boughtAusgaben"
                    name="boughtAusgaben"
                    min="2023-11-01" 
                    max={maxDate}
                    value={boughtDate}
                    onChange={onBoughtDateChanged}

                />

                

                <label className="form__label form__checkbox-container" htmlFor="username">
                gekauft von:</label>
                <select
                    id="username"
                    name="username"
                    className="form__select"
                    value={userId}
                    onChange={onUserIdChanged}
                >
                    {options}
                </select>
            </form>
        </>
    )

    return content

}


export default NewAusgabeForm