import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  budgets: [],
  loading: false,
  error: null,
};

export const getBudgets = createAsyncThunk('budgets/getBudgets', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token;
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    const res = await axios.get('/api/budgets', config);
    return res.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.error);
  }
});

export const addBudget = createAsyncThunk('budgets/addBudget', async (budgetData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token;
    const config = {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
    const res = await axios.post('/api/budgets', budgetData, config);
    return res.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.error);
  }
});

export const deleteBudget = createAsyncThunk('budgets/deleteBudget', async (id, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token;
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    await axios.delete(`/api/budgets/${id}`, config);
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.error);
  }
});

const budgetSlice = createSlice({
  name: 'budgets',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getBudgets.pending, (state) => {
        state.loading = true;
      })
      .addCase(getBudgets.fulfilled, (state, action) => {
        state.loading = false;
        state.budgets = action.payload;
      })
      .addCase(getBudgets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addBudget.fulfilled, (state, action) => {
        state.budgets.push(action.payload);
      })
      .addCase(deleteBudget.fulfilled, (state, action) => {
        state.budgets = state.budgets.filter((budget) => budget._id !== action.payload);
      });
  },
});

export default budgetSlice.reducer;
