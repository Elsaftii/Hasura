import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

export interface Column {
  columnName: string;
  columnType: string;
  defaultValue: string;
  isArray?: boolean;
  isNullable: boolean;
  isUnique: boolean;
}

export interface TableState {
  id: string;
  schemaName: string;
  tableName: string;
  tableComment: string;
  columns: Column[];
  primaryKey: string;
  foreignKey: {
    schema: string;
    table: string;
    column: string;
    refColumn: string;
  };
  uniqueKeys: string[];
  checkConstraints: string[];
}

interface TablesState {
  tables: TableState[];
  selectedTable: TableState | null;
}

const initialState: TablesState = {
  tables: JSON.parse(localStorage.getItem("tableData") || "[]"),
  selectedTable: null,
};

const tableSlice = createSlice({
  name: "table",
  initialState,
  reducers: {
    addTable: (state, action: PayloadAction<Omit<TableState, "id">>) => {
      const newTable = { ...action.payload, id: uuidv4() }; // Assign a unique ID to each new table
      state.tables.push(newTable);
      localStorage.setItem("tableData", JSON.stringify(state.tables)); // Save to localStorage
    },
    updateTable: (state, action: PayloadAction<TableState>) => {
      const index = state.tables.findIndex(
        (table) => table.id === action.payload.id
      );
      if (index !== -1) {
        state.tables[index] = action.payload;
        localStorage.setItem("tableData", JSON.stringify(state.tables)); // Save updated table to localStorage
      }
    },
    selectTable: (state, action: PayloadAction<string>) => {
      state.selectedTable =
        state.tables.find((table) => table.id === action.payload) || null;
    },
    selectTableName: (state, action: PayloadAction<string|undefined>) => {
      state.selectedTable =
        state.tables.find((table) => table.tableName === action.payload) || null;
    },
    addColumn: (state, action: PayloadAction<{ tableId: string; column: Column }>) => {
      const table = state.tables.find(table => table.id === action.payload.tableId);
      if (table) {
        table.columns.push(action.payload.column);
        localStorage.setItem("tableData", JSON.stringify(state.tables)); // Save updated table to localStorage
      }
    },
    deleteColumn: (state, action: PayloadAction<{ tableId: string; columnIndex: number }>) => {
      const table = state.tables.find((table) => table.id === action.payload.tableId);
      if (table && action.payload.columnIndex >= 0 && action.payload.columnIndex < table.columns.length) {
        table.columns.splice(action.payload.columnIndex, 1); // Remove column by index
        localStorage.setItem("tableData", JSON.stringify(state.tables)); // Save updated table to localStorage
      }
    },
  },
});

export const { addTable, updateTable, selectTable ,addColumn,selectTableName,deleteColumn} = tableSlice.actions;
export default tableSlice.reducer;
