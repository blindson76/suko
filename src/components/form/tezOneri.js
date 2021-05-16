import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { useForm } from 'react-hook-form';

import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';

const schema = yup.object().shape({
    //email: yup.string().email().required()
});
export default ({ onSubmit, id, handleClose, ...props}) => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });
    return (

        <form noValidate onSubmit={handleSubmit(onSubmit)} id={id} >
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
    )
}