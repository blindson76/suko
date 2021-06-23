import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { ObjectId } from "bson";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import { IconButton } from '@material-ui/core';
import { useRealmApp } from '../RealmApp';
import { ProvideIdari, useProvideIdari } from '../hooks/idari'
import { useForm } from 'react-hook-form';
import * as yup from "yup";
import _ from 'lodash'
import { yupResolver } from '@hookform/resolvers/yup';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@material-ui/data-grid'
import TezOneriForm from './form/tezOneri'
import TezAtamaForm from './form/tezAtama'
const schema = yup.object().shape({
    //email: yup.string().email().required()
});

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
    const [personel, setPersonel] = useState([]);
    const [selectedOgrenci, setSelectedOgrenci] = useState();
    const [ActiveForm, setActiveForm] = useState(formDefinitions["oneri"]);

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
        {
            field: 'danisman', headerName: 'Danışman', width: 230, valueGetter: params => {
                let danisman = _.find(personel, { _id: params.row.danisman })
                if (danisman) {
                    return danisman.adi + " " + danisman.soyadi
                }

            }
        }
    ];
    useEffect(() => {
        (async () => {
            setPersonel(await idari.listPersonel())
        })()
    }, [])
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
            <IconButton color="primary" aria-label="add to shopping cart">
                <MenuBookIcon onClick={() => { handleOpen('atama') }} />
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
        console.log(data)
        const { danisman } = selectedOgrenci;
        const { _id: ogrenci } = selectedOgrenci;
        const record = { ...data, danisman, ogrenci, durum: "DEVAM", tarih: new Date() };
        record.destekleyen = record.destekleyen.split()
        console.log(record)
        console.log(await idari.createTez(record))
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

            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" fullWidth>
                <DialogTitle id="form-dialog-title">{ActiveForm.title}</DialogTitle>
                <DialogContent>
                    <form noValidate onSubmit={handleSubmit(onSubmit)} id="tezatama" >
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
                                error={errors.konu_en}
                                helperText={errors.konu_en?.message}
                                variant="outlined"
                                margin="normal"
                                label="Tez Konusu (İNGİLİZCE)"
                                fullWidth
                                autoFocus
                                {...register("konu_en")}
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
                        <div>
                            <TextField
                                error={errors.destekleyen}
                                helperText={errors.destekleyen?.message}
                                variant="outlined"
                                margin="normal"
                                label="Destekleyen Kurumlar"
                                fullWidth
                                autoFocus
                                {...register("destekleyen")}
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
                        form="tezatama"
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
