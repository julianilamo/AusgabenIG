import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit"
import { apiSlice } from "../../app/api/apiSlice"

const ausgabenAdapter = createEntityAdapter({})

const initialState = ausgabenAdapter.getInitialState()

export const ausgabenApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getAusgaben: builder.query({
            query: () => ({
                url:'/ausgaben',
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            //keepUnusedDataFor: 5, // Can be removed later if data is needed for longer
            transformResponse: responseData => {
                const loadAusgaben = responseData.map(ausgabe => {
                    ausgabe.id = ausgabe._id
                    return ausgabe
                });
                return ausgabenAdapter.setAll(initialState, loadAusgaben)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids){
                    return[
                        { type: 'Ausgabe', id: 'LIST'},
                        ...result.ids.map(id => ({ type: 'Ausgaben', id}))
                    ]
                }else return [{ type: 'Ausgabe', id: 'LIST'}]
            }
        }),
        addNewAusgaben: builder.mutation({
            query: initialAusgabenData => ({
                url: '/ausgaben',
                method: 'POST',
                body:{
                    ...initialAusgabenData,
                }
            }),
            invalidatesTags:[
                {type: 'Ausgabe', id: "LIST"}
            ]
        }),
        updateAusgaben: builder.mutation({
            query: initialAusgabenData => ({
                url: '/ausgaben',
                method: 'PATCH',
                body: {
                    ...initialAusgabenData,
                }
            }),

            invalidatesTags: (result, error, arg) =>[
                 { type: 'Ausgabe', id: arg.id }
            ]
        }),
        deleteAusgaben: builder.mutation({
            query: ({ id }) => ({
                url: `/ausgaben`,
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [
                {type: 'Ausgabe', id: arg.id}
            ]
        }),
    }),
})

export const {
    useGetAusgabenQuery,
    useAddNewAusgabenMutation,
    useUpdateAusgabenMutation,
    useDeleteAusgabenMutation,
} = ausgabenApiSlice

// returns the query result object
export const selectAusgabenResult = ausgabenApiSlice.endpoints.getAusgaben.select()

// creates memoized selector
const selectAusgabenData = createSelector(
    selectAusgabenResult,
    ausgabenResult => ausgabenResult.data // normalized state object with ids & entities
)

// getSelectors creates these selector and we rename them with aliases using destructuring
export const {
    selectAll: selectAllAusgaben,
    selectById: selectAusgabeById,
    selectIds: selectAusgabeByIds
    // Pass in aselector that returns the users slice of state
} = ausgabenAdapter.getSelectors(state => selectAusgabenData(state)?? initialState)