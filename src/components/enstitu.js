import React, { useEffect, useState } from 'react';

import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Grid from '@material-ui/core/Grid';
import { useRealmApp } from '../RealmApp';
import {ProvideIdari, useProvideIdari} from '../hooks/idari'
const Page = () => {
    const idari = useProvideIdari();
    const [enstitui, setEnstitu] = useState([])
    const [abd, setABD] = useState([])
    const [bolum, setBolum] = useState([])
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
    return(
        <div>
            <Grid container>
                <Grid item lg={4} >
                    <MenuList>{enstitui.map((e,i) => (
                        <MenuItem key={e._id}>{e.adi}</MenuItem>
                    ))}</MenuList>
                </Grid>
                <Grid item lg={4} >
                    <MenuList>{abd.map((e,i) => (
                        <MenuItem key={e._id}>{e.adi}</MenuItem>
                    ))}</MenuList>
                </Grid>
                <Grid item lg={4} >
                    <MenuList>{bolum.map((e,i) => (
                        <MenuItem key={e._id}>{e.adi}</MenuItem>
                    ))}</MenuList>
                </Grid>
            </Grid>
        
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