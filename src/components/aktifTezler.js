import React, { useEffect, useState } from 'react';
import { ObjectId } from "bson";
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import _ from 'lodash'
import { useRealmApp } from '../RealmApp';
import { ProvideIdari, useProvideIdari } from '../hooks/idari'
import { useForm } from 'react-hook-form';
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@material-ui/data-grid'

const schema = yup.object().shape({
    //email: yup.string().email().required()
});



const Page = () => {
    const classes = useStyles();
    const idari = useProvideIdari();
    const [tezler, setTezler] = useState([])
    const [open, setOpen] = useState(false);
    const [bolum, setBolum] = useState([]);
    const [personel, setPersonel] = useState([]);
    const [ogrenci, setOgrenci] = useState([])
    const [selectedOgrenci, setSelectedOgrenci] = useState();

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
            setTezler((await idari.listTez({})).map(o => { return { ...o, id: o._id } }))
        })()
    }, [])
    const app = useRealmApp()
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });
    const onSubmit = async data => {
        const {id:oneren, id:ogrenci } = selectedOgrenci;
        const record = {oneren, ogrenci, ...data}
        console.log(await idari.createTezOneri(record))
    };
    const handleRowSelected = ({data, isSelected}) => {
        setSelectedOgrenci(isSelected ? data : null)
    }
    const handleClose = () => {
        setOpen(false)
    }
    return (
        <div>
            <div style={{ height: 400, width: '100%' }}>
                <DataGrid rows={tezler} columns={columns} pageSize={5} disableMultipleSelection={true} />
            </div>

            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" fullWidth>
                <DialogTitle id="form-dialog-title">Tez Önerisi </DialogTitle>
                <DialogContent>
                    <form noValidate onSubmit={handleSubmit(onSubmit)} id="aoneri" >
                        <div>
                            <TextField
                                error={errors.konu}
                                helperText={errors.konu?.message}
                                variant="outlined"
                                margin="normal"
                                label="Tez Konusu"
                                fullWidth
                                autoFocus
                                {...register("konu")}
                            />
                        </div>
                        <div>
                            <TextField
                                error={errors.aciklama}
                                helperText={errors.aciklama?.message}
                                variant="outlined"
                                margin="normal"
                                label="Açıklama"
                                fullWidth
                                autoFocus
                                {...register("aciklama")}
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
