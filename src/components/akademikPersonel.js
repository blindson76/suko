import React, { useEffect, useState } from 'react';
import { ObjectId } from "bson";
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import AlarmIcon from '@material-ui/icons/Alarm';
import PersonAdd from '@material-ui/icons/PersonAdd'

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

const columnsTez = [
  { field: '_id', hide: true },
  { field: 'konu', headerName: 'Konu', width: 230 },
  { field: 'aciklama', headerName: 'Açıklama', width: 230 },
  { field: 'ogrenci', headerName: 'Öğrenci', width: 230 },
  { field: 'durum', headerName: 'Durum', width: 230 },
  { field: 'tarih', headerName: 'Bitiş Tarihi', width: 230 },
];

const Page = () => {
  const classes = useStyles();
  const idari = useProvideIdari();
  const [personel, setPersonel] = useState([])
  const [open, setOpen] = useState(false);
  const [enstitu, setEnstitu] = useState([]);
  const [selectedHoca, setSelectedHoca] = useState();
  const [tez, setTez] = useState([]);
  const [count, setCount] = useState(0)

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
      <IconButton color="primary" aria-label="add to shopping cart">
        <PersonAdd  onClick={handleOpen} />
      </IconButton>
    </GridToolbarContainer>
  )

  useEffect(() => {
    (async () => {
      setPersonel((await idari.listPersonel()).map(o => { return { ...o, id: o._id } }))
    })()
  }, [count])
  useEffect(() => {
    if(!selectedHoca)
      return;
    (async () => {
      setTez((await idari.listTez({danisman:selectedHoca._id})).map(o => { return { ...o, id: o._id } }))
    })()
  }, [selectedHoca])
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
    
    setOpen(()=>{
      setCount(c=>c+1)
      return false;
    })
  };
  const handleClose = () => {
    setOpen(false)
  }
  const handleRowSelected = ({data, isSelected}) => {
    setSelectedHoca(isSelected ? data : null)
  }
  return (
    <div>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid rows={personel} columns={columns} pageSize={5} components={{ Toolbar: CustomToolbar }} onRowSelected={handleRowSelected} />
      </div>

      {tez && tez.length>0 && (
        <div style={{ height: 400, width: '100%' }}>
        <h1>Danışmanın tezleri</h1>
          <DataGrid rows={tez} columns={columnsTez} pageSize={5} disableSelectionOnClick={true} />
        </div>
      )}

      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" fullWidth>
        <DialogTitle id="form-dialog-title">Personel Ekle</DialogTitle>
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
