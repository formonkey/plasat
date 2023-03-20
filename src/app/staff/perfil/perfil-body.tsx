import React from 'react';
import { Avatar } from '../../elements/avatar';
import { useTranslation } from 'react-i18next';
import { useDrawer } from '../../shared/drawer';
import { ProfileBodyChangePassword } from './profile-body-change-password';
import { ProfileBodyChangeSignature } from './profile-body-change-signature';
import {useCookies} from "../../shared/cookies";
import {StoreKeys} from "../../shared/store";

export const PerfilBody = ({ profile, refresh }: { profile: any, refresh: any }) => {
    const { t } = useTranslation();
    const { open, close } = useDrawer();
    const {remove} = useCookies();

    const handelLogout = () => {
        remove(StoreKeys.Token, `.${process.env.REACT_APP_DOMAIN}`);
        remove(StoreKeys.Profile, `.${process.env.REACT_APP_DOMAIN}`);
        remove(StoreKeys.Configuration, `.${process.env.REACT_APP_DOMAIN}`);
        window.location.assign(`${process.env.REACT_APP_PROTOCOL}${process.env.REACT_APP_DOMAIN}${process.env.REACT_APP_PORT}/`);
    };

    const openDrawerChangePassword = () => {
        openDrawer(
            ProfileBodyChangePassword,
            'profile.drawer.change-password'
        );
    };

    const openDrawerChangeSignature = () => {
        openDrawer(
            ProfileBodyChangeSignature,
            'profile.drawer.change-signature'
        );
    };

    const openDrawer = (Component: any, title: string) => {
        open(title, <Component item={profile} close={handleClose} />, true, '2xl');
    };

    const handleClose = () => {
        console.log()
        refresh();
        close()
    }

    return (
        <div className="flex flex-col pt-8 px-4 space-y-8">
            <div className="flex items-center align-center w-full space-x-4">
                <Avatar size="xl" name={profile.name || profile.email} />
                <span className="text-[24px] font-regular">{profile.name}</span>
            </div>

            <div className="flex flex-col w-full">
                <div
                    onClick={openDrawerChangeSignature}
                    className="flex cursor-pointer border justify-between px-2 py-4 border-gray-200 border-b-0 bg-white"
                >
                    <span>{t('profile.text.change-signature')}</span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 text-[#7C7C7C]"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                        />
                    </svg>
                </div>
                <div
                    onClick={openDrawerChangePassword}
                    className="flex cursor-pointer border justify-between px-2 py-4 border-gray-200 bg-white"
                >
                    <span>{t('profile.text.change-password')}</span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 text-[#7C7C7C]"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                        />
                    </svg>
                </div>
                <div
                    onClick={handelLogout}
                    className="flex cursor-pointer border justify-between px-2 py-4 mt-[30px] border-gray-200 bg-white"
                >
                    <span>{t('profile.text.close-session')}</span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 rotate-180 text-[#7C7C7C]"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                        />
                    </svg>
                </div>
            </div>
        </div>
    );
};
