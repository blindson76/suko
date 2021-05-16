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

const columns = [
    { field: '_id', hide: true },
    { field: 'ogenci_no', headerName: "No", width: 80 },
    { field: 'adi', headerName: 'Adı', width: 230 },
    { field: 'soyadi', headerName: 'Soy adı', width: 230 },
    { field: 'email', headerName: 'Email', width: 230 },
    { field: 'bolum', headerName: 'Bölüm', width: 230 },
];
const formDefinitions = {
    oneri: {
        id: "form_oneri",
        form: TezOneriForm,
        title: "Tez Önerisi"
    },
    atama: {
        id: "form_atama",
        form: TezAtamaForm,
        title: "Tez Atama"
    }
}

const Page = () => {
    const classes = useStyles();
    const idari = useProvideIdari();
    const [ogrenci, setOgrenci] = useState([])
    const [open, setOpen] = useState(false);
    const [bolum, setBolum] = useState([]);
    const [selectedOgrenci, setSelectedOgrenci] = useState();
    const [ActiveForm, setActiveForm] = useState(formDefinitions["oneri"]);
    useEffect(() => {
        (async () => {
            setBolum(await idari.listBolum())
        })()
    }, [])
    const handleOpen = (form) => {
        setOpen(() => {
            setActiveForm(formDefinitions[form])
            return true;
        })
    }
    const CustomToolbar = () => (
        <GridToolbarContainer>
            <GridToolbarExport onClick={() => handleOpen("oneri")} />
            <GridToolbarExport onClick={() => handleOpen("atama")} />
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
        if(ActiveForm.id === "form_atama"){
            const {user_id:danisman} = app.currentUser;
            const {user_id:ogrenci} = selectedOgrenci;
            const record = {...data, danisman, ogrenci, durum:"DEVAM", tarih:new Date()};
            record.danisman = new ObjectId(record.danisman);
            record.destekleyen = record.destekleyen.split()
            console.log(await idari.createTez(record))
        }
        //console.log(data)
        return;
        const { id: oneren, id: ogrenci } = selectedOgrenci;
        const record = { oneren, ogrenci, ...data }
        //console.log(await idari.createTezOneri(record))
    };
    const handleRowSelected = ({ data, isSelected }) => {
        setSelectedOgrenci(isSelected ? data : null)
    }
    const handleClose = () => {
        setOpen(false)
    }
    return (
        <div>
            <div style={{ height: 400, width: '100%' }}>
                <DataGrid disableMultipleSelection={true} rows={ogrenci} columns={columns} pageSize={5} components={{ Toolbar: CustomToolbar }} onRowSelected={handleRowSelected} />
            </div>

            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">{ActiveForm.title}</DialogTitle>
                <DialogContent>
                    <ActiveForm.form onSubmit={onSubmit} handleClose={handleClose} id={ActiveForm.id} form={{ register, handleSubmit, formState: { errors } }} />
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
              </Button>
                    <Button
                        type="submit"
                        form={ActiveForm.id}
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
