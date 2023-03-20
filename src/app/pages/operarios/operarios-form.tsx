import {useEffect, useState} from 'react';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {toast} from 'react-toastify';

import {Input} from '../../elements/input';
import {Select} from '../../elements/select';
import {useTranslation} from 'react-i18next';
import {useHttpClient} from '../../shared/http-client';
import {FormFooter} from '../../elements/form-footer';
import {FieldError} from "../../elements/field-error/field-error";
import {useCookies} from "../../shared/cookies";
import {StoreKeys} from "../../shared/store";
import {Toggle} from "../../elements/toggle";

// construccion del objecto yup de validacion del cuestionario
let obligado = {
    email: Yup.string().email('Introducir email válido').required('obligatorio'),
    first_name: Yup.string().required('obligatorio'),
    last_name: Yup.string().required('obligatorio'),
    password: Yup.string().nullable().when('password', (val) => {
        if (val || val === null) {
            return Yup.string().nullable().required('obligatorio').matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/,
                "La contraseña ha de contener al menos 8 caracteres, 1 letra mayúscula, 1 letra minúscula y 1 número."
            );
        } else {
            return Yup.string().nullable().notRequired();
        }
    }),
    precio_hora: Yup.number().nullable().when('password', (val) => {
        if (val || val === null) {
            return Yup.number().nullable().moreThan(0, "valor mayor que 0");
        } else {
            return Yup.string().nullable().notRequired();
        }
    }),
};

const validacion = Yup.object().shape(obligado, [['password', 'password']]);

const initialValues = {
    email: '',
    first_name: '',
    last_name: '',
    mobile: '',
    password: null,
    precio_hora: null,
    is_active: true,
};

