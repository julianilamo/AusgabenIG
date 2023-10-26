import { createSlice } from "@reduxjs/toolkit";

const apiSlice = createSlice({
    name: 'auth',
    initialState: {token: null},
    reducers:{
        setCredentials: (state, action) =>{
            const { accessToken } = action.payload
            state.token = accessToken
        },
        logOut: (state, action) =>{
            state.token = null
        },
    }
})

export const { setCredentials, logOut } = apiSlice.actions

export default apiSlice.reducer

export const selectCurrentToken = (state) => state.auth.token