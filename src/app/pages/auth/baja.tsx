import React, {useEffect} from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {toast} from 'react-toastify';
import {useHttpClient} from '../../shared/http-client';

export const Baja = () => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const {customer} = useParams();
    const {api, state} = useHttpClient();

    useEffect(() => {
        if (!customer || customer === '' || customer === 'undefined') {
            navigate('/login');
        }
    }, [customer]);

    useEffect(() => {
        if (state.data) {
            window.location.assign(state.data.url);
        }

        if (state.error) {
            toast.error(state.error.email[0]);
        }
    }, [state]);

    const handleBaja = () => {
        api('/plannsat/productos/create_portal/', "POST", {
            customer,
            back: `${process.env.REACT_APP_PROTOCOL}${process.env.REACT_APP_DOMAIN}${process.env.REACT_APP_PORT}/login`
        });
    };

    return (
        <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
                <div className="bg-white py-8 px-4 sm:rounded-lg sm:px-10">
                    <div className="space-y-8">
                        <div>
                            <Link to="/login">
                                <span>{'< '}</span>
                                <span>{t('login.button.home')}</span>
                            </Link>
                        </div>

                        <div className="sm:mx-auto sm:w-full sm:max-w-md">
                            <h3
                                className={
                                    'font-bold mb-2 text-principal text-3xl'
                                }
                            >
                                {t('login.text.baja.title')}
                            </h3>
                        </div>

                        <div className={''}>
                            {t('login.text.baja.explanation')}
                        </div>

                        <div>
                            <button
                                type="button"
                                onClick={handleBaja}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark"
                            >
                                {t('login.button.activar')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
