'use client'

import { Box, Button, TextField } from '@mui/material'

import styles from './styles.module.scss'

export default function DashboardPage() {
    return <div className={styles.content}>
        <Box
            component="form"
            className={styles.form}
            noValidate
            onSubmit={(e) => {
                e.preventDefault()
                console.log(e);
            }}
            autoComplete="off"
        >
            <h2 className={styles.title}>Sign In</h2>
            <TextField
                className={styles.input}
                autoComplete="off"
                required
                id="outlined-required"
                label="Email"
            />

            <TextField
                className={styles.input}
                autoComplete="off"
                style={{borderRadius: '0px'}}
                id="outlined-password-input"
                label="Password"
                type="password"
            />

            <Button variant="contained">Sign in</Button>
        </Box>
    </div>
}