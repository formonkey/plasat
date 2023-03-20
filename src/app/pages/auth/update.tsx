import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useHttpClient } from '../../shared/http-client';
import { useNavigate, useParams } from 'react-router-dom';

export const Update = () => {
    const { t } = useTranslation();
    const { token } = useParams();
    const navigate = useNavigate();
    const { api, state } = useHttpClient();

    const [formState, setFormState] = useState({
        password: '',
        repeat: ''
    });

    const handleValidateToken = async () => {
        if (token) {
            api('/users/password_reset/validate_token/', 'POST', { token });
        } else {
            toast.error(`${t('no_password')}`);
            setTimeout(() => navigate('/login'), 2000);
        }
    };

    useEffect(() => {
        if (!token || token === '') {
            navigate('/login');
        }
        handleValidateToken();
    }, []);

    useEffect(() => {
        if (state.data && !state.isLoading) {
            if (state.path.includes('validate_token')) {
                //
            }
            if (state.path.includes('confirm')) {
                toast.success(`${t('update_password_ok')}`);
                setTimeout(() => navigate('/recupera-success'), 2000);
            }
        }

        if (state.error && !state.isLoading) {
            toast.error(`${t('update_password_error')}`);
            toast.error(t(state.error.status));
            // setTimeout(() => navigate('/login'), 2000);
        }
    }, [state]);

    const handleChange = (e: any) => {
        setFormState((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleUpdate = async () => {
        if (
            formState.password !== '' &&
            formState.repeat === formState.password
        ) {
            api('/users/password_reset/confirm/', 'POST', {
                password: formState.password,
                token
            });
        } else {
            toast.error(`${t('no_password')}`);
        }
    };

    return (
        <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
                <div className="bg-white py-8 px-4 sm:rounded-lg sm:px-10">
                    <div className="space-y-8">
                        <div className="sm:mx-auto sm:w-full sm:max-w-md">
                            <h3
                                className={
                                    'font-bold mb-2 text-principal text-3xl'
                                }
                            >
                                {t('login.text.update.title')}
                            </h3>
                        </div>

                        <div className={''}>
                            {t('login.text.update.explanation')}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                {t('login.text.password')}*
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={formState.password || ''}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-dark focus:border-primary-dark sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                {t('login.text.repeat')}*
                            </label>
                            <div className="mt-1">
                                <input
                                    id="repeat"
                                    name="repeat"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={formState.repeat || ''}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-dark focus:border-primary-dark sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                onClick={handleUpdate}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark"
                            >
                                {t('login.button.update')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
