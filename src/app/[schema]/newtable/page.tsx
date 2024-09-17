"use client";
import { FormControl, InputLabel, MenuItem } from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import InfoIcon from "@mui/icons-material/Info";
import { AppDispatch, RootState } from "./../../../store/store";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTable, TableState } from "./../../../store/tableSlice";
import {
  Box,
  Button,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
  FormGroup,
} from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import { SchemaState } from "@/store/schemaSlice";

export default function NewTable() {
  const router = useRouter();
  const path = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  const [open, setOpen] = useState(false);
  const [uniqueKeyOpen, setUniqueKeyOpen] = useState(false);
  const [checkOpen, setCheckOpen] = useState(false);
  const tables = useSelector((state: RootState) => state.table);
  const {schemaList} = useSelector((state:RootState) => state.schema);
  // const schemaExists = schemas.schemaList.some(
  //   (schema: SchemaState) =>
  //     schema.schemaList.toLowerCase() 
  // // );
  // const schemaName = schemaList.some((schema=>schema.trim()))
  // console.log(schemaName);
  
  
  const [tableData, setTableData] = useState<TableState>({
    id: uuidv4(),
    schemaName: `${path.split("/", 2).pop()}`,
    tableName: "",
    tableComment: "",
    columns: [
      {
        columnName: "",
        columnType: "",
        defaultValue: "",
        isArray: false,
        isNullable: false,
        isUnique: false,
      },
    ],
    primaryKey: "",
    foreignKey: {
      schema: "",
      table: "",
      column: "",
      refColumn: "",
    },
    uniqueKeys: [],
    checkConstraints: [],
  });

  const handleChange = (
    field: keyof TableState,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setTableData({ ...tableData, [field]: e.target.value });
  };

  const handleColumnChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | SelectChangeEvent
    >,
    index: number,
    field: keyof TableState["columns"][0]
  ) => {
    const newColumns = [...tableData.columns];
    if (e.target?.type === "checkbox") {
      newColumns[index][field] = e.target.checked as boolean;
    } else {
      newColumns[index][field] = e.target.value; // Text input or select
    }

    setTableData({ ...tableData, columns: newColumns });
  };

  // Function to add a new column
  const handleAddColumn = () => {
    setTableData({
      ...tableData,
      columns: [
        ...tableData.columns,
        {
          columnName: "",
          columnType: "",
          defaultValue: "",
          isArray: false,
          isNullable: false,
          isUnique: false,
        },
      ],
    });
  };

