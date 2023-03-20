import React, {useEffect, useState} from 'react';

import {useTranslation} from 'react-i18next';
import {StoreKeys} from '../../shared/store';
import {useNavigate} from 'react-router-dom';
import {PerfilBody} from './perfil-body';
import {XIcon} from '@heroicons/react/outline';
import {useCookies} from "../../shared/cookies";

export const Perfil = ({}: {}) => {
    const {get: getCookie} = useCookies();
    const navigate = useNavigate();
    const {t} = useTranslation();
    const [profile, setProfile] = useState<any>({});

    useEffect(() => {
        if (getCookie(StoreKeys.Token)) {
            setProfile(getCookie(StoreKeys.Profile));
        }
    }, []);

    const handleRefresh = () => {
        console.log('handleRefresh');
        if (getCookie(StoreKeys.Token)) {
            setProfile(getCookie(StoreKeys.Profile));
        }
    }

    return (
        <main className="flex flex-col h-screen w-full bg-[#fafafa]">
            <div
                className={
                    'flex items-center px-4 align-center border-b py-4 border-gray-200 bg-white'
                }
            >
                <div
                    className={'flex cursor-pointer'}
                    onClick={() => navigate('home')}
                >
                    <XIcon className="w-8 h-8  text-gray-400"/>
                </div>

                <h1 className="text-center w-full text-[20px] font-semibold text-gray-900">
                    {t('perfil.text.title')}
                </h1>
            </div>

            <PerfilBody profile={profile} refresh={handleRefresh}/>
        </main>
    );
};
