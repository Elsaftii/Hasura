"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Link from "next/link";
import StorageIcon from "@mui/icons-material/Storage";
import FolderIcon from "@mui/icons-material/Folder";
import CalendarViewMonthIcon from "@mui/icons-material/CalendarViewMonth";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { selectTable } from "@/store/tableSlice";

const drawerWidth = 270;

export default function SideBar() {
  let schemaList = useSelector((state: RootState) => state.schema.schemaList); //array
  const storedData = useSelector((state: RootState) => state.table.tables); // array of tables from Redux store
  const dispatch = useDispatch();
  const handleSelectTable = (tableId: string) => {
    dispatch(selectTable(tableId));
  };
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Typography
          sx={{
            paddingY: "15px",
            paddingLeft: "20px",
            backgroundColor: "#FFF3D5",
            fontWeight: "700",
            color: "#767E93",
          }}
        >
          Data Manager
        </Typography>
        <Divider />
        <Link
          href="/default"
          style={{
            color: "inherit",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            paddingLeft: "40px",
            paddingTop: "15px",
            fontWeight: "bold",
            fontSize: "16px",
          }}
        >
          {/* <KeyboardArrowDownIcon sx={{ paddingRight: "8px" }} />{" "} */}
          <StorageIcon sx={{ fontSize: "18px" }} /> default
        </Link>
        {schemaList.map((schema, index) => {
          const schemaTables = storedData.filter(
            (stored) => stored.schemaName === schema
          );
          return (
            <>
              <Link
                key={index}
                href={`/${schema}`}
                style={{
                  color: "inherit",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: "60px",
                  paddingTop: "8px",
                  fontWeight: "bold",
                  fontSize: "14px",
                }}
              >
                {" "}
                {/* <ExpandMore sx={{ paddingRight: "8px" }} />{" "} */}
                <FolderIcon sx={{ fontSize: "18px" }} /> {schema}
              </Link>

              {schemaTables.map((table: any, index) => {
                return (
                  <>
                    {" "}
                    <Box
                      key={index}
                      sx={{
                        paddingLeft: "40px",
                        paddingRight: "5px",
                        paddingTop: "8px",
                      }}
                    >
                      <Link
                        href={`/table/${table.tableName}`}
                        style={{
                          color: "inherit",
                          textDecoration: "none",
                          display: "flex",
                          alignItems: "center",
                          paddingLeft: "45px",
                          fontWeight: "400",
                          fontSize: "14px",
                          cursor: "pointer",
                        }}
                        onClick={() => handleSelectTable(table.id)}
                      >
                        {" "}
                        <CalendarViewMonthIcon sx={{ fontSize: "18px" }} />{" "}
                        {table.tableName}
                      </Link>
                      {/* <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          paddingLeft: "45px",
                          paddingTop: "8px",
                          fontWeight: "400",
                          fontSize: "14px",
                          "&:active": { color: "#FD9540" },
                          "&:focus": { color: "#FD9540" },
                          curser: "pointer",
                        }}
                        onClick={() => handleSelectTable(table.id)}
                      >
                        {" "}
                        <CalendarViewMonthIcon sx={{ fontSize: "18px" }} />{" "}
                        {table.tableName}
                      </Box> */}
                    </Box>
                  </>
                );
              })}
              {schemaTables.length === 0 ? (
                <Typography
                  sx={{
                    paddingLeft: "45px",
                    paddingTop: "8px",
                    fontSize: "14px",
                    color: "#767E93",
                    fontStyle: "italic",
                    fontWeight: "400",
                  }}
                >
                  No tables or views in the schema
                </Typography>
              ) : null}
            </>
          );
        })}
      </Drawer>
    </Box>
  );
}
