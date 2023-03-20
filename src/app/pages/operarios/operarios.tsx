import {useEffect, useState} from 'react';
import {useDrawer} from '../../shared/drawer';
import {PageBody} from '../../elements/page-body';
import {OperariosForm} from './operarios-form';
import {useHttpClient} from "../../shared/http-client";
import {toast} from "react-toastify";
import {Table} from "../../elements/table";
import {useCookies} from "../../shared/cookies";
import {StoreKeys} from "../../shared/store";
import {useTranslation} from "react-i18next";

export const Operarios = () => {
    const {t} = useTranslation();
    const {open, close} = useDrawer();
    const {api, state} = useHttpClient();
    const {get: getCookie} = useCookies();
    const [refresh, setRefresh] = useState<string | null>(null);
    const [activos, setActivos] = useState<number>(0);
    const [profile, setProfile] = useState<any>({});
    const [configuration, setConfiguration] = useState<any>({});


    const handleNewAction = () => {
        open('operarios.form.new-item', <OperariosForm close={(id) => handleClose(id)}/>);
    };

    useEffect(() => {
        if (getCookie(StoreKeys.Token)) {
            setProfile(getCookie(StoreKeys.Profile));
            setConfiguration(getCookie(StoreKeys.Configuration));
        }

        if (configuration) {
            api(`/operarios/?is_active=true`, 'GET');
        }
    }, []);

    const handleClose = (id: number | null) => {
        // close();
        if (id) {
            api(`/operarios/${id}/`, 'GET')
        } else {
            api(`/operarios/?is_active=true`, 'GET');
            setRefresh(Date.now().toString());
            close()
        }
    };

    useEffect(() => {
        if (state.data) {
            if (state.path.includes('operarios')) {
                if (state.path.includes("operarios/?is_active")) {
                    setActivos(state.data.count);
                } else {
                    open('operarios.form.new-item', <OperariosForm item={state.data} close={(id) => handleClose(id)}/>);
                }
            }
            if (state.path.includes('plannsat/productos')) {
                window.location.assign(state.data.url);
            }
        }

        if (state.error) {
            toast.error(state.error.detail);
        }
    }, [state]);

    const handleBaja = () => {
        const domain = getCookie(StoreKeys.Token).domain;
        api('/plannsat/productos/create_portal/', "POST", {
                customer: profile?.domain?.tenant?.stripe_id,
                back: `${process.env.REACT_APP_PROTOCOL}${domain}.${process.env.REACT_APP_DOMAIN}${process.env.REACT_APP_PORT}/configuracion`,
            },
        );
    };

    return (
        <PageBody
            newAction={(activos < configuration?.producto?.max_users) ? handleNewAction : undefined}
            newActionTitle={(activos < configuration?.producto?.max_users) ? 'operarios.button.new' : ""}
            title={'operarios.text.title'}
            infoText={'operarios.text.infoText'}
        >
            <>
                {profile.rol === 'superadmin' && activos >= configuration?.producto?.max_users ? (

                    <>
                        <div className={'mb-4'}>
                            {t('login.text.subscripcion.max-users')}
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

                <Table
                    path="/operarios"
                    refresh={refresh}
                    callBeforeDrawerClosed={handleClose}
                    onDelete={handleClose}
                    Form={OperariosForm}
                    withPagination
                    headers={[
                        {
                            key: 'name',
                            label: 'common.form-label.name'
                        },
                        {
                            key: 'email',
                            label: 'common.label.email',
                        },
                        {
                            key: 'is_active',
                            label: 'clients.label.active',
                        },
                    ]}
                />
            </>
        </PageBody>
    );
};
