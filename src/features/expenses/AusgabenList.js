import { useGetAusgabenQuery } from "./ausgabenApiSlice";
import Ausgaben from "./Ausgaben"
import AusgabenSum from "./AusgabenSum";
import useAuth from "../../hooks/useAuth"
import { useState } from "react";

const AusgabenList = () => {
    const { isManager, isAdmin, familie} = useAuth()

    const {
        data: ausgaben,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetAusgabenQuery('ausgabenList',{
        pollingInterval: 15000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })

    const germanMonths = ["All","Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"]

    let content

    if (isLoading) content = <p>Loading ausgaben...</p>

    if (isError){
        content = <p className="errmsg">{error?.data?.message}</p>
    }

    const maxDate = new Date().getMonth()+1

    const [filterUserExpenses, setFilterUserExpenses] = useState('All')
    const [filterMonth, setFilterMonth] = useState(maxDate)
    const [filterSpecificPurchase, setFilterSpecificPurchase] = useState(false)

    

    if (isSuccess) {
        const {ids, entities } = ausgaben

        
        let filteredIds
        let filteredExpenseValue

        if (isManager || isAdmin) {
            //filteredIds = [...ids]
            filteredIds = ids.filter(ausgabenId => entities[ausgabenId].familie === familie)
        }else{
            filteredIds = ids.filter(ausgabenId => entities[ausgabenId].familie === familie)
            
        }
        
        const FilterUsers = filteredIds.map(idForUser => entities[idForUser].username)

        let tableContent
        if(filterUserExpenses === "All" && filterMonth === "0"){
            filteredExpenseValue = filteredIds.map(IDforVal => entities[IDforVal].valueAusgaben)
            
        }else{
            switch(filterMonth){
                case "0": break;
                default: filteredIds = filteredIds.filter(ausgabenId => (new Date(entities[ausgabenId].boughtDate)).getMonth()+1 === Number(filterMonth) )
            }

            switch (filterUserExpenses) {
                case "All":
                    break;
            
                default:
                    filteredIds = filteredIds.filter(ausgabenId => entities[ausgabenId].username === filterUserExpenses)
                    break;
            }
            
            filteredExpenseValue = filteredIds.map(IDforVal => entities[IDforVal].valueAusgaben)
            
        }


        let valuesDuplicated = filteredIds.map(dupId => entities[dupId])

        if (filterSpecificPurchase){
            tableContent = ids?.length && filteredIds.map(ausgabenId => <Ausgaben key={ausgabenId} ausgabeId={ausgabenId} />)
        }else{
            tableContent = ids?.length && <AusgabenSum key="SumDuplicates" valuesDuplicated={valuesDuplicated} />
        }
        
        const TotalAusgaben = filteredExpenseValue.reduce((a, b) => a + b, 0).toFixed(2)

        const uniqueUsers = Array.from(new Set(FilterUsers))
        uniqueUsers.unshift("All")

        const onFilterUserExpensesChange = e => {
            setFilterUserExpenses(e.target.value)
        }

        const onFilterMonthChange = e => {
            setFilterMonth(e.target.value)
        }

        const onFilterSpecificPurchaseChange = e => {
            setFilterSpecificPurchase(prev => !prev)
        }

        let optionsUsers = uniqueUsers.map(user=>{
            return(
                <option
                    key={user}
                    value={user}
                    >
                        {user}
                    </option>
            )
        })

        let optionsMonths = germanMonths.map( (singleMonth, index) => {
            return(
                <option
                    key = {singleMonth}
                    value = {index}
                    >
                        {singleMonth}
                </option>
            )
        })
    
        

        content = (
            <>
                <div className="filters__ausgabenDisplay">
                    <label className="form__label" htmlFor="filterUser">User Expense</label>
                    <select 
                        id="filterUser"
                        name="filterUser"
                        className="form__select"
                        value={filterUserExpenses}
                        onChange={onFilterUserExpensesChange}
                    >
                        {optionsUsers}
                    </select>

                    <label className="form__label" htmlFor="filterMonth">Month selected</label>
                    <select 
                        id="filterMonth"
                        name="filterMonth"
                        className="form__select"
                        value={filterMonth}
                        onChange={onFilterMonthChange}
                    >
                        {optionsMonths}
                    </select>

                    <div>
                        <input 
                            type="checkbox"
                            id="SpecificPurchase"
                            name="SpecificPurchase"
                            value={filterSpecificPurchase}
                            onChange={onFilterSpecificPurchaseChange}
                            className="form__label"
                            />
                        <label htmlFor="SpecificPurchase">Spezifische Einkäufe</label>
                    </div>
                    
                </div>
                
                
                <div className="table__container">
                    <table className="ausg_table">
                        <thead className="">
                            <tr>
                                <th className="table__th note__status">Spesenname</th>
                                <th className="table__th note__created">Kostenwert</th>
                                <th className="table__th note__updated">Beschreibung</th>
                                <th className="table__th note__title">Kaufdatum</th>
                                <th className="table__th note__username">Nutzer</th>
                                <th className="table__th note__edit">Bearbeiten</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableContent}
                            <tr>
                                <td className="table__cell" data-cell="spesenname">TOTAL</td>
                                <td className="table__cell" data-cell="kostenwert">€{TotalAusgaben}</td>
                                
                            </tr>
                        </tbody>
                    </table>
                </div>
            </>
        )
    }

    return content
}

export default AusgabenList