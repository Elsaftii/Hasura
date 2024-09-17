"use client";
import { Box, Button, Divider, Typography } from "@mui/material";
import React from "react";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import StorageIcon from "@mui/icons-material/Storage";
import FolderIcon from "@mui/icons-material/Folder";
import CalendarViewMonthIcon from "@mui/icons-material/CalendarViewMonth";
import SimpleTable from "../../../components/SimpleTable/SimpleTable";
import { AppDispatch, RootState } from "@/store/store";
import { selectTableName } from "@/store/tableSlice";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

export default function TableDisplay() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const tables = useSelector((state: RootState) => state.table.tables);
  const path = usePathname();
  const name = path.split("/", 3).pop();
  React.useEffect(() => {
    if (tables.length > 0) {
      dispatch(selectTableName(name));
    }
  }, [dispatch, tables]);

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
        <CalendarViewMonthIcon sx={{ fontSize: "18px" }} /> {name}{" "}
      </Typography>
      <Box sx={{ paddingTop: "20px" }}>
        <Button
          // href={`/table/${name}/brows`}
          onClick={() => {
            router.push(`/table/${name}/brows`);
          }}
          variant="contained"
          sx={{ marginX: "5px", borderRadius: 0 }}
        >
          Browse Rows
        </Button>
        <Button
          // href={`/table/${name}/modify`}
          onClick={() => {
            router.push(`/table/${name}/modify`);
          }}
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
