import React, {useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {toast} from 'react-toastify';
import {useHttpClient} from '../../shared/http-client';
import {StoreKeys} from '../../shared/store';
import {useCookies} from "../../shared/cookies";
import {classNames} from "../../utils";
import dayjs from "dayjs";

export const Login = () => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const {api, state} = useHttpClient();
    const {set: setCookie, get: getCookie} = useCookies();
    const [formState, setFormState] = React.useState({
        email: '',
        password: ''
    });
    const [show, setShow] = React.useState(false);

    useEffect(() => {
        console.log('state', state);
        // remove(StoreKeys.Token, `.${process.env.REACT_APP_DOMAIN}`);
        // remove(StoreKeys.Profile, `.${process.env.REACT_APP_DOMAIN}`);
        // remove(StoreKeys.Configuration, `.${process.env.REACT_APP_DOMAIN}`);
    }, []);

    useEffect(() => {

        if (state.data) {
            if (state.path.includes('/login')) {
                setCookie(StoreKeys.Token, state.data, `.${process.env.REACT_APP_DOMAIN}`);
                const id = getCookie(StoreKeys.Token).id;
                // primero obtenemos el user para saber si es un operario o un admin
                api(`/users/${id}`, 'GET');
            }

            if (state.path.includes('users') && !state.path.includes('/login')) {
                // si is_staff es que es un admin, llamamaos a users, si no llamamos a operarios
                if (state.data.is_staff) {
                    api('/users/me/', 'GET');
                } else {
                    api('/operarios/me/', 'GET');
                }
            }

            if (state.path.includes('/me')) {
                // obtenido el perfil vamos a por el cliente de plannsat

                // si esta de baja... enviar a pagina de baja
                const fechaBaja = state.data.domain.tenant.fecha_baja;

                if (fechaBaja && dayjs(fechaBaja).isBefore(dayjs())) {
                    if (state.data.rol === 'usuario') {
                        navigate(`baja-operario`);
                    } else {
                        navigate(`baja/${state.data.domain.tenant.stripe_id}`);
                    }
                } else {
                    //
                    setCookie(StoreKeys.Profile, state.data, `.${process.env.REACT_APP_DOMAIN}`);
                    const domain = getCookie(StoreKeys.Token).domain;
                    api(`/plannsat/clientes/?schema_name=${domain}`, 'GET');
                }
            }

            if (state.path.includes('plannsat/clientes')) {
                setCookie(StoreKeys.Configuration, state?.data?.results[0], `.${process.env.REACT_APP_DOMAIN}`);
                const domain = getCookie(StoreKeys.Token).domain;
                window.location.assign(`${process.env.REACT_APP_PROTOCOL}${domain}.${process.env.REACT_APP_DOMAIN}${process.env.REACT_APP_PORT}/`);
            }
        }

        if (state.error) {
            toast.error(t(state.error.detail.detail));
        }
    }, [state]);

    const handleChange = (e: any) => {
        setFormState((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleLogin = async (e: any) => {
        e.preventDefault();
        api('/users/login', 'POST', formState);
    };

    const handleSignup = async () => {
        console.log('navigate to signup');
    };

    return (
        <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
                <div className="bg-white py-8 px-4 sm:rounded-lg sm:px-10">
                    <form onSubmit={handleLogin}>
                        <div className="space-y-8">
                            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                                <img
                                    className="mt-8 h-32"
                                    src="/logo.svg"
                                    alt="Workflow"
                                />
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
                                <label className="block text-sm font-medium text-gray-700">
                                    {' '}
                                    {t('login.text.password')}*{' '}
                                </label>
                                <div className="mt-1">
                                    <div className="py-2">
                                        <div className="relative">
                                            <input
                                                id="password"
                                                name="password"
                                                onChange={handleChange}
                                                type={show ? 'text' : 'password'}
                                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-dark focus:border-primary-dark sm:text-sm"
                                            />
                                            <div
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">

                                                <svg
                                                    className={classNames(
                                                        "h-4 text-gray-400 cursor-pointer",
                                                        show ? "hidden" : "block"
                                                    )}
                                                    fill="none"
                                                    onClick={() => setShow(!show)}
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 576 512">
                                                    <path fill="currentColor"
                                                          d="M572.52 241.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400a144 144 0 1 1 144-144 143.93 143.93 0 0 1-144 144zm0-240a95.31 95.31 0 0 0-25.31 3.79 47.85 47.85 0 0 1-66.9 66.9A95.78 95.78 0 1 0 288 160z">
                                                    </path>
                                                </svg>

                                                <svg
                                                    className={classNames(
                                                        "h-4 text-gray-400 cursor-pointer",
                                                        show ? "block" : "hidden"
                                                    )}
                                                    onClick={() => setShow(!show)}
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 640 512">
                                                    <path fill="currentColor"
                                                          d="M320 400c-75.85 0-137.25-58.71-142.9-133.11L72.2 185.82c-13.79 17.3-26.48 35.59-36.72 55.59a32.35 32.35 0 0 0 0 29.19C89.71 376.41 197.07 448 320 448c26.91 0 52.87-4 77.89-10.46L346 397.39a144.13 144.13 0 0 1-26 2.61zm313.82 58.1l-110.55-85.44a331.25 331.25 0 0 0 81.25-102.07 32.35 32.35 0 0 0 0-29.19C550.29 135.59 442.93 64 320 64a308.15 308.15 0 0 0-147.32 37.7L45.46 3.37A16 16 0 0 0 23 6.18L3.37 31.45A16 16 0 0 0 6.18 53.9l588.36 454.73a16 16 0 0 0 22.46-2.81l19.64-25.27a16 16 0 0 0-2.82-22.45zm-183.72-142l-39.3-30.38A94.75 94.75 0 0 0 416 256a94.76 94.76 0 0 0-121.31-92.21A47.65 47.65 0 0 1 304 192a46.64 46.64 0 0 1-1.54 10l-73.61-56.89A142.31 142.31 0 0 1 320 112a143.92 143.92 0 0 1 144 144c0 21.63-5.29 41.79-13.9 60.11z">
                                                    </path>
                                                </svg>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-end">
                                <div className="text-sm">
                                    <Link to="/forgot">
                                        <div className="font-medium text-primary hover:text-primary-dark">
                                            {t('login.text.forgot.password')}
                                        </div>
                                    </Link>
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark"
                                >
                                    {t('login.button.login')}
                                </button>
                            </div>
                        </div>
                    </form>

                    <div className="mt-6 hidden">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">
                                    {t('login.text.no-acount')}
                                </span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <div>
                                <div
                                    onClick={handleSignup}
                                    className="w-full flex justify-center py-2 px-4 border border-primary rounded-md shadow-sm text-sm font-medium text-primary bg-transparent hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark"
                                >
                                    {t('login.button.signup')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
        ;
};
