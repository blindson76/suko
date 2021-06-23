import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import TransferWithinAStationIcon from '@material-ui/icons/TransferWithinAStation';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import _ from 'lodash'

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
  //email: yup.string().email().required()
});



const Page = () => {
  const classes = useStyles();
  const idari = useProvideIdari();
  const [ogrenci, setOgrenci] = useState([])
  const [open, setOpen] = useState(false);
  const [bolum, setBolum] = useState([]);
  const [personel, setPersonel] = useState([]);
  const [mode, setMode] = useState(null)
  const [selection, setSelection] = useState([])
  const [count, setCount] = useState(0)
  
const columns = [
  { field: '_id', hide: true },
  { field: 'ogenci_no', headerName: "No", width: 80 },
  { field: 'adi', headerName: 'Adı', width: 230 },
  { field: 'soyadi', headerName: 'Soy adı', width: 230 },
  { field: 'email', headerName: 'Email', width: 230 },
  { field: 'bolum', headerName: 'Bölüm', width: 230, valueGetter: params => {
    let _bolum = _.find(bolum,{_id:params.row.bolum})
    if(_bolum){
      return _bolum.adi
    }
    
  } },
  { field: 'danisman', headerName: 'Danışman', width: 230, valueGetter: params => {
    let danisman = _.find(personel,{_id:params.row.danisman})
    if(danisman){
      return danisman.adi + " " + danisman.soyadi
    }
    
  }},
];

  useEffect(() => {
    (async () => {
      setBolum(await idari.listBolum())
    })()
  }, [])
  useEffect(() => {
    (async () => {
      setPersonel(await idari.listPersonel())
    })()
  }, [])
  const handleOpen = (mode) => {
    setOpen(() => {
      setMode(mode)
      return true;
    })
  }
  const CustomToolbar = () => (
    <GridToolbarContainer>
      <IconButton color="primary" aria-label="add to shopping cart">
        <PersonAdd onClick={() => { handleOpen('ogrenciEkle') }} />
      </IconButton>
      <IconButton color="primary" aria-label="add to shopping cart">
        <TransferWithinAStationIcon onClick={() => { handleOpen('danismanAta') }} />
      </IconButton>
    </GridToolbarContainer>
  )

  useEffect(() => {
    (async () => {
      setOgrenci((await idari.listOgrenci()).map(o => { return { ...o, id: o._id } }))
    })()
  }, [count])
  const app = useRealmApp()
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });
  const onSubmit = async data => {
    if(mode === "ogrenciEkle"){
      console.log(await idari.createOgrenci({
        type: "OGRENCI",
        password: "123456",
        ...data,
      }))
    }

    else if(mode === "danismanAta"){
      let danisman = data.danisman;
      console.log(await idari.updateOgrenci({students:selection,danisman}))

    }
    setOpen(()=>{
      setCount(c=>c+1)
      return false;
    })
  };
  const handleClose = () => {
    setOpen(false)
  }
  const handleSelectionModel = (data) => {
    setSelection(data.selectionModel)
}
  return (
    <div>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid rows={ogrenci} columns={columns} pageSize={5} selectionModel={selection} onSelectionModelChange={handleSelectionModel} checkboxSelection components={{ Toolbar: CustomToolbar }} />
      </div>

      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" fullWidth>
        <DialogTitle id="form-dialog-title">Öğrenci Ekle</DialogTitle>
        <DialogContent>
          <form noValidate onSubmit={handleSubmit(onSubmit)} id="oform" >
            {mode === "ogrenciEkle" &&
              <div>
                <div>
                  <FormControl >
                    <Select
                      labelId="demo-simple-select-label"
                      {...register("bolum")}
                    >{bolum.map((e, i) => (
                      <MenuItem key={e._id} value={e._id} >{e.adi}</MenuItem>
                    ))}</Select>
                  </FormControl>
                </div>

                <div>
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
                </div>
                <div>

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
              </div>}


            <FormControl >
              <Select
                labelId="demo-simple-select-label"
                {...register("danisman")}
              >{personel.map((e, i) => (
                <MenuItem key={e._id} value={e._id} >{e.adi} {e.soyadi}</MenuItem>
              ))}</Select>
            </FormControl>
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
