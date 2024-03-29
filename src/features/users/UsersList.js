import { useGetUsersQuery } from "./usersApiSlice"
import User from "./User"

const UsersList = () => {

    const {
        data: users,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetUsersQuery('usersList', {
        pollingInterval: 60000,
        refetchOnFocus: true, // if loking to another window and come back it will refresh data
        refetchOnMountOrArgChange: true // if there are changes it will refresh the data
    })

    let content

    if (isLoading) content = <p>Loading...</p>

    if (isError) content = <p className="errmsg">{error?.data?.message}</p>

    if(isSuccess) {
        const { ids } = users

        const tableContent = ids?.length && ids.map(userId => <User key={userId} userId={userId} />)

        content = (
            <div className="table__container">
                <table className="ausg_table">
                    <thead className="">
                        <tr>
                            <th scope="col" className="table__th user__username">Username</th>
                            <th scope="col" className="table__th user__roles">Roles</th>
                            <th scope="col" className="table__th user__edit">Edit</th>
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

export default UsersList