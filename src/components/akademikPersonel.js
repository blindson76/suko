import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { useRealmApp } from '../RealmApp';
import { FormControl } from '@material-ui/core';
import { ProvideIdari, useProvideIdari } from '../hooks/idari'
import { useForm } from 'react-hook-form';
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@material-ui/data-grid'

const schema = yup.object().shape({
  email: yup.string().email().required()
});

const columns = [
  { field: '_id', hide: true },
  { field: 'akademik_personel_no', headerName: "No", width: 80 },
  { field: 'adi', headerName: 'Adı', width: 230 },
  { field: 'soyadi', headerName: 'Soy adı', width: 230 },
  { field: 'email', headerName: 'Email', width: 230 },
];


const Page = () => {
  const classes = useStyles();
  const idari = useProvideIdari();
  const [personel, setPersonel] = useState([])
  const [open, setOpen] = useState(false);
  const [enstitu, setEnstitu] = useState([]);

  useEffect(() => {
      (async () => {
          setEnstitu(await idari.listEnstitu())
      })()
  },[])
  const handleOpen = () => {
    setOpen(state => {
      return true
    })
  }
  const CustomToolbar = () => (
    <GridToolbarContainer>
      <GridToolbarExport onClick={handleOpen} />
    </GridToolbarContainer>
  )

  useEffect(() => {
    (async () => {
      setPersonel((await idari.listPersonel()).map(o => { return { ...o, id: o._id } }))
    })()
  }, [])
  const app = useRealmApp()
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });
  const onSubmit = async data => {
    console.log(await idari.createPersonel({
      type: "AKADEMIK",
      password: "123456",
      ...data,
    }))
  };
  const handleClose = () => {
    setOpen(false)
  }
  return (
    <div>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid rows={personel} columns={columns} pageSize={5} checkboxSelection components={{ Toolbar: CustomToolbar }} />
      </div>

      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
        <DialogContent>
          <form noValidate onSubmit={handleSubmit(onSubmit)} id="aform" >
            <div>
              <div>
                <FormControl >
                  <Select
                    labelId="demo-simple-select-label"
                    {...register("enstitu")}
                  >{enstitu.map((e,i) => (
                    <MenuItem key={e._id} value={e._id} >{e.adi}</MenuItem>
                ))}</Select>
                </FormControl>
              </div>
              <TextField
                error={errors.email}
                helperText={errors.email?.message}
                variant="outlined"
                margin="normal"
                label="Email Adresi"
                autoComplete="email"
                autoFocus
                {...register("email")}
              />
            </div>
            <div>
              <TextField
                error={errors.adi}
                helperText={errors.adi?.message}
                variant="outlined"
                margin="normal"
                label="İsim"
                {...register("adi")}
              />
              <TextField
                error={errors.soyadi}
                helperText={errors.soyadi?.message}
                variant="outlined"
                margin="normal"
                name="soyadi"
                label="Soyadı"
                {...register("soyadi")}
              />

              <TextField
                error={errors.akademik_personel_no}
                helperText={errors.akademik_personel_no?.message}
                variant="outlined"
                margin="normal"
                name="akademik_personel_no"
                label="Personel No"
                {...register("akademik_personel_no")}
              />
            </div>

          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
              </Button>
          <Button
            type="submit"
            form="aform"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Kaydet
          </Button>
        </DialogActions>
      </Dialog>

    </div>
  )
}
export default () => {
  return (
    <ProvideIdari>
      <Page />
    </ProvideIdari>
  )

}


const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));