export const OperariosForm = ({
                                  item,
                                  close,
                                  doDelete
                              }: {
    item?: any;
    close: (id: number | null) => void;
    doDelete?: (item: any) => void;
}) => {

    const {t} = useTranslation();
    const {get} = useCookies();
    const {api, state} = useHttpClient();
    const [data, setData] = useState<any | null>(null);
    const [categorias, setCategorias] = useState<any | null>([]);
    const [proveedores, setProveedores] = useState<any | null>([]);

    useEffect(() => {
        api('/categorias-operario', 'GET');
        api('/proveedores-externo', 'GET');
        if (item) {
            const datos = {...item};
            if (datos.profile) {
                datos.mobile = item.profile.mobile;
                datos.precio_hora = item.profile.precio_hora;
                datos.categoria = item.profile.categoria || {};
                datos.proveedor_externo = item.profile.proveedor_externo || {};
            }
            setData(datos);
        }
    }, [item]);

    const beforeSubmit = (values: any | null) => {
        let after = {...values};

        console.log('after', after);

        if (values.profile) {
            after.profile.mobile = values.mobile || '';
            after.profile.categoria =
                typeof values.categoria === 'object' ? null : values.categoria;
            after.profile.proveedor_externo =
                typeof values.proveedor_externo === 'object'
                    ? null
                    : values.proveedor_externo;
            after.profile.precio_hora = after.precio_hora === '' ? null : after.precio_hora;
        }

        delete after.mobile;
        delete after.precio_hora;
        delete after.categoria;
        delete after.proveedor_externo;

        after.domain = get(StoreKeys.Token).domain_id;

        return after;
    };

    const onSubmit = async (values: any | null) => {
        //
        const enviaremos = beforeSubmit(values);

        if (enviaremos.id) {
            // update
            enviaremos.username = enviaremos.email;
            api(`/operarios/${enviaremos.id}/`, 'PATCH', enviaremos);
            if (enviaremos.profile) {
                api(
                    `/perfiles/${enviaremos.profile.id}/`,
                    'PATCH',
                    enviaremos.profile
                );
            }
        } else {
            // create
            enviaremos.username = enviaremos.email;
            api('/operarios/', 'POST', enviaremos);
        }
    };

    useEffect(() => {
        if (state.data) {
            if (state.path.includes('categorias')) {
                setCategorias(state.data.results);
            }

            if (state.path.includes('proveedores')) {
                setProveedores(state.data.results);
            }

            if (state.path.includes('operarios')) {
                if (!item) {
                    console.log('operarios', state.data);
                    close(state.data.id);
                }
            }
            if (state.path.includes('perfiles')) {
                close(null);
            }
        }

        if (state.error) {
            if ("email" in state.error.detail) {
                toast.error(state.error.detail.email[0]);
            } else if ("error_max_users" in state.error.detail) {
                toast.error(state.error.detail.error_max_users);
            } else {
                toast.error(state.error.detail);
            }
        }
    }, [state]);

    return (
        <div>
            <Formik
                enableReinitialize={true}
                initialValues={data || initialValues}
                validationSchema={validacion}
                validateOnBlur={true}
                onSubmit={onSubmit}
            >
                {({
                      values,
                      errors,
                      touched,
                      setFieldValue,
                      handleSubmit,
                  }) => (
                    <form onSubmit={handleSubmit} autoComplete="off">
                        {/*<pre>{JSON.stringify(item, null, 4)}</pre>*/}
                        {/*<pre>{JSON.stringify(errors, null, 4)}</pre>*/}

                        <Input
                            label={t('operario.form.email')}
                            type="email"
                            placeholder={t('operario.form.email')}
                            name="email"
                            value={values.email}
                            onChange={(value) =>
                                setFieldValue('email', value.email)
                            }
                        />
                        <FieldError touched={touched} errors={errors} field={"email"}/>

                        <Input
                            label={t('operario.form.first_name')}
                            type="text"
                            placeholder={t('operario.form.first_name')}
                            name="first_name"
                            value={values.first_name}
                            onChange={(value) =>
                                setFieldValue('first_name', value.first_name)
                            }
                        />
                        <FieldError touched={touched} errors={errors} field={"first_name"}/>

                        <Input
                            label={t('operario.form.last_name')}
                            type="text"
                            placeholder={t('operario.form.last_name')}
                            name="last_name"
                            value={values.last_name}
                            onChange={(value) =>
                                setFieldValue('last_name', value.last_name)
                            }
                        />
                        <FieldError touched={touched} errors={errors} field={"last_name"}/>

                        {!item && (
                            <>
                                <Input
                                    label={t('operario.form.password')}
                                    type="password"
                                    placeholder={t('operario.form.password')}
                                    name="password"
                                    value={values.password}
                                    onChange={(value) =>
                                        setFieldValue('password', value.password)
                                    }
                                />
                                <FieldError touched={touched} errors={errors} field={"password"}/>
                            </>
                        )}

                        {item && (
                            <div>
                                <Input
                                    label={t('operario.form.mobile')}
                                    type="text"
                                    placeholder={t('operario.form.mobile')}
                                    name="mobile"
                                    value={values.mobile}
                                    onChange={(value) =>
                                        setFieldValue('mobile', value.mobile)
                                    }
                                />

                                <Select
                                    name="categoria"
                                    label={t('operario.form.categoria')}
                                    placeholder="common.placeholder.select-value"
                                    items={categorias}
                                    value={values.categoria}
                                    onChange={(value) =>
                                        setFieldValue(
                                            'categoria',
                                            value.categoria
                                        )
                                    }
                                />

                                <div className={"text-[9px] -mt-4 mb-4"}>
                                    {t("operarios.label.precio-categoria")}
                                    {" "}
                                    {typeof values.categoria === "number" && categorias.find((c: any) => c.id === values.categoria)?.precio_hora}
                                    {t("€/hora")}
                                </div>

                                <Input
                                    label={t('operario.form.precio_hora')}
                                    type="number"
                                    placeholder={t('operario.form.precio_hora')}
                                    name="precio_hora"
                                    value={values.precio_hora}
                                    onChange={(value) =>
                                        setFieldValue(
                                            'precio_hora',
                                            value.precio_hora
                                        )
                                    }
                                    extraHolder={'€ / Hora'}
                                />
                                <FieldError touched={touched} errors={errors} field={"precio_hora"}/>

                                <Select
                                    name="proveedor_externo"
                                    label={t('operario.form.proveedor_externo')}
                                    placeholder="common.placeholder.select-value"
                                    items={proveedores}
                                    value={values.proveedor_externo}
                                    onChange={(value) =>
                                        setFieldValue(
                                            'proveedor_externo',
                                            value.proveedor_externo
                                        )
                                    }
                                />
                            </div>
                        )}

                        <div className="flex space-x-[24px] pb-16">
                            <div className="w-1/2"/>
                            <div className="w-1/2">
                                <Toggle
                                    label={t('common.label.active-operario')}
                                    value={values.is_active}
                                    onChange={(value) =>
                                        setFieldValue('is_active', value.toggle)
                                    }
                                />
                            </div>
                        </div>

                        <FormFooter
                            item={item}
                            doDelete={doDelete}
                            doSubmit={handleSubmit}
                            close={() => close(null)}
                        />
                    </form>
                )}
            </Formik>
        </div>
    );
};
