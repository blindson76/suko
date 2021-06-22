import React, { useEffect, useState } from 'react';

import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { useRealmApp } from '../RealmApp';
import {ProvideIdari, useProvideIdari} from '../hooks/idari'
import { IconButton } from '@material-ui/core';
import Add from '@material-ui/icons/Add';
import Remove from '@material-ui/icons/Remove';
import { useForm } from 'react-hook-form';
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';


import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';

const schema = yup.object().shape({
    name: yup.string().required()
  });
  
const Page = () => {
    const classes = useStyles();
    const idari = useProvideIdari();
    const [enstitu, setEnstitu] = useState([])
    const [abd, setABD] = useState([])
    const [bolum, setBolum] = useState([])
    const [selectedEnstitu, setSelectedEnstitu] = useState(-1)
    const [selectedABD, setSelectedABD] = useState(-1)
    const [selectedBolum, setSelectedBolum] = useState(-1)
    const [open, setOpen] = useState(false)
    const [mode, setMode] = useState(null)
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
      });
    useEffect(() => {
        (async () => {
            setEnstitu(await idari.listEnstitu())
        })()
    },[])
    
    useEffect(() => {
        (async () => {
            setABD(await idari.listABD())
        })()
    },[])
    
    useEffect(() => {
        (async () => {
            setBolum(await idari.listBolum())
        })()
    },[])
    const app = useRealmApp()
    const handleClick = async() => {
        console.log(await idari.listEnstitu())
    }
    
    const onSubmit = async ({name}) => {
        if(mode==="Enstitü"){
            let {insertedId} = await idari.insertEnstitu({adi:name})
            console.log(insertedId)
            setOpen(()=>{
                setEnstitu([...enstitu, {_id:insertedId, adi:name}])
                return false
            })
        }
        else if(mode==="ABD"){
            console.log("abd")
            let {insertedId} = await idari.insertABD({adi:name, enstitu:enstitu[selectedEnstitu]._id})
            console.log(insertedId)
            setOpen(()=>{
                setABD([...abd, {_id:insertedId, adi:name, enstitu:enstitu[selectedEnstitu]._id}])
                return false
            })
        }
        else if(mode==="Bölüm"){
            console.log("bölüm")
            let {insertedId} = await idari.insertBolum({adi:name, abd:abd[selectedABD]._id})
            setOpen(()=>{
                setBolum([...bolum, {_id:insertedId, adi:name, abd:abd[selectedABD]._id}])
                return false
            })
        }
    };
    const handleRemove = async (mode, id) => {
        console.log(mode)
        if(mode=="Enstitü"){
            let res = await idari.deleteEnstitu(enstitu[selectedEnstitu]._id)
            if(res && res.deletedCount){
                setEnstitu(()=>{
                    let e = [...enstitu]
                    e.splice(selectedEnstitu,1)
                    return e;
                })
            }
        } 
        else if(mode=="ABD"){
            let res = await idari.deleteABD(abd[selectedABD]._id)
            if(res && res.deletedCount){
                setABD(()=>{
                    let e = [...abd]
                    e.splice(selectedABD,1)
                    return e;
                })
            }
        } 
        else if(mode=="Bölüm"){
            let res = await idari.deleteBolum(bolum[selectedBolum]._id)
            if(res && res.deletedCount){
                setBolum(()=>{
                    let e = [...bolum]
                    e.splice(selectedBolum,1)
                    return e;
                })
            }
        }
    }
    const handleDialog = mode => {
        setOpen(()=>{
            setMode(mode)
            return true;
        })
    }
    const handleClose = () => {
        setOpen(false)
    }
    return(
        <div>
            <Grid container>
                <Grid item lg={4} >
                    <MenuList>{enstitu.map((e,i) => (
                        <MenuItem key={e._id} selected={selectedEnstitu==i} onClick={()=>{setSelectedEnstitu(i)}}>{e.adi}</MenuItem>
                    ))}</MenuList>
                    <IconButton color="primary" aria-label="upload picture" component="span" onClick={()=>{handleDialog("Enstitü")}}>
                        <Add />
                    </IconButton>
                    {selectedEnstitu>=0 && <IconButton color="primary" aria-label="upload picture" component="span" onClick={()=>{handleRemove("Enstitü")}}>
                        <Remove />
                    </IconButton>}
                </Grid>
                <Grid item lg={4} >
                    <MenuList>{abd.map((e,i) => (
                        <MenuItem key={e._id} selected={selectedABD==i} onClick={()=>{setSelectedABD(i)}}>{e.adi}</MenuItem>
                    ))}</MenuList>
                    
                    {selectedEnstitu>=0 && <IconButton color="primary" aria-label="upload picture" component="span" onClick={()=>{handleDialog("ABD")}}>
                        <Add />
                    </IconButton>}
                    {selectedABD>=0 && <IconButton color="primary" aria-label="upload picture" component="span" onClick={()=>{handleRemove("ABD")}}>
                        <Remove />
                    </IconButton>}
                </Grid>
                <Grid item lg={4} >
                    <MenuList>{bolum.map((e,i) => (
                        <MenuItem key={e._id} selected={selectedBolum==i} onClick={()=>{setSelectedBolum(i)}}>{e.adi}</MenuItem>
                    ))}</MenuList>
                    
                    {selectedABD>=0 && <IconButton color="primary" aria-label="upload picture" component="span" onClick={()=>{handleDialog("Bölüm")}}>
                        <Add />
                    </IconButton>}
                    {selectedBolum>=0 && <IconButton color="primary" aria-label="upload picture" component="span" onClick={()=>{handleRemove("Bölüm")}}>
                        <Remove />
                    </IconButton>}
                </Grid>
            </Grid>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" fullWidth>
                <DialogTitle id="form-dialog-title">{mode} Ekle</DialogTitle>
                <DialogContent>
                <form noValidate onSubmit={handleSubmit(onSubmit)} id="oform" >
                    <div>
                    <TextField
                        error={errors.name}
                        helperText={errors.name?.message}
                        variant="outlined"
                        margin="normal"
                        label={mode}
                        autoFocus
                        {...register("name")}
                    />
                    </div>

                </form>
                </DialogContent>
                <DialogActions>
                <Button onClick={handleClose} color="primary">
                    İptal
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