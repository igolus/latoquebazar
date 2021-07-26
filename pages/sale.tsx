import React from 'react'
import Navbar from "@component/navbar/Navbar";
import {Container} from "@material-ui/core";
import AppLayout from "@component/layout/AppLayout";

const Sale = () => {


    // const handleGoBack = async () => {
    //     router.back()
    // }

    return (
        <AppLayout navbar={<Navbar />}>
            <h1>AppLayout</h1>
            <Container sx={{ mt: '2rem' }}>
                <div>About</div>
            </Container>
        </AppLayout>

    )
}

export default Sale
