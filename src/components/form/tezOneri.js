import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

export default ({form, onSubmit, id, ...props}) => {
    const { register, handleSubmit, formState: { errors } } = form;
    return (

        <form noValidate onSubmit={onSubmit} id={id} >
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