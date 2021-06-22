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
import { FormControl, IconButton } from '@material-ui/core';
import { ProvideIdari, useProvideIdari } from '../hooks/idari'
import { useForm } from 'react-hook-form';
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@material-ui/data-grid'
import PersonAdd from '@material-ui/icons/PersonAdd';

const schema = yup.object().shape({
  email: yup.string().email().required()
});

const columns = [
  { field: '_id', hide: true },
  { field: 'ogenci_no', headerName: "No", width: 80 },
  { field: 'adi', headerName: 'Adı', width: 230 },
  { field: 'soyadi', headerName: 'Soy adı', width: 230 },
  { field: 'email', headerName: 'Email', width: 230 },
  { field: 'bolum', headerName: 'Bölüm', width: 230 },
];


const Page = () => {
  const classes = useStyles();
  const idari = useProvideIdari();
  const [ogrenci, setOgrenci] = useState([])
  const [open, setOpen] = useState(false);
  const [bolum, setBolum] = useState([]);

  useEffect(() => {
      (async () => {
          setBolum(await idari.listBolum())
      })()
  },[])
  const handleOpen = () => {
    setOpen(state => {
      return true
    })
  }
  const CustomToolbar = () => (
    <GridToolbarContainer>      
      <IconButton color="primary" aria-label="add to shopping cart">
        <PersonAdd  onClick={handleOpen} />
      </IconButton>
    </GridToolbarContainer>
  )

  useEffect(() => {
    (async () => {
      setOgrenci((await idari.listOgrenci()).map(o => { return { ...o, id: o._id } }))
    })()
  }, [])
  const app = useRealmApp()
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });
  const onSubmit = async data => {
    console.log(await idari.createOgrenci({
      type: "OGRENCI",
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
        <DataGrid rows={ogrenci} columns={columns} pageSize={5} checkboxSelection components={{ Toolbar: CustomToolbar }} />
      </div>

      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" fullWidth>
        <DialogTitle id="form-dialog-title">Öğrenci Ekle</DialogTitle>
        <DialogContent>
          <form noValidate onSubmit={handleSubmit(onSubmit)} id="oform" >
            <div>
              <div>
                <FormControl >
                  <Select
                    labelId="demo-simple-select-label"
                    {...register("bolum")}
                  >{bolum.map((e,i) => (
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
                error={errors.ogrenci_no}
                helperText={errors.ogrenci_no?.message}
                variant="outlined"
                margin="normal"
                name="ogrenci_no"
                label="Öğrenci No"
                {...register("ogrenci_no")}
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
            form="oform"
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
