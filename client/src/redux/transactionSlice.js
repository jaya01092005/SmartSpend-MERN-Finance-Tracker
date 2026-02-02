import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  transactions: [],
  loading: false,
  error: null,
};

export const getTransactions = createAsyncThunk('transactions/getTransactions', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token;
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    const res = await axios.get('/api/transactions', config);
    return res.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.error);
  }
});

export const addTransaction = createAsyncThunk('transactions/addTransaction', async (transactionData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token;
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    const res = await axios.post('/api/transactions', transactionData, config);
    return res.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.error);
  }
});

export const updateTransaction = createAsyncThunk('transactions/updateTransaction', async ({ id, transactionData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const res = await axios.put(`/api/transactions/${id}`, transactionData, config);
      return res.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.error);
    }
  });

export const deleteTransaction = createAsyncThunk('transactions/deleteTransaction', async (id, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token;
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    await axios.delete(`/api/transactions/${id}`, config);
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.error);
  }
});

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTransactions.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
      })
      .addCase(getTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addTransaction.fulfilled, (state, action) => {
        state.transactions.unshift(action.payload);
      })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        const index = state.transactions.findIndex(t => t._id === action.payload._id);
        if (index !== -1) {
            state.transactions[index] = action.payload;
        }
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.transactions = state.transactions.filter(t => t._id !== action.payload);
      });
  },
});

export default transactionSlice.reducer;
