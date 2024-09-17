// store/schemaSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SchemaState {
  schemaList: string[];
}

const initialState: SchemaState = {
  schemaList: JSON.parse(localStorage.getItem('schemas') || '[]'),
};

const schemaSlice = createSlice({
  name: 'schema',
  initialState,
  reducers: {
    setSchemas: (state, action: PayloadAction<string[]>) => {
      state.schemaList = action.payload;
      localStorage.setItem('schemas', JSON.stringify(state.schemaList));
    },
    addSchema: (state, action: PayloadAction<string>) => {
      state.schemaList.push(action.payload);
      localStorage.setItem('schemas', JSON.stringify(state.schemaList));
    },
    removeSchema: (state, action: PayloadAction<number>) => {
      state.schemaList.splice(action.payload, 1);
      localStorage.setItem('schemas', JSON.stringify(state.schemaList));
    },
  },
});

export const { setSchemas, addSchema, removeSchema } = schemaSlice.actions;
export default schemaSlice.reducer;
