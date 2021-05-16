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
import _ from 'lodash'
import TezOneriForm from './form/tezOneri'
import TezAtamaForm from './form/tezAtama'
const schema = yup.object().shape({
    //email: yup.string().email().required()
});

const columns = [
    { field: '_id', hide: true },
    { field: 'ogrenci', headerName: "Öğrenci", width: 230 },
    { field: 'konu', headerName: 'Konu', width: 230 },
    { field: 'aciklama', headerName: 'Açıklama', width: 230 }
];

const Page = () => {
    const app = useRealmApp()
    const classes = useStyles();
    const idari = useProvideIdari();
    const [open, setOpen] = useState(false);
    const [tezler, setTezler] = useState([])
    const [yapi, setYapi] = useState({enstitu:[],abd:[],bolum:[]})
    const [users, setUsers] = useState({"OGRENCI":[],"AKADEMIK":[],"IDARI":[]});
    
    const [tez, setTez] = useState();

    useEffect(()=>{
        (async () => {
            setTezler((await idari.listTez()).map(o => { return { ...o, id: o._id } }))
        })()
    },[])
    useEffect(()=>{
        (async () => {
            let _users = (await idari.listUser()).map(o => { return { ...o, id: o._id } });
            _users = _.groupBy(_users,"type");
            console.log(_users)
            setUsers(_users)
        })()
    },[])
    useEffect(()=>{
        (async () => {
            let enstitu = (await idari.listEnstitu()).map(o => { return { ...o, id: o._id } });
            let abd = (await idari.listABD()).map(o => { return { ...o, id: o._id } });
            let bolum = (await idari.listBolum()).map(o => { return { ...o, id: o._id } });
            setYapi({enstitu, abd, bolum})
        })()
    },[])
    return (
        <div>
            <h1>İstatistik</h1>
            <div>Toplam Tez sayısı: {tezler.length}</div>
            <div>Toplam Öğrenci sayısı: {users["OGRENCI"].length}</div>
            <div>Toplam Danışman sayısı: {users["AKADEMIK"].length}</div>
            <h1>Enstitüler</h1>
            {yapi.enstitu.map(({adi})=>{ return (
                <div>
                    <h2>{adi}</h2>
                <div>Aktif Tez Sayısı</div>
                <div>Toplam Tez Sayısı</div>
                </div>
            )})}

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
