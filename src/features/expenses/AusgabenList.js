import { useGetAusgabenQuery } from "./ausgabenApiSlice";
import Ausgaben from "./Ausgaben"
import useAuth from "../../hooks/useAuth"

const AusgabenList = () => {
    const { username, isManager, isAdmin} = useAuth()

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

    let content

    if (isLoading) content = <p>Loading ausgaben...</p>

    if (isError){
        content = <p className="errmsg">{error?.data?.message}</p>
    }

    if (isSuccess) {
        const {ids, entities } = ausgaben
        let filteredIds
        let filteredExpenseValue
        if (isManager || isAdmin) {
            filteredIds = [...ids]
            filteredExpenseValue = filteredIds.map(IDforVal => entities[IDforVal].valueAusgaben)
        }else{
            filteredIds = ids.filter(ausgabenId => entities[ausgabenId].username === username)
            filteredExpenseValue = filteredIds.map(IDforVal => entities[IDforVal].valueAusgaben)
        }

        const tableContent = ids?.length && filteredIds.map(ausgabenId => <Ausgaben key={ausgabenId} ausgabeId={ausgabenId} />)
        const TotalAusgaben = filteredExpenseValue.reduce((a, b) => a + b, 0).toFixed(2)

        content = (
            <div className="table__container dash-dipers">
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
                            <td className="table__cell" data-cell="kostenwert">{TotalAusgaben}</td>
                            <td className="table__cell" data-cell="beschreibung"></td>
                            <td className="table__cell" data-cell="kaufdatum"></td>
                            <td className="table__cell" data-cell="nutzer"></td>
                            <td className="table__cell" data-cell="bearbeiten"></td>
                         </tr>
                    </tbody>
                </table>
            </div>
            
        )
    }

    return content
}

export default AusgabenList