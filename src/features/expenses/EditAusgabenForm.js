import { useState, useEffect } from "react"
import { useUpdateAusgabenMutation, useDeleteAusgabenMutation } from "./ausgabenApiSlice"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons"
import CurrencyRow from "./CurrencyRow"
import useAuth from "../../hooks/useAuth"

const EditAusgabenForm = ({ausgabe, users}) =>{
    const {isManager, isAdmin } = useAuth()

    const [updateAusgabe,{
        isLoading,
        isSuccess,
        isError,
        error
    }] = useUpdateAusgabenMutation()

    const [deleteAusgabe, {
        isLoading: isDelSuccess,
        isError: isDelError,
        error: delError
    }] = useDeleteAusgabenMutation()

    const navigate = useNavigate()

    const [maxDate] = useState(new Date().toISOString().split('T')[0]);
    const baseURLfetchRates = `https://openexchangerates.org/api/latest.json?app_id=${process.env.REACT_APP_API_EXCHANGE_ACCESS_KEY}`
    const baseForAusg = "EUR"

    const [expense, setExpense] = useState(ausgabe.expenseName)
    const [valueAusgaben, setValueAusgaben] = useState(ausgabe.valueAusgaben)
    const [textAusgaben, setTextAusgaben] = useState(ausgabe.textAusgaben)
    const [boughtDate, setBoughtDate] = useState(new Date(ausgabe.boughtDate).toISOString().split('T')[0])    
    const [userId, setUserId] = useState(ausgabe.userAusgaben)
    const [currencyOptions, setCurrencyOptions] = useState([])
    const [currencyRates, setCurrencyRates] = useState({})
    const [fromCurrency, setFromCurrency] = useState(baseForAusg)

    useEffect(()=>{
        fetch(baseURLfetchRates)
        .then(res=>res.json())
        .then(data => {
            setCurrencyOptions([...Object.keys(data.rates)])
            setCurrencyRates(data.rates)
        })

        if (isSuccess || isDelSuccess){
            setExpense('')
            setValueAusgaben('')
            setTextAusgaben('')
            setBoughtDate(maxDate)
            setUserId(userId)
            navigate('/dash/ausgaben')
        }

    }, [isSuccess, isDelSuccess, navigate]) 

    const onExpenseChanged = e => setExpense(e.target.value)
    const onTextChanged = e => setTextAusgaben(e.target.value)
    const onBoughtDateChanged = e => setBoughtDate(e.target.value)
    const onUserIdChanged = e=> setUserId(e.target.value)

    let rateAusg, valConvAusg
    rateAusg = currencyRates[baseForAusg]/currencyRates[fromCurrency]
    valConvAusg = (rateAusg*valueAusgaben).toFixed(3)
    
    
    
    
    const onValueAusgabenChanged = (e) =>{
        setValueAusgaben(e.target.value)
        //setConvertionAusg(valConvAusg)
    }
    
    const canSave = [expense, valueAusgaben, boughtDate, userId, fromCurrency].every(Boolean) && !isLoading
    let valAusg = valueAusgaben


    const onSaveAusgabenClicked = async (e) => {
        if (canSave){
            if (fromCurrency === baseForAusg) {
                valAusg = valueAusgaben
            }else{
                valAusg = valueAusgaben*rateAusg
            }

            await updateAusgabe({id: ausgabe.id , userAusgaben: userId,  expenseName: expense, valueAusgaben: valAusg, textAusgaben, boughtDate, coinAusgaben: fromCurrency})
            alert("Your form has been correctly updated!")
        }
    }

    const onDeleteAusgabeClicked = async () =>{
        let confirmDel = window.confirm("Möchten Sie diesen Ausgabe eliminieren?")
        if(confirmDel){
            await deleteAusgabe({ id: ausgabe.id })
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

    const errClass = (isError|| isDelError) ? "errmsg" : "displayingComponent"
    const displayConvertion = fromCurrency === "EUR" ? "displayingComponent" : "form__convertion"
    const displayButton = canSave === true ? "icon__container" : "displayingComponent"

    let deleteButton = null
    if (isManager || isAdmin){
        deleteButton = (
            <button
                className="icon-button"
                title="Delete"
                onClick={onDeleteAusgabeClicked}
            >
                <FontAwesomeIcon icon={faTrashCan} />
            </button>
        )
    }

    const content = (
        <>
            <p className={errClass}>{error?.data?.message || delError?.data?.message} ?? ''</p>

            <form className="form" onSubmit={e => e.preventDefault()}>
                <div className="form__title-row">
                    <h2>Edit Ausgaben</h2>
                    <div className={displayButton}>
                        <button
                            className="icon-button"
                            title="Save"
                            onClick={onSaveAusgabenClicked}
                            disabled={!canSave}
                            
                        >
                            <FontAwesomeIcon icon={faSave} />          
                        </button>
                        {deleteButton}
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

                <div className="form__convertion">
                    <input className="input__valAusgaben"
                        type="number"
                        id="valAusgaben" 
                        name="valAusgaben"
                        min="0"
                        max="100000000000000000000000"
                        value={valueAusgaben}
                        onChange={onValueAusgabenChanged}
                    />

                    <CurrencyRow 
                        currencyOptions={currencyOptions}
                        selectedCurrency={fromCurrency}
                        const onChangeCurrency = {e => (
                            setFromCurrency(e.target.value))
                        }
                    
                        
                    />
                    
                    <div className={displayConvertion}>
                        <label className="form__label" htmlFor="ConvertionAusgaben">in Euro</label>
                        <input className="input__valAusgaben"
                            type="number"
                            id="ConvertionAusgaben"
                            name="ConvertionAusgaben"
                            value={valConvAusg}
                            readOnly
                        />
                    </div>

                </div>

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
                    className="form__date"
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

export default EditAusgabenForm