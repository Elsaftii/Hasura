"use client";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import StorageIcon from "@mui/icons-material/Storage";
import FolderIcon from "@mui/icons-material/Folder";
import CalendarViewMonthIcon from "@mui/icons-material/CalendarViewMonth";
import {
  selectTableName,
  updateTable,
  addColumn,
  deleteColumn,
} from "@/store/tableSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import DeleteIcon from "@mui/icons-material/Delete";

export default function TableModify() {
  const [open, setOpen] = React.useState<number | null>(null);
  const [open1, setOpen1] = useState(false);
  const [newColumn, setNewColumn] = useState({
    columnName: "",
    columnType: "",
    defaultValue: "",
    isNullable: false,
    isUnique: false,
  });
  const [columnEdit, setColumnEdit] = React.useState<any>({});
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const tables = useSelector((state: RootState) => state.table.tables);
  const selectedTable = useSelector(
    (state: RootState) => state.table.selectedTable
  );
  const path = usePathname();
  const name = path.split("/", 3).pop();
  React.useEffect(() => {
    if (tables.length > 0) {
      dispatch(selectTableName(name));
    }
  }, [dispatch, tables]);

  const handleAddColumn = () => {
    if (!selectedTable) return;

    const { columnName, columnType } = newColumn;
    if (columnName.trim() === "") {
      toast.error("Column name is required.");
      return;
    }

    if (columnType.trim() === "") {
      toast.error("Column type is required.");
      return;
    }
    const columnExists = selectedTable.columns.some(
      (col) =>
        col.columnName.trim().toLowerCase() === columnName.trim().toLowerCase()
    );

    if (columnExists) {
      toast.error("A column with this name already exists.");
      return;
    }

    const newColumnData = {
      columnName,
      columnType,
      defaultValue: newColumn.defaultValue,
      isNullable: newColumn.isNullable,
      isUnique: newColumn.isUnique,
    };

    dispatch(addColumn({ tableId: selectedTable.id, column: newColumnData }));
    toast.success("Column successfully added");

    setNewColumn({
      columnName: "",
      columnType: "",
      defaultValue: "",
      isNullable: false,
      isUnique: false,
    });

    setOpen1(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewColumn({
      ...newColumn,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelect = (e: React.ChangeEvent<{ value: unknown }>) => {
    setNewColumn({
      ...newColumn,
      columnType: e.target.value as string,
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewColumn({
      ...newColumn,
      [e.target.name]: e.target.checked,
    });
  };

  const handleSelectChange = (
    event: React.ChangeEvent<{ value: unknown }>,
    columnIndex: number
  ) => {
    setColumnEdit((prev: any) => ({
      ...prev,
      [columnIndex]: {
        ...selectedTable?.columns[columnIndex],
        columnType: event.target.value as string,
      },
    }));
  };

  const handleInputChange =
    (columnIndex: number, field: string,event: React.ChangeEvent<HTMLInputElement>) => {
      setColumnEdit((prev: any) => ({
        ...prev,
        [columnIndex]: {
          ...selectedTable?.columns[columnIndex],
          [field]: event.target.value,
        },
      }));
    };

  const handleUpdateTable = () => {
    if (!selectedTable || !columnEdit) return;

    const updatedColumns = selectedTable.columns.map((column, index) => {
      return columnEdit[index] ? { ...column, ...columnEdit[index] } : column;
    });

    const updatedTable = {
      ...selectedTable,
      columns: updatedColumns,
    };

    dispatch(updateTable(updatedTable));
    localStorage.setItem(
      "tableData",
      JSON.stringify(
        tables.map((table) =>
          table.id === updatedTable.id ? updatedTable : table
        )
      )
    );
    toast.success("column updated successfully");

    setOpen(null);
  };

  const handleRemoveColumn = (columnIndex: number) => {
    if (!selectedTable) return;

    dispatch(deleteColumn({ tableId: selectedTable.id, columnIndex }));
    toast.success("Column successfully deleted");
  };

  return (
    <>
      <Typography
        sx={{
          color: "grey",
          fontSize: "12px",
          fontWeight: 400,
          display: "flex",
          alignItems: "center",
        }}
      >
        You are here: Data <KeyboardArrowRightIcon sx={{ fontSize: "14px" }} />{" "}
        <StorageIcon sx={{ fontSize: "14px" }} />
        default <KeyboardArrowRightIcon sx={{ fontSize: "14px" }} />{" "}
        <FolderIcon sx={{ fontSize: "14px" }} /> mahmoud{" "}
        <KeyboardArrowRightIcon sx={{ fontSize: "14px" }} />{" "}
        <CalendarViewMonthIcon sx={{ fontSize: "18px" }} /> {name}
      </Typography>

      <Box sx={{ paddingTop: "20px" }}>
        <Button
          onClick={() => {
            router.push(`/table/${name}`);
          }}
          variant="contained"
          sx={{
            marginX: "5px",
            backgroundColor: "grey",
            "&:active": { backgroundColor: "white" },
            "&:focus": { backgroundColor: "grey" },
            borderRadius: 0,
          }}
        >
          Browse Rows
        </Button>
        <Button
          onClick={() => {
            router.push(`/table/${name}/modify`);
          }}
          variant="contained"
          sx={{ marginX: "5px", borderRadius: 0 }}
        >
          Modify
        </Button>
        <Divider />
      </Box>

      <Box sx={{ marginLeft: "15px" }}>
        <Typography
          sx={{
            color: "#94A3B8",
            fontSize: "12.25",
            fontWeight: 400,
            marginY: "10px",
          }}
        >
          Configure Fields
        </Typography>
        <Typography
          sx={{
            color: "#475569",
            fontSize: "14",
            fontWeight: 400,
            marginBottom: "8px",
          }}
        >
          Columns
        </Typography>

        {selectedTable?.columns.map((column, index) => (
          <Box key={index} sx={{ marginBottom: "20px" }}>
            {open !== index ? (
              <Box
                display="flex"
                alignItems="center"
                justifyContent={"space-between"}
                width={"50%"}
              >
                <Box display="flex" alignItems="center">
                  <Button
                    onClick={() => setOpen(index)}
                    variant="outlined"
                    size="small"
                    sx={{
                      textTransform: "lowercase",
                      color: "grey",
                      outlineColor: "grey",
                      borderColor: "grey",
                    }}
                  >
                    Edit
                  </Button>
                  <Typography
                    sx={{
                      color: "#4D4D4D",
                      fontSize: "14px",
                      fontWeight: 600,
                      marginX: "10px",
                    }}
                  >
                    {column.columnName}
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  sx={{
                    color: "grey",
                    marginRight: "15px",
                    borderColor: "grey",
                    "&:hover": {
                      borderColor: "black",
                    },
                  }}
                  size="small"
                  onClick={() => handleRemoveColumn(index)}
                >
                  <DeleteIcon />
                </Button>
              </Box>
            ) : (
              <Box
                borderColor="grey"
                border={1}
                sx={{
                  width: "90%",
                  padding: "15px",
                  borderRadius: "5px",
                  backgroundColor: "white",
                  marginBottom: "10px",
                }}
              >
                <Button
                  onClick={() => setOpen(null)}
                  variant="outlined"
                  size="small"
                  sx={{
                    textTransform: "lowercase",
                    color: "grey",
                    outlineColor: "grey",
                    borderColor: "grey",
                    marginBottom: "15px",
                  }}
                >
                  Close
                </Button>

                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ marginBottom: "15px" }}
                >
                  <Typography>Name</Typography>
                  <TextField
                    size="small"
                    sx={{ marginRight: "10px" }}
                    defaultValue={column.columnName}
                    onChange={(e)=>{handleInputChange(index, "columnName",e)}}
                  />
                </Box>

                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ marginBottom: "15px" }}
                >
                  <Typography>Type</Typography>
                  <FormControl sx={{ m: 1, minWidth: 225 }}>
                    <InputLabel size="small">column_type</InputLabel>
                    <Select
                      value={columnEdit[index]?.columnType || column.columnType}
                      onChange={(e) => {
                        handleSelectChange(e, index);
                      }}
                      label="column_type"
                      size="small"
                    >
                      <MenuItem value="integer">Integer</MenuItem>
                      <MenuItem value="integer(auto-increment)">
                        Integer (Auto-Increment)
                      </MenuItem>
                      <MenuItem value="boolean">Boolean</MenuItem>
                      <MenuItem value="text">Text</MenuItem>
                      <MenuItem value="numeric">Numeric</MenuItem>
                      <MenuItem value="timestamp">Timestamp</MenuItem>
                      <MenuItem value="time">Time</MenuItem>
                      <MenuItem value="date">Date</MenuItem>
                      <MenuItem value="uuid">UUID</MenuItem>
                      <MenuItem value="jsonb">JSONB</MenuItem>
                      <MenuItem value="bigint">Big Integer</MenuItem>
                      <MenuItem value="oid">OID</MenuItem>
                      <MenuItem value="smallint">Small Integer</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <Button
                  variant="contained"
                  color="warning"
                  sx={{ textTransform: "lowercase", marginRight: "10px" }}
                  onClick={handleUpdateTable}
                >
                  Save
                </Button>
              </Box>
            )}
          </Box>
        ))}
        {!open1 ? (
          <Button
            onClick={() => setOpen1(true)}
            variant="outlined"
            size="small"
            sx={{
              textTransform: "lowercase",
              color: "grey",
              outlineColor: "grey",
              borderColor: "grey",
              marginBottom: "25px",
            }}
          >
            add a new column
          </Button>
        ) : (
          <Box
            borderColor={"grey"}
            border={1}
            sx={{
              width: "90%",
              padding: "15px",
              borderRadius: "5px",
              backgroundColor: "white",
              marginBottom: "10px",
            }}
          >
            <Button
              onClick={() => setOpen1(false)}
              variant="outlined"
              size="small"
              sx={{
                textTransform: "lowercase",
                color: "grey",
                outlineColor: "grey",
                borderColor: "grey",
                marginBottom: "15px",
              }}
            >
              close
            </Button>

            <Box
              display={"flex"}
              alignItems={"center"}
              sx={{ marginBottom: "10px" }}
            >
              <TextField
                id="outlined-basic"
                name="columnName"
                size="small"
                sx={{ marginRight: "10px" }}
                label="column name"
                variant="outlined"
                value={newColumn.columnName}
                onChange={handleChange}
              />
              <FormControl sx={{ mX: 1, minWidth: 225 }}>
                <InputLabel size="small">column_type</InputLabel>
                <Select
                  value={newColumn.columnType}
                  label="column_type"
                  size="small"
                  onChange={(e) => {
                    handleSelect(e);
                  }}
                >
                  <MenuItem value="integer">Integer</MenuItem>
                  <MenuItem value="integer(auto-increment)">
                    Integer (Auto-Increment)
                  </MenuItem>
                  <MenuItem value="boolean">Boolean</MenuItem>
                  <MenuItem value="text">Text</MenuItem>
                  <MenuItem value="numeric">Numeric</MenuItem>
                  <MenuItem value="timestamp">Timestamp</MenuItem>
                  <MenuItem value="time">Time</MenuItem>
                  <MenuItem value="date">Date</MenuItem>
                  <MenuItem value="uuid">UUID</MenuItem>
                  <MenuItem value="jsonb">JSONB</MenuItem>
                  <MenuItem value="bigint">Big Integer</MenuItem>
                  <MenuItem value="oid">OID</MenuItem>
                  <MenuItem value="smallint">Small Integer</MenuItem>
                </Select>
              </FormControl>
              <TextField
                id="outlined-basic"
                name="defaultValue"
                size="small"
                sx={{ marginRight: "10px", marginLeft: "10px" }}
                label="default value"
                variant="outlined"
                value={newColumn.defaultValue}
                onChange={handleChange}
              />
              <FormGroup>
                <FormControlLabel
                  name="isNullable"
                  control={
                    <Checkbox
                      size="small"
                      checked={newColumn.isNullable}
                      onChange={handleCheckboxChange}
                    />
                  }
                  label="Nullable"
                />
              </FormGroup>
              <FormGroup>
                <FormControlLabel
                  name="isUnique"
                  control={
                    <Checkbox
                      size="small"
                      checked={newColumn.isUnique}
                      onChange={handleCheckboxChange}
                    />
                  }
                  label="Unique"
                />
              </FormGroup>
            </Box>
            <Button
              variant="contained"
              color="warning"
              sx={{ textTransform: "lowercase", marginRight: "10px" }}
              onClick={handleAddColumn}
            >
              Save
            </Button>
          </Box>
        )}
      </Box>
    </>
  );
}
