import {useState} from 'react';
import {StoreKeys, useStore} from '../../store';
import {REFRESH, TOKEN} from '../../../constants';
import {useNavigate} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {useCookies} from "../../cookies";

export const useHttpClient = (): any => {
    const navigate = useNavigate();
    const {t} = useTranslation();
    const {get, set, remove} = useStore();
    const {set: setCookie, get: getCookie} = useCookies();

    const [state, setState] = useState<any>({
        isLoading: false,
        error: null,
        data: null,
        setError: () => null
    });

    const api = (
        path: string,
        method: string,
        body: BodyInit | null | undefined,
        isFormData: boolean = false,
        isBlob: boolean = false
    ) => {
        setState({
            path: '',
            isLoading: true,
            error: null,
            data: null
        });

        // const access = get(StoreKeys.Token);
        const access = getCookie(StoreKeys.Token);

        // console.log('access en http client', access);
        // console.log('path', path);
        // console.log('method', method);
        // console.log('body', body);

        // return;

        if (
            !access &&
            !path.includes('login') &&
            !path.includes('password_reset') &&
            !path.includes('plannsat/clientes') &&
            !path.includes("users") &&
            !path.includes("productos")
        ) {
            // if has logout in other session and is not login flow then send uer to login
            window.location.assign(`${process.env.REACT_APP_PROTOCOL}${process.env.REACT_APP_DOMAIN}${process.env.REACT_APP_PORT}`);
        }



        const DOMAIN = access &&
                !path.includes("users") &&
                !path.includes("plannsat/clientes") &&
                !path.includes("productos")
            ? `${access.domain}.`
            : "";

        const API = `/api`;

        // const language = get(StoreKeys.Language);
        const language = getCookie(StoreKeys.Language);

        // guardamos los valores de la peticion de entrada por si caduca el token de access

        const savedMethod = method;
        const savedPath = path;
        const savedBody = body;

        const headers: any = {};

        if (!isFormData) {
            headers['Content-Type'] = 'application/json';
        }

        // console.log("URL:::: ", `${process.env.REACT_APP_BE_PROTOCOL}${DOMAIN}${process.env.REACT_APP_HOST}${API}${path}`)

        fetch(`${process.env.REACT_APP_BE_PROTOCOL}${DOMAIN}${process.env.REACT_APP_HOST}${API}${path}`, {
            method,
            headers: {
                ...headers,
                Accept: 'application/json',
                Authorization: access ? `Bearer ${access[TOKEN]}` : '',
                'Accept-Language': language?.code ?? 'en'
            },
            body: isFormData ? body : body ? JSON.stringify(body) : null
        })
            .then((response) => {
                if (response.status === 204) {
                    return {};
                }

                if (response.status >= 200 && response.status < 300) {
                    return isBlob ? response.blob() : response.json();
                }

                return response.json().then((error) => {
                    throw error;
                });
            })
            .then((data) => {
                setState({
                    path,
                    data,
                    isLoading: false,
                    error: null
                });
            })
            .catch((error) => {
                // comprobamos que el error emitido sea por expiracion del token

                if (error.code === 'token_not_valid') {
                    const body = {refresh: access[REFRESH]};
                    const path = '/token/refresh';

                    // solicitamos un nuevo token al servidor a traves del refresh token

                    return fetch(`${process.env.REACT_APP_HOST}${path}`, {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                            'Accept-Language': language?.code ?? 'en'
                        },
                        body: JSON.stringify(body)
                    })
                        .then((response) => {
                            // si obtenemos un token de access valido lo ponemos en el store

                            if (
                                response.status >= 200 &&
                                response.status < 300
                            ) {
                                return response.json();
                            }
                        })
                        .then((response) => {
                            set(StoreKeys.Token, {...access, ...response});
                            setCookie(StoreKeys.Token, {...access, ...response}, `.${process.env.REACT_APP_DOMAIN}`);

                            // una vez refrescado el token de access repetimos la solicitud original

                            return fetch(
                                `${process.env.REACT_APP_HOST}${savedPath}`,
                                {
                                    method: savedMethod,
                                    headers: {
                                        Accept: 'application/json',
                                        'Content-Type': 'application/json',
                                        Authorization: access
                                            ? `Bearer ${response[TOKEN]}`
                                            : '',
                                        'Accept-Language':
                                            language?.code ?? 'en'
                                    },
                                    body: JSON.stringify(savedBody)
                                }
                            )
                                .then((response) => {
                                    if (
                                        response.status >= 200 &&
                                        response.status < 300
                                    ) {
                                        return response.json();
                                    }
                                })
                                .then((data) => {
                                    setState({
                                        path: savedPath,
                                        data,
                                        isLoading: false,
                                        error: null
                                    });
                                });
                        })
                        .catch(() => {
                            // si el token de refresco tambien sata expirado, eliminamos el store
                            remove();
                            setState({
                                path: savedPath,
                                error: 'token_expired',
                                isLoading: false,
                                data: null
                            });

                            navigate('/login');
                        });
                } else {
                    setState({
                        path,
                        error: {
                            detail: error || t('common.error.backend-500')
                        },
                        isLoading: false,
                        data: null
                    });
                }
            });
    };

    const setError = (error: string | null) => {
        setState({
            ...state,
            error: error
        });
    };

    const options = (path: string) => {
        const access = getCookie(StoreKeys.Token);
        const DOMAIN = access && !path.includes("users") && !path.includes("plannsat/clientes") ? `${access.domain}.` : "";

        const API = `/api`;
        const language = get(StoreKeys.Language);

        // return fetch(`${process.env.REACT_APP_HOST}${path}`, {
        return fetch(`${process.env.REACT_APP_BE_PROTOCOL}${DOMAIN}${process.env.REACT_APP_HOST}${API}${path}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                Authorization: access ? `Bearer ${access[TOKEN]}` : '',
                'Accept-Language': language?.code ?? 'en'
            }
        })
            .then((res) => res.json())
            .then((res) => res.results);
    };

    return {
        state,
        api,
        setError,
        options
    };
};
