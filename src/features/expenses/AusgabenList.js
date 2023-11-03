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
        if (isManager || isAdmin) {
            filteredIds = [...ids]
        }else{
            filteredIds = ids.filter(ausgabenId => entities[ausgabenId].userAusgaben === username)
        }

        const tableContent = ids?.length && filteredIds.map(ausgabenId => <Ausgaben key={ausgabenId} ausgabeId={ausgabenId} />)

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
                    </tbody>
                </table>
            </div>
            
        )
    }

    return content
}

export default AusgabenList