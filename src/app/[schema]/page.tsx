"use client";
import { Typography, Box, Button, Divider } from "@mui/material";
import React from "react";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import StorageIcon from "@mui/icons-material/Storage";
import FolderIcon from "@mui/icons-material/Folder";
import { useParams, useRouter } from "next/navigation";
import { removeSchema } from "@/store/schemaSlice";
import { RootState, AppDispatch } from "@/store/store";
import { useSelector, useDispatch } from "react-redux";

export default function Public() {
  const schemaList = useSelector((state: RootState) => state.schema.schemaList);
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();

  let params = useParams();
  let paramsIndex: number;
  schemaList.map((schema, index) =>
    schema === params.schema ? (paramsIndex = index) : undefined
  );
  const handleRemoveSchema = (index: number) => {
    dispatch(removeSchema(index));
    router.push("/default");
  };

  return (
    <>
      <Typography
        sx={{
          color: "grey",
          fontSize: { xs: "10px", sm: "12px" },
          fontWeight: 400,
          paddingTop: { xs: "10px", sm: "20px" },
          display: "flex",
          alignItems: "center",
        }}
      >
        you are here: Data <KeyboardArrowRightIcon sx={{ fontSize: "14px" }} />{" "}
        <StorageIcon sx={{ fontSize: "14px" }} />
        default <KeyboardArrowRightIcon sx={{ fontSize: "14px" }} />{" "}
        <FolderIcon sx={{ fontSize: "14px" }} /> {params.schema}
      </Typography>
      <Box
        display={"flex"}
        justifyContent={{ xs: "center", sm: "start" }}
        alignItems={"center"}
        flexDirection={{ xs: "column", sm: "row" }}
        py={"10px"}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            marginRight: { sm: "10px", xs: "0px" },
            fontSize: { xs: "18px", sm: "24px" },
          }}
        >
          {params.schema}
        </Typography>
        <Button
          variant="contained"
          // href={`/${params.schema}/newtable`}
          onClick={()=>{router.push(`/${params.schema}/newtable`)}}
          color="warning"
          sx={{
            textTransform: "lowercase",
            marginRight: { sm: "10px", xs: "0px" },
            marginTop: { xs: "10px", sm: "0px" },
            fontSize: { xs: "10px", sm: "13px" },
          }}
        >
          <AddCircleIcon sx={{ fontSize: "13px", marginRight: "4px" }} />
          Create Table
        </Button>
      </Box>
      <Divider sx={{ my: "10px" }} />
      <Box
        display={"flex"}
        alignItems={"center"}
        flexDirection={{ xs: "column", sm: "row" }}
        sx={{ paddingY: "15px" }}
      >
        <Typography
          sx={{
            fontSize: { xs: "12px", sm: "14px" },
            fontWeight: 400,
            marginRight: { sm: "25px", xs: "0px" },
            marginBottom: { xs: "10px", sm: "0px" },
          }}
        >
          Database Schema :
        </Typography>
        <Button
          onClick={() => {
            handleRemoveSchema(paramsIndex);
          }}
          variant="outlined"
          size="small"
          sx={{
            textTransform: "lowercase",
            marginRight: "10px",
            color: "grey",
            borderColor: "black",
            "&:hover": {
              borderColor: "black",
            },
            fontSize: { xs: '10px', sm: '12px' },
            width: { xs: '100%', sm: 'auto' },
          }}
        >
          Delete schema
        </Button>
        <Button
          href="/default"
          variant="outlined"
          size="small"
          sx={{
            textTransform: "lowercase",
            marginRight: "10px",
            color: "grey",
            borderColor: "black",
            "&:hover": {
              borderColor: "black",
            },
            fontSize: { xs: '10px', sm: '12px' },
            width: { xs: '100%', sm: 'auto' },
          }}
        >
          create new schema
        </Button>
        <Button
          variant="outlined"
          size="small"
          sx={{
            textTransform: "lowercase",
            marginRight: "10px",
            color: "grey",
            borderColor: "black",
            "&:hover": {
              borderColor: "black",
            },
            fontSize: { xs: '10px', sm: '12px' },
            width: { xs: '100%', sm: 'auto' },
          }}
        >
          show Permission summary
        </Button>
      </Box>
      <Divider sx={{ my: "10px" }} />
    </>
  );
}
