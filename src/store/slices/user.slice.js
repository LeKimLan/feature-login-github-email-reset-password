import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        data: null
    },
    reducers: {
        setData: (state, action) => {
            state.data = action.payload;
        },
        removeData: (state) => {
            state.data = null;
        }
    }
})

export const userReducer = userSlice.reducer;
export const userAction = userSlice.actions;