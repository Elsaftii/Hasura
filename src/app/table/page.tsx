'use client'
import { Box, Button, Divider, Typography } from "@mui/material";
import React, { useEffect } from "react";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import StorageIcon from "@mui/icons-material/Storage";
import FolderIcon from "@mui/icons-material/Folder";
import SimpleTable from "../../components/SimpleTable/SimpleTable";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { selectTable } from "@/store/tableSlice";

export default function TableDisplay() {
  const tables = useSelector((state: RootState) => state.table.tables);
  const dispatch = useDispatch()
  useEffect(()=>{
    if(tables.length>0)
    dispatch(selectTable(tables.slice(-1)[0].id))
  },[dispatch , tables])

  return (
    <>
      <Typography
        sx={{
          color: "grey",
          fontSize: "12px",
          fontWeight: 400,
          baddingTop: "20px",
          display: "flex",
          alignItems: "center",
        }}
      >
        you are here: Data <KeyboardArrowRightIcon sx={{ fontSize: "14px" }} />{" "}
        <StorageIcon sx={{ fontSize: "14px" }} />
        default <KeyboardArrowRightIcon sx={{ fontSize: "14px" }} />{" "}
        <FolderIcon sx={{ fontSize: "14px" }} /> mahmoud{" "}
        <KeyboardArrowRightIcon sx={{ fontSize: "14px" }} />{" "}
      </Typography>
      <Box sx={{ paddingTop: "20px" }}>
        <Button
          variant="contained"
          sx={{
            marginX: "5px",
            backgroundColor: "grey",
            "&:active": { bachgroundColor: "white" },
            "&:focus": { bachgroundColor: "grey" },
            borderRadius: 0,
          }}
        >
          Browse Rows
        </Button>
        <Button
          variant="contained"
          sx={{
            marginX: "5px",
            backgroundColor: "grey",
            "&:active": { bachgroundColor: "white" },
            "&:focus": { bachgroundColor: "grey" },
            borderRadius: 0,
          }}
        >
          Modify
        </Button>
        <Divider />
      </Box>

      <SimpleTable />
    </>
  );
}
