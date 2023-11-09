import { useState, useEffect } from "react"
//import { useNavigate } from "react-router-dom"
import { useAddNewAusgabenMutation } from "./ausgabenApiSlice"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave } from "@fortawesome/free-solid-svg-icons"
import CurrencyRow from "./CurrencyRow"

const NewAusgabeForm = ({users})=>{
    const [addNewAusgabe, {
        isLoading,
        isSuccess,
        isError,
        error
    }]= useAddNewAusgabenMutation()

    const [maxDate] = useState(new Date().toISOString().split('T')[0]);
    const baseURLfetchRates = `https://openexchangerates.org/api/latest.json?app_id=${process.env.REACT_APP_API_EXCHANGE_ACCESS_KEY}`
    const baseForAusg = "EUR"
    //const navigate = useNavigate()

    const [expense, setExpense] = useState('')
    const [valueAusgaben, setValueAusgaben] = useState(0)
    const [textAusgaben, setTextAusgaben] = useState('')
    const [boughtDate, setBoughtDate] = useState(maxDate)    
    const [userId, setUserId] = useState(users[0].id)
    //const [message, setMessage] = useState('')
    //Currency effects
    const [currencyOptions, setCurrencyOptions] = useState([])
    const [currencyRates, setCurrencyRates] = useState({})
    const [fromCurrency, setFromCurrency] = useState(baseForAusg)
    //const [convertionAusg, setConvertionAusg] = useState(1)
    //const [toCurrency, setToCurrency] = useState()


 

    useEffect(()=>{
        fetch(baseURLfetchRates)
        .then(res=>res.json())
        .then(data => {
            
            

            setCurrencyOptions([...Object.keys(data.rates)])
            setCurrencyRates(data.rates)
            setFromCurrency(baseForAusg)
            //setToCurrency(baseForAusg)
        })

        if (isSuccess){
            setExpense('')
            setValueAusgaben('')
            setTextAusgaben('')
            setBoughtDate(maxDate)
            setUserId(userId)
            //navigate('/dash/notes')
        }
        /*if (message){
            alert(message)
        }*/
    }, [isSuccess]) //[isSuccess, navigate])

    const onExpenseChanged = e => setExpense(e.target.value)
    //const onValueAusgabenChanged = e => setValueAusgaben(e.target.value)
    const onTextChanged = e => setTextAusgaben(e.target.value)
    const onBoughtDateChanged = e => setBoughtDate(e.target.value)
    const onUserIdChanged = e=> setUserId(e.target.value)

    let rateAusg, valConvAusg
    rateAusg = currencyRates[baseForAusg]/currencyRates[fromCurrency]
    valConvAusg = rateAusg*valueAusgaben

    
    
    
    
    const onValueAusgabenChanged = (e) =>{
        setValueAusgaben(e.target.value)
        //setConvertionAusg(valConvAusg)
    }
    
    const canSave = [expense, valueAusgaben, boughtDate, userId, fromCurrency].every(Boolean) && !isLoading
    let valAusg = valueAusgaben


    const onSaveAusgabenClicked = async (e) => {
        e.preventDefault()

        if (canSave){
            if (fromCurrency === baseForAusg) {
                valAusg = valueAusgaben
            }else{
                valAusg = valueAusgaben*rateAusg
            }
            await addNewAusgabe({userAusgaben: userId,  expenseName: expense, valueAusgaben: valAusg, textAusgaben, boughtDate, coinAusgaben: fromCurrency})
            alert("Your form has been correctly submited!")
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
    const displayConvertion = fromCurrency === "EUR" ? "displayingComponent" : ""
    

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



/*              Rates for second option
                <div>
                    <h1>=</h1>
                    <CurrencyRow
                        currencyOptions={currencyOptions}
                        selectedCurrency={toCurrency}
                        const onChangeCurrency = {e => setToCurrency(e.target.value)}
                    />
                </div> */