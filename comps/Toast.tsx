import { Snackbar } from '@material-ui/core'
import React from 'react'
import MuiAlert from '@material-ui/lab/Alert';

const Toast = (props: { hideToast: () => void; render: boolean; message: string }) => {

    const onClose = () => {
        props.hideToast()
    }

    return (
        <Snackbar open={props.render} autoHideDuration={3000} onClose={onClose}>
            <MuiAlert elevation={7} variant="filled" onClose={onClose} severity="error">
                {props.message}
            </MuiAlert>
        </Snackbar>
    )
}

export default Toast
