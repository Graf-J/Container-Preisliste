import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    set: (state, action) => {
      state.user = action.payload;
    },
    clear: (state) => {
        state.user = null;
    }
  },
})

export const { set } = userSlice.actions

export default userSlice.reducer