const handleSave = () => {
  const hasTableName = tableData.tableName.trim() !== "";
  const hasValidColumn = tableData.columns.every(
    (col) => col.columnName.trim() !== "" && col.columnType.trim() !== ""
  );

  if (!hasTableName) {
    toast.error("Table name is required.");
    return;
  }

  if (!hasValidColumn) {
    toast.error("Each column must have a name and a type.");
    return;
  }

  // Check for existing table with the same name AND schemaName
  const tableExists = tables.tables.some(
    (table: TableState) =>
      table.tableName.trim().toLowerCase() ===
        tableData.tableName.trim().toLowerCase() &&
      table.schemaName.trim().toLowerCase() ===
        tableData.schemaName.trim().toLowerCase()
  );

  if (tableExists) {
    toast.error(
      "A table with this name and schema already exists. Please choose a different name or schema."
    );
    return;
  }

  dispatch(addTable(tableData));
  toast.success("Table added successfully");
  router.push(`/${tableData.schemaName}/${tableData.tableName}`);
};

  return (
    <>
      <Box sx={{ paddingY: "25px", paddingLeft: "20px" }}>
        <Box sx={{ paddingBottom: "20px" }}>
          <Typography
            variant="h5"
            sx={{ fontWeight: 600, color: "#4D4D4D", marginBottom: "20px" }}
          >
            Add a New Table
          </Typography>
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: 600,
              color: "#4D4D4D",
              paddingBottom: "5px",
            }}
          >
            Table Name
          </Typography>
          <TextField
            required
            value={tableData.tableName}
            onChange={(e) => {
              handleChange("tableName", e);
            }}
            size="small"
            sx={{ marginRight: "10px", width: "50%", marginBottom: "15px" }}
            label="table_name"
            variant="outlined"
          />
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: 600,
              color: "#4D4D4D",
              paddingBottom: "5px",
            }}
          >
            Table Comment
          </Typography>
          <TextField
            value={tableData.tableComment}
            onChange={(e) => {
              handleChange("tableComment", e);
            }}
            size="small"
            sx={{ marginRight: "10px", width: "50%", marginBottom: "15px" }}
            label="comment"
            variant="outlined"
          />
        </Box>

        <Box sx={{ paddingBottom: "20px" }}>
          <Typography
            sx={{
              fontSize: "12.25px",
              fontWeight: 600,
              color: "#94A3B8",
              paddingBottom: "10px",
            }}
          >
            CONFIGURE FIELDS
          </Typography>
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: 600,
              color: "#475569",
              paddingBottom: "5px",
            }}
          >
            Columns <InfoIcon sx={{ fontSize: "13px", marginLeft: "5px" }} />
          </Typography>

          {tableData.columns.map((column, index) => (
            <Box key={index} display={"flex"} alignItems={"center"}>
              <TextField
                value={column.columnName}
                onChange={(e) => {
                  handleColumnChange(e, index, "columnName");
                }}
                size="small"
                sx={{ marginRight: "10px", marginBottom: "15px", width: "15%" }}
                label="column_name"
                variant="outlined"
              />
              <Box sx={{ width: "15%" }}>
                <FormControl fullWidth>
                  <InputLabel size="small">column_type</InputLabel>
                  <Select
                    value={column.columnType}
                    onChange={(e) => {
                      handleColumnChange(e, index, "columnType");
                    }}
                    size="small"
                    sx={{ marginRight: "10px", marginBottom: "15px" }}
                  >
                    <MenuItem value="integer">integer</MenuItem>
                    <MenuItem value="integer(auto-increment)">
                      integer(auto-increment)
                    </MenuItem>
                    <MenuItem value="boolean">boolean</MenuItem>
                    <MenuItem value="text">text</MenuItem>
                    <MenuItem value="numeric">numeric</MenuItem>
                    <MenuItem value="timestamp">timestamp</MenuItem>
                    <MenuItem value="time">time</MenuItem>
                    <MenuItem value="Date">Date</MenuItem>
                    <MenuItem value="UUID">UUID</MenuItem>
                    <MenuItem value="JSONB">JSONB</MenuItem>
                    <MenuItem value="Big integer">Big integer</MenuItem>
                    <MenuItem value="Oid">Oid</MenuItem>
                    <MenuItem value="bigint">bigint</MenuItem>
                    <MenuItem value="smallint">smallint</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <FormGroup>
                <FormControlLabel
                  checked={tableData.columns[index].isArray}
                  onChange={(e) => {
                    handleColumnChange(e, index, "isArray");
                  }}
                  control={<Checkbox size="small" />}
                  label="Array"
                />
              </FormGroup>
              <TextField
                value={column.defaultValue}
                onChange={(e) => {
                  handleColumnChange(e, index, "defaultValue");
                }}
                size="small"
                sx={{ marginRight: "10px", marginBottom: "15px", width: "15%" }}
                label="default_value"
                variant="outlined"
              />
              <FormGroup>
                <FormControlLabel
                  checked={tableData.columns[index].isNullable}
                  onChange={(e) => {
                    handleColumnChange(e, index, "isNullable");
                  }}
                  control={<Checkbox size="small" />}
                  label="Nullable"
                />
              </FormGroup>
              <FormGroup>
                <FormControlLabel
                  checked={tableData.columns[index].isUnique}
                  onChange={(e) => {
                    handleColumnChange(e, index, "isUnique");
                  }}
                  control={<Checkbox size="small" />}
                  label="Unique"
                />
              </FormGroup>
            </Box>
          ))}

          {/* Button to add a new column */}
          <Button
            variant="outlined"
            size="small"
            onClick={handleAddColumn}
            sx={{
              textTransform: "lowercase",
              color: "grey",
              outlineColor: "grey",
              borderColor: "grey",
              marginRight: "8px",
            }}
          >
            +
          </Button>
        </Box>
        <Box sx={{ paddingBottom: "10px" }}>
          <Typography
            sx={{
              fontSize: "12.25px",
              fontWeight: 600,
              color: "#94A3B8",
              paddingBottom: "10px",
            }}
          >
            Table Properties
          </Typography>
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: 600,
              color: "#475569",
              paddingBottom: "5px",
            }}
          >
            Primary Key{" "}
            <InfoIcon sx={{ fontSize: "13px", marginLeft: "5px" }} />
          </Typography>
        </Box>
        <Box sx={{ width: "50%", paddingBottom: "20px" }}>
          <FormControl fullWidth>
            <InputLabel size="small" id="demo-simple-select-label">
              --select--
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="column"
              size="small"
              value={tableData.primaryKey}
            >
              <MenuItem>{tableData.tableName}</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: 600,
            color: "#475569",
            paddingBottom: "5px",
          }}
        >
          Foreign Key <InfoIcon sx={{ fontSize: "13px", marginLeft: "5px" }} />
        </Typography>
        {open == false ? (
          <>
            {" "}
            <Box
              display={"flex"}
              alignItems={"center"}
              sx={{ paddingBottom: "20px" }}
            >
              <Button
                onClick={() => {
                  setOpen(true);
                }}
                variant="outlined"
                size="small"
                sx={{
                  textTransform: "lowercase",
                  color: "grey",
                  outlineColor: "grey",
                  borderColor: "grey",
                  marginRight: "8px",
                }}
              >
                Add a foreign key
              </Button>
              <Typography
                sx={{
                  color: "#475569",
                  fontSize: "12.25px",
                  fontWeight: 400,
                  fontStyle: "italic",
                }}
              >
                (You can add foreign keys later as well)
              </Typography>
            </Box>
          </>
        ) : (
          <>
            {" "}
            <Box
              borderColor={"grey"}
              border={1}
              sx={{
                width: "60%",
                padding: "15px",
                borderRadius: "5px",
                backgroundColor: "white",
                marginBottom: "10px",
              }}
            >
              <Button
                onClick={() => {
                  setOpen(false);
                }}
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
              <Typography
                sx={{
                  color: "#475569",
                  fontSize: "14px",
                  fontWeight: 600,
                  paddingBottom: "10px",
                }}
              >
                Reference Schema:
              </Typography>
              <Box sx={{ width: "70%", marginBottom: "20px" }}>
                <FormControl fullWidth>
                  <InputLabel size="small" id="demo-simple-select-label">
                    public
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={tableData.schemaName}
                    label="public"
                    size="small"
                  >
                    <MenuItem value={10}>public</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Typography
                sx={{
                  color: "#475569",
                  fontSize: "14px",
                  fontWeight: 600,
                  paddingBottom: "10px",
                }}
              >
                Reference Table:
              </Typography>
              <Box sx={{ width: "70%", marginBottom: "20px" }}>
                <FormControl fullWidth>
                  <InputLabel size="small" id="demo-simple-select-label">
                    --Reference Table--
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={tableData.schemaName}
                    label="public"
                    size="small"
                  >
                    <MenuItem value={10}>User</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box display={"flex"} alignItems={"center"}>
                <Box width={"40%"} sx={{ marginRight: "10px" }}>
                  <Typography
                    sx={{
                      color: "#475569",
                      fontSize: "14px",
                      fontWeight: 600,
                      paddingBottom: "10px",
                    }}
                  >
                    From:
                  </Typography>
                  <Box sx={{ width: "100%", marginBottom: "20px" }}>
                    <FormControl fullWidth>
                      <InputLabel size="small" id="demo-simple-select-label">
                        --column--
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="public"
                        size="small"
                      ></Select>
                    </FormControl>
                  </Box>
                </Box>
                <Box width={"40%"} sx={{ marginRight: "10px" }}>
                  <Typography
                    sx={{
                      color: "#475569",
                      fontSize: "14px",
                      fontWeight: 600,
                      paddingBottom: "10px",
                    }}
                  >
                    To:
                  </Typography>
                  <Box sx={{ width: "100%", marginBottom: "20px" }}>
                    <FormControl fullWidth>
                      <InputLabel size="small" id="demo-simple-select-label">
                        --ref_column--
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="public"
                        size="small"
                      >
                        <MenuItem value={10}>User</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Box>
              </Box>
            </Box>
          </>
        )}

        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: 600,
            color: "#475569",
            paddingBottom: "5px",
          }}
        >
          Unique Key <InfoIcon sx={{ fontSize: "13px", marginLeft: "5px" }} />
        </Typography>
        {uniqueKeyOpen == false ? (
          <>
            <Box
              display={"flex"}
              alignItems={"center"}
              sx={{ paddingBottom: "20px" }}
            >
              <Button
                onClick={() => {
                  setUniqueKeyOpen(true);
                }}
                variant="outlined"
                size="small"
                sx={{
                  textTransform: "lowercase",
                  color: "grey",
                  outlineColor: "grey",
                  borderColor: "grey",
                  marginRight: "8px",
                }}
              >
                Add a foreign key
              </Button>
              <Typography
                sx={{
                  color: "#475569",
                  fontSize: "12.25px",
                  fontWeight: 400,
                  fontStyle: "italic",
                }}
              >
                (You can add unique keys later as well)
              </Typography>
            </Box>
          </>
        ) : (
          <>
            <Box
              borderColor={"grey"}
              border={1}
              sx={{
                width: "60%",
                padding: "15px",
                borderRadius: "5px",
                backgroundColor: "white",
                marginBottom: "10px",
              }}
            >
              <Button
                onClick={() => {
                  setUniqueKeyOpen(false);
                }}
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
              <Typography
                sx={{
                  color: "#475569",
                  fontSize: "14px",
                  fontWeight: 600,
                  paddingBottom: "10px",
                }}
              >
                Unique Keys:
              </Typography>
              <Box sx={{ width: "70%", marginBottom: "20px" }}>
                <FormControl fullWidth>
                  <InputLabel size="small" id="demo-simple-select-label">
                    --select--
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={tableData.schemaName}
                    label="--select--"
                    size="small"
                  >
                    <MenuItem value={10}>--select--</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Button
                variant="contained"
                color="warning"
                sx={{ textTransform: "lowercase", marginRight: "10px" }}
              >
                save
              </Button>
            </Box>
          </>
        )}
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: 600,
            color: "#475569",
            paddingBottom: "5px",
          }}
        >
          Check Constraints{" "}
          <InfoIcon sx={{ fontSize: "13px", marginLeft: "5px" }} />
        </Typography>
        {checkOpen == false ? (
          <>
            {" "}
            <Box
              display={"flex"}
              alignItems={"center"}
              sx={{ paddingBottom: "20px" }}
            >
              <Button
                onClick={() => {
                  setCheckOpen(true);
                }}
                variant="outlined"
                size="small"
                sx={{
                  textTransform: "lowercase",
                  color: "grey",
                  outlineColor: "grey",
                  borderColor: "grey",
                  marginRight: "8px",
                }}
              >
                Add a check constrain
              </Button>
              <Typography
                sx={{
                  color: "#475569",
                  fontSize: "12.25px",
                  fontWeight: 400,
                  fontStyle: "italic",
                }}
              >
                (You can add check Check Constraints later as well)
              </Typography>
            </Box>
          </>
        ) : (
          <>
            <Box
              borderColor={"grey"}
              border={1}
              sx={{
                width: "60%",
                padding: "15px",
                borderRadius: "5px",
                backgroundColor: "white",
                marginBottom: "10px",
              }}
            >
              <Button
                onClick={() => {
                  setCheckOpen(false);
                }}
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
              <Typography
                sx={{
                  color: "#475569",
                  fontSize: "14px",
                  fontWeight: 600,
                  paddingBottom: "10px",
                }}
              >
                Constraint Name:
              </Typography>
              <TextField
                id="outlined-basic"
                size="small"
                sx={{ marginRight: "10px", width: "70%", marginBottom: "15px" }}
                variant="outlined"
              />
            </Box>
          </>
        )}
        <Button
          onClick={handleSave}
          variant="contained"
          color="warning"
          sx={{ textTransform: "lowercase", marginRight: "10px" }}
        >
          Add Table
        </Button>
      </Box>
    </>
  );
}
