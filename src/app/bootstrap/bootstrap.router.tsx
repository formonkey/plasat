    import {useEffect, useState} from 'react';

import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

import {LoginContainer} from '../shared/layouts';
import {Forgot, Login, Update} from '../pages/auth';
import {StoreKeys} from '../shared/store';
import {ForgotSuccess} from '../pages/auth/forgot.success';
import {UpdateSuccess} from '../pages/auth/update.success';
import {MainRouter} from '../pages/main/main.router';
import {MainRouter as MainOperarioRouter} from '../staff/main/main.router';
import {Modal} from '../shared/modals';
import {useCookies} from "../shared/cookies";
import {Registro} from "../pages/auth/registro";
import {User} from "../pages/auth/user";
import {Products} from "../pages/auth/products";
import {RegistroCanceled} from "../pages/auth/registro.canceled";
import {RegistroSuccess} from "../pages/auth/registro.success";
    import {Baja} from "../pages/auth/baja";
    import {BajaOperario} from "../pages/auth/baja-operario";

export const BootstrapRouter = () => {
    const {get, remove} = useCookies();
    const [logged, setLogged] = useState<boolean>(false);
    const [isOperario, setIsOperario] = useState<boolean>(false);

    useEffect(() => {
        // get url of the request
        // if the url subdomain is not the domain of connected user: logout
        const url_domain = window.location.host.split('.')[0];

        const token = get(StoreKeys.Token);

        if (token) {
            if (url_domain === token.domain) {
                // if the url subdomain is the domain of connected user: enter the site
                setLogged(true);

                const profile = get(StoreKeys.Profile);

                if (profile) {
                    setIsOperario("is_operario" in profile);
                }
            } else {
                // if the url subdomain is not the domain of connected user: logout
                remove(StoreKeys.Token, `.${process.env.REACT_APP_DOMAIN}`);
                remove(StoreKeys.Profile, `.${process.env.REACT_APP_DOMAIN}`);
                remove(StoreKeys.Configuration, `.${process.env.REACT_APP_DOMAIN}`);
                window.location.assign(`${process.env.REACT_APP_PROTOCOL}${process.env.REACT_APP_DOMAIN}${process.env.REACT_APP_PORT}`);
            }
        } else {
            console.log('no token');
            // setLogged(false);
        }
    }, []);

    return (
        <Modal>
            <Router>
                {logged
                    ? (
                        <Routes>
                            {isOperario
                                ? (
                                    MainOperarioRouter()
                                )
                                : (
                                    MainRouter()
                                )
                            }
                            {/*<Route path="*" element={<NotFound/>}/>*/}
                        </Routes>
                    )
                    : (
                        <Routes>
                            <Route element={<LoginContainer/>}>
                                <Route path="/" element={<Login/>}/>

                                <Route path="/registro">
                                    <Route index element={<Registro/>}/>
                                    <Route path="user" element={<User/>}/>
                                    <Route path="products" element={<Products/>}/>
                                    <Route path="success" element={<RegistroSuccess/>}/>
                                    <Route path="canceled" element={<RegistroCanceled/>}/>
                                </Route>

                                <Route path="/login" element={<Login/>}/>
                                <Route path="/forgot" element={<Forgot/>}/>
                                <Route path="/baja/:customer" element={<Baja/>}/>
                                <Route path="/baja-operario" element={<BajaOperario/>}/>
                                <Route
                                    path="/forgot-success"
                                    element={<ForgotSuccess/>}
                                />
                                <Route path="/recupera" element={<Login/>}/>
                                <Route
                                    path="/reset-password/:token"
                                    element={<Update/>}
                                />
                                <Route
                                    path="/recupera-success"
                                    element={<UpdateSuccess/>}
                                />
                                <Route path="*" element={<Login/>}/>
                            </Route>
                        </Routes>
                    )}
            </Router>
        </Modal>
    );
};
