"use client"
import * as React from 'react';
import { Box, Button, Divider, TextField, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import StorageIcon from '@mui/icons-material/Storage';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from './../../store/store'; 
import { addSchema, removeSchema } from './../../store/schemaSlice'; 
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const Default: React.FC = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [schemaName, setSchemaName] = React.useState<string>('');
  const schemaList = useSelector((state: RootState) => state.schema.schemaList);
  const router = useRouter() 
  const dispatch: AppDispatch = useDispatch();

  const handleCreateSchema = () => {
    if (!schemaName.trim()) {
      toast.error("Schema name is required.");
      return;
    }

    // Check for existing schema with the same name (case-insensitive)
    const schemaExists = schemaList.some(
      (schema) => schema.trim().toLowerCase() === schemaName.trim().toLowerCase()
    );

    if (schemaExists) {
      toast.error("A schema with this name already exists.");
      return;
    }

    // If no duplicate, proceed with adding the schema
    dispatch(addSchema(schemaName));
    toast.success("Schema added successfully");
    setSchemaName('');
    setOpen(false);
  };

  const handleRemoveSchema = (index: number) => {
    dispatch(removeSchema(index));
  };

  return (
    <>
      <Typography sx={{ color: 'grey', fontSize: '12px', fontWeight: 400, marginTop: '20px', display: 'flex', alignItems: 'center' }}>
        you are here: Data <KeyboardArrowRightIcon sx={{ fontSize: '14px' }} /> <StorageIcon sx={{ fontSize: '14px' }} />default
      </Typography>
      <Box display={'flex'} justifyContent={'start'} alignItems={'center'} py={'10px'}>
        <Typography variant='h5' sx={{ fontWeight: 'bold', marginRight: '10px' }}>default</Typography>
        {open ? (
          <>
            <TextField
              id="outlined-basic"
              size='small'
              sx={{ marginRight: '10px' }}
              label="Enter Schema name"
              variant="outlined"
              value={schemaName}
              onChange={(e) => setSchemaName(e.target.value)}
            />
            <Button
              variant="contained"
              color='warning'
              sx={{ textTransform: 'lowercase', marginRight: '10px' }}
              onClick={handleCreateSchema}
            >
              Create Schema
            </Button>
            <Button
              variant="outlined"
              onClick={() => setOpen(false)}
              sx={{
                color: 'grey',
                borderColor: 'grey',
                textTransform: 'lowercase',
                marginRight: '10px',
                '&:hover': {
                  borderColor: 'black',
                },
              }}
            >
              Cancel
            </Button>
          </>
        ) : (
          <Button
            onClick={() => setOpen(true)}
            variant="contained"
            color='warning'
            sx={{ textTransform: 'lowercase', marginRight: '10px' }}
          >
            Create Schema
          </Button>
        )}
      </Box>
      <Divider sx={{ my: '10px' }} />
      {schemaList.map((schema, index) => (<>
        <Box display={'flex'} alignItems={'center'} sx={{ paddingY: '15px' }} key={index}>
          <Button
            variant='outlined'
            sx={{
              color: 'grey',
              borderColor: 'grey',
              textTransform: 'lowercase',
              marginRight: '10px',
              '&:hover': {
                borderColor: 'black',
              },
            }}
            // href={`/${schema}`}
            onClick={()=> {router.push(`/${schema}`)}}
            size="small"
          >
            View
          </Button>
          <Button
            variant='outlined'
            sx={{
              color: 'grey',
              borderColor: 'grey',
              textTransform: 'lowercase',
              marginRight: '10px',
              '&:hover': {
                borderColor: 'black',
              },
            }}
            href='#'
            size="small"
          >
            Permission Summary
          </Button>
          <Button
            variant='outlined'
            sx={{
              color: 'grey',
              marginRight: '15px',
              borderColor: 'grey',
              '&:hover': {
                borderColor: 'black',
              },
            }}
            size="small"
            onClick={() => handleRemoveSchema(index)}
          >
            <DeleteIcon />
          </Button>
          <Typography sx={{ fontWeight: 400, fontSize: '14px', color: 'grey' }} variant='h6'>{schema}</Typography>
      
        </Box>
        <Divider sx={{ my: '10px' }} />
        
      </>))}
      <Typography sx={{ fontWeight: 700, fontSize: '18px', paddingY: '5px' }}>Template Gallery</Typography>
      <Typography sx={{ fontWeight: 400, fontSize: '14px', color: 'grey', paddingY: '5px' }}>
        Templates are a utility for applying pre-created sets of SQL migrations and Hasura metadata.
      </Typography>
      <Typography sx={{ fontWeight: 400, fontSize: '14px', color: 'grey', paddingY: '5px' }}>
        Below are sets of pre-created templates made to help you get up to speed with the functionality of the Hasura platform.
      </Typography>
    </>
  );
}

export default Default;
