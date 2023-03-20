import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useHttpClient } from '../../shared/http-client';

export const Forgot = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { api, state } = useHttpClient();
    const [formState, setFormState] = React.useState({
        email: ''
    });

    useEffect(() => {
        console.log("STATE ::::", state)

        if (state.data) {
            navigate('/forgot-success');
        }

        if (state.error) {
            toast.error(state.error.email[0]);
        }
    }, [state]);

    const handleChange = (e: any) => {
        setFormState((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleForgot = () => {
        console.log("HANDLE FORGOT :::", formState);
        if (formState.email !== '') {
            api('/users/password_reset/', 'POST', formState);
        } else {
            toast.error(`${t('no_email')}`);
        }
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
                                {t('login.text.forgot.title')}
                            </h3>
                        </div>

                        <div className={''}>
                            {t('login.text.forgot.explanation')}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                {t('login.text.email')}*
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={formState.email || ''}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-dark focus:border-primary-dark sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="button"
                                onClick={handleForgot}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark"
                            >
                                {t('login.button.forgot')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
