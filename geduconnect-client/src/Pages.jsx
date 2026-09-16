import React from 'react'
import { Header } from './common/Header'
import { Outlet } from 'react-router-dom'
import { Footer } from './common/Footer'

export const Pages = () => {
    return (
        <>

            <Header />
            <main>
                <Outlet />
            </main>
            <Footer />
        </>
    )
}
