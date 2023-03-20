// import {useEffect, useState} from 'react';
// import {StoreKeys, useStore} from "../../shared/store";
import {PageBody} from '../../elements/page-body';
import {ConfiguracionForm} from './configuracion-form';
import {useHttpClient} from "../../shared/http-client";
import {useTranslation} from "react-i18next";
import {StoreKeys} from "../../shared/store";
import {useEffect, useState} from "react";
import {useCookies} from "../../shared/cookies";
import {toast} from "react-toastify";

export const Configuracion = () => {
    const {t} = useTranslation();
    const {api, state} = useHttpClient();
    const {get: getCookie} = useCookies();

    const [data, setData] = useState<any | null>(null);
    const [profile, setProfile] = useState<any>({});

    useEffect(() => {
        setData(getCookie(StoreKeys.Configuration))

        // get connected user roles
        if (getCookie(StoreKeys.Token)) {
            setProfile(getCookie(StoreKeys.Profile));
        }

    }, []);
    const handleBaja = () => {
        const domain = getCookie(StoreKeys.Token).domain;
        api('/plannsat/productos/create_portal/', "POST", {
                customer: data?.stripe_id,
                back: `${process.env.REACT_APP_PROTOCOL}${domain}.${process.env.REACT_APP_DOMAIN}${process.env.REACT_APP_PORT}/configuracion`,
            },
        );
    };

    useEffect(() => {
        if (state.data) {
            window.location.assign(state.data.url);
        }

        if (state.error) {
            toast.error(state.error.email[0]);
        }
    }, [state]);

    return (
        <PageBody
            title={'configuracion.text.title'}
        >
            <>
                {profile.rol === 'superadmin' ? (

                    <>
                        <div className={'mb-4'}>
                            {t('login.text.subscripcion.explanation')}
                        </div>
                        <button
                            disabled={state.isLoading}
                            type="button"
                            onClick={handleBaja}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark"
                        >
                            {t('login.button.subscripcion')}
                        </button>

                        <hr className={"py-8"}/>

                    </>
                ) : null}
                <ConfiguracionForm/>
            </>


        </PageBody>
    );
};
