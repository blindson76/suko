import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { ObjectId } from "bson";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import { useRealmApp } from '../RealmApp';
import { ProvideIdari, useProvideIdari } from '../hooks/idari'
import { useForm } from 'react-hook-form';
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@material-ui/data-grid'

import TezOneriForm from './form/tezOneri'
import TezAtamaForm from './form/tezAtama'
const schema = yup.object().shape({
    //email: yup.string().email().required()
});


const Page = () => {
    const app = useRealmApp()
    const classes = useStyles();
    const idari = useProvideIdari();
    const [open, setOpen] = useState(false);
    const [tez, setTez] = useState();

    useEffect(()=>{
        (async () => {
            setTez((await idari.listTez({ogrenci:new ObjectId(app.currentUser.id)})).map(o => { return { ...o, id: o._id } }))
        })()
    },[])
    
    const handleOpen = (form) => {
        setOpen(true)
    }


    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });

    const onSubmit = async data => {
        console.log(data)
    };

    const handleClose = () => {
        setOpen(false)
    }
    return (
        <div>
            <h1>Tez Durumu</h1>
            {tez ?  (
                <div>{tez[0].konu}</div>
            ): 
            (<div>
                <Button variant="contained" color="primary" onClick={()=>setOpen(true)} >Tez Öner</Button>
            </div>)}
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">{app.currentUser.customData.adi}</DialogTitle>
                <DialogContent>
                    
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
              </Button>
                    <Button
                        type="submit"
                        form="oneri"
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
