import React from "react";

function currencyRow(props){
    const {
        currencyOptions,
        selectedCurrency,
        onChangeCurrency
    } = props

    const listOfCoins = ["EUR", "COP"]

    return(
        <>
            <select id="coinSelect" className="input__select" value={selectedCurrency} onChange={onChangeCurrency}>
                {currencyOptions.map(option=>{
                    let selOption
                    if (listOfCoins.includes(option)){
                        selOption = <option key={option} value={option}>{option}</option>
                    }
                    return selOption
                    })}
                
            </select>
        </>
            
    )
}

export default currencyRow
