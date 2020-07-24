import { createSlice } from '@reduxjs/toolkit'

const configSlice = createSlice({
  name: 'metamask',
  initialState: {
    userAddress: '',
    network: '',
    balance: {}
  },
  reducers: {
    updateUserAddress(state, action) {
      state.userAddress = action.payload;
    },
    updateNetwork(state, action) {
      state.network = action.payload;
    },
    updateBalance(state, action){
      state.balance = {...state.balance, ...action.payload}
    }
  }
})

const { actions, reducer } = configSlice;

export const { updateUserAddress, updateNetwork, updateBalance } = actions;

export default reducer;
