"use client";
import { AppDispatch, RootState } from "@/store/store";
import { selectTableName } from "@/store/tableSlice";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { usePathname } from "next/navigation";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

export default function SimpleTable() {
  const selectedTable = useSelector((state: RootState) => state.table.selectedTable);
  const dispatch = useDispatch<AppDispatch>();

  const tables = useSelector((state: RootState) => state.table.tables);
  const path = usePathname()
  const name = path.split("/", 3).pop()
  React.useEffect(() => {
    if (tables.length > 0) {
      dispatch(selectTableName(name)); 
    }
  }, [dispatch, tables]);
  
  return (
    <TableContainer
      component={Paper}
      sx={{ marginTop: "25px", width: "60%" }}
    >
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            {selectedTable?.columns.map((column, index) => (
              <TableCell key={index}>{column.columnName}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {/* Add row rendering logic here if needed */}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
