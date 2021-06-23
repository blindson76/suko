import React, { useEffect, useState } from 'react';
import { ObjectId } from "bson";
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import EditIcon from '@material-ui/icons/Edit';
import _ from 'lodash'
import { useRealmApp } from '../RealmApp';
import { ProvideIdari, useProvideIdari } from '../hooks/idari'
import { useForm } from 'react-hook-form';
import * as yup from "yup";
import { FormControl, IconButton } from '@material-ui/core';
import { yupResolver } from '@hookform/resolvers/yup';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@material-ui/data-grid'

const schema = yup.object().shape({
    //email: yup.string().email().required()
});

const durumEnum = [
    'DEVAM EDİYOR',
    'AYRILDI',
    'TAMAMLANDI'
]

const Page = () => {
    const classes = useStyles();
    const idari = useProvideIdari();
    const [tezler, setTezler] = useState([])
    const [open, setOpen] = useState(false);
    const [bolum, setBolum] = useState([]);
    const [personel, setPersonel] = useState([]);
    const [ogrenci, setOgrenci] = useState([])
    const [selectedOgrenci, setSelectedOgrenci] = useState();
    const [selection, setSelection] = useState([])
    const [count, setCount] = useState(0)

    const columns = [
        { field: '_id', hide: true },
        { field: 'ogrenci', headerName: "Öğrenci", width: 230, valueGetter: params => {
            let ogr = _.find(ogrenci,{_id:params.row.ogrenci})
            if(ogr){
              return ogr.adi + " " + ogr.soyadi
            }
            
          } },
        { field: 'konu', headerName: 'Konu', width: 230 },
        { field: 'aciklama', headerName: 'Açıklama', width: 230 },
        { field: 'durum', headername: 'Durum', width: 230},
        { field: 'danisman', headerName: 'Danışman', width: 230, valueGetter: params => {
            let danisman = _.find(personel,{_id:params.row.danisman})
            if(danisman){
              return danisman.adi + " " + danisman.soyadi
            }
            
          }}
    ];
    
    useEffect(() => {
        (async () => {
            setPersonel(await idari.listPersonel())
        })()
    }, [])
    useEffect(() => {
        (async () => {
            setOgrenci(await idari.listOgrenci())
        })()
    }, [])
    useEffect(() => {
        (async () => {
            setBolum(await idari.listBolum())
        })()
    }, [])
    const handleOpen = () => {
        setOpen(true)
    }
    const CustomToolbar = () => (
        <GridToolbarContainer>
            <IconButton color="primary" aria-label="add to shopping cart">
                <EditIcon onClick={handleOpen} />
            </IconButton>
        </GridToolbarContainer>
    )

    useEffect(() => {
        (async () => {
            setTezler((await idari.listTez({})).map(o => { return { ...o, id: o._id } }))
        })()
    }, [count])
    const app = useRealmApp()
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });
    const onSubmit = async data => {
        console.log(selection, data)
        console.log(await idari.updateTez({tez:selection,durum:data.durum}))
        setOpen(()=>{
            setCount(c=>c+1)
            return false;
        })
    };
    const handleRowSelected = ({data, isSelected}) => {
        setSelectedOgrenci(isSelected ? data : null)
    }
    const handleClose = () => {
        setOpen(false)
    }
    const handleSelectionModel = (data) => {
        setSelection(data.selectionModel)
    }
    return (
        <div>
            <div style={{ height: 400, width: '100%' }}>
                <DataGrid rows={tezler} columns={columns} pageSize={5}  selectionModel={selection} onSelectionModelChange={handleSelectionModel} checkboxSelection   components={{ Toolbar: selection.length>0 ? CustomToolbar:null }} />
            </div>

            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" fullWidth>
                <DialogTitle id="form-dialog-title">Tez Önerisi </DialogTitle>
                <DialogContent>
                    <form noValidate onSubmit={handleSubmit(onSubmit)} id="aoneri" >
                    <FormControl >
                        <Select
                        labelId="demo-simple-select-label"
                        {...register("durum")}
                        >{durumEnum.map((e, i) => (
                        <MenuItem key={i} value={e} >{e}</MenuItem>
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
                        form="aoneri"
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
