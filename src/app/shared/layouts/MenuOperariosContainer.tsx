import React from 'react';
import { Slide, ToastContainer } from 'react-toastify';
import { Outlet } from 'react-router-dom';

export const MenuOperariosContainer = () => {

    return (
        <>
            <div className="flex flex-col flex-grow items-start w-full h-screen max-h-screen overflow-hidden">
                <Outlet />
            </div>

            <ToastContainer
                position="top-center"
                hideProgressBar
                autoClose={2000}
                transition={Slide}
                closeOnClick
            />
        </>
    );
};
