import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  cards: [],
  loading: false,
  error: null,
};

export const getCards = createAsyncThunk('cards/getCards', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token;
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    const res = await axios.get('/api/cards', config);
    return res.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.error);
  }
});

export const addCard = createAsyncThunk('cards/addCard', async (cardData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token;
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    const res = await axios.post('/api/cards', cardData, config);
    return res.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.error);
  }
});

export const deleteCard = createAsyncThunk('cards/deleteCard', async (id, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token;
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    await axios.delete(`/api/cards/${id}`, config);
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.error);
  }
});

const cardSlice = createSlice({
  name: 'cards',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCards.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCards.fulfilled, (state, action) => {
        state.loading = false;
        state.cards = action.payload;
      })
      .addCase(getCards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addCard.fulfilled, (state, action) => {
        state.cards.unshift(action.payload);
      })
      .addCase(deleteCard.fulfilled, (state, action) => {
        state.cards = state.cards.filter(c => c._id !== action.payload);
      });
  },
});

export default cardSlice.reducer;
