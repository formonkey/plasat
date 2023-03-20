import React from 'react';
import {Slide, ToastContainer} from 'react-toastify';
import {Outlet} from 'react-router-dom';
import login from '../../../assets/images/login.png';

export const LoginContainer = () => (
    <div>
        <div className="grid grid-cols-1 lg:grid-cols-3 w-full h-screen">

            <div className="hidden lg:block relative overflow-hidden bg-no-repeat bg-cover">
                <img src={login} className="h-full object-cover" alt={"Logo"}/>
                <div
                    className="absolute inset-0 w-full h-full overflow-hidden bg-fixed bg-primary opacity-50 mix-blend-normal">
                </div>
            </div>

            <div className={'lg:col-span-2'}>
                <Outlet/>
            </div>

        </div>
        <ToastContainer
            position="top-center"
            hideProgressBar
            autoClose={2000}
            transition={Slide}
            closeOnClick
        />
    </div>
);

