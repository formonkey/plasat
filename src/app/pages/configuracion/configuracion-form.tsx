import {useEffect, useState} from 'react';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {toast} from 'react-toastify';

import {Input} from '../../elements/input';
import {useTranslation} from 'react-i18next';
import {useHttpClient} from '../../shared/http-client';
import {Toggle} from '../../elements/toggle';
import {Button} from "../../elements/button";
import {FileInputElement} from "../../elements/file-input";
import {FieldError} from "../../elements/field-error/field-error";
import {useCookies} from "../../shared/cookies";
import {StoreKeys} from "../../shared/store";
import {useGlobalStore} from "../../stores/global";

// construccion del objecto yup de validacion del cuestionario
let obligado = {
    name: Yup.string().required('obligatorio'),
    email: Yup.string().email('Introducir email válido').nullable(),
};
const validacion = Yup.object().shape(obligado);

const initialValues = {
    name: '',
    email: '',
};

export const ConfiguracionForm = () => {
    const {t} = useTranslation();
    const {api, state} = useHttpClient();
    const [data, setData] = useState<any | null>(null);
    const {set: setCookie, get: getCookie} = useCookies();

    const [provinces, setProvinces] = useState<any | null>([]);
    const [cities, setCities] = useState<any | null>([]);

    const updateConfiguration = useGlobalStore((state: any) => state.updateConfiguration);

    useEffect(() => {
        // api('/provincias/', 'GET');
    }, []);

    useEffect(() => {
        setData(getCookie(StoreKeys.Configuration))
    }, []);

    const beforeSubmit = (values: any | null) => {
        let after = {...values};

        after.producto = typeof values.producto === "object" ? values.producto.id : values.producto;

        return after;
    };

    const onSubmit = async (values: any | null) => {
        //
        const enviaremos = beforeSubmit(values);


        let formdata = new FormData();

        if (typeof enviaremos.logo === 'object' && enviaremos.logo) {
            formdata.append(
                'logo',
                enviaremos.logo.logo[0],
                enviaremos.logo.logo[0].name
            );
        }
        for (let key in enviaremos) {
            if (key !== 'logo') {
                if (key === 'fecha_baja') {
                    formdata.append(key, enviaremos[key] ? enviaremos[key] : "");
                } else {
                    if (enviaremos[key] !== null) {
                        formdata.append(key, enviaremos[key]);
                    }
                }
            }
        }

        console.log('enviaremos', enviaremos);

        if (enviaremos.id) {
            // update
            const config = getCookie(StoreKeys.Configuration)
            setCookie(StoreKeys.Configuration, {...config, ...enviaremos}, `.${process.env.REACT_APP_DOMAIN}`);
            updateConfiguration({...config, ...enviaremos})
            api(`/plannsat/clientes/${enviaremos.id}/`, 'PATCH', formdata, true);
        } else {
            // create
            api('/plannsat/clientes/', 'POST', formdata, true);
        }
    };

    useEffect(() => {
        if (state.data) {
            if (state.path.includes('provincias')) {
                setProvinces(state.data.results);
                api('/ciudades/?limit=999999', 'GET');
            }

            if (state.path.includes('ciudades')) {
                setCities(state.data.results);
                // const domain = getCookie(StoreKeys.Token).domain;
                // api(`/plannsat/clientes/?schema_name=${domain}`, 'GET');
            }

            if (state.path.includes('plannsat/clientes')) {
                if ("results" in state.data) {
                    setData(state.data.results[0]);
                } else {
                    setData(state.data);
                    toast.success(t('Datos guardados con éxito'));
                }
            }
        }


        if (state.error) {
            toast.error(state.error.detail);
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
                      isSubmitting
                  }) => (
                    <form onSubmit={handleSubmit} autoComplete="off">
                        {/*<pre>{JSON.stringify(values, null, 4)}</pre>*/}
                        {/*<pre>{JSON.stringify(errors, null, 4)}</pre>*/}

                        <div>
                            <Input
                                name="name"
                                label={t('configuracion.form.name')}
                                type="text"
                                value={values.name}
                                onChange={(value) =>
                                    setFieldValue('name', value.name)
                                }
                            />
                            <FieldError touched={touched} errors={errors} field={"name"}/>
                        </div>
                        <Input
                            name="nif"
                            label={t('configuracion.form.nif')}
                            type="text"
                            value={values.nif}
                            onChange={(value) =>
                                setFieldValue('nif', value.nif)
                            }
                        />

                        <div className="grid grid-cols-2 gap-1 justify-between items-center w-full mb-8">
                            <FileInputElement
                                label={t('configuracion.form.logo')}
                                name="logo"
                                onChange={(value) => setFieldValue('logo', value)}
                            />
                            {data?.logo && (
                                <img src={values.logo} alt="logo" className="w-1/2"/>
                            )}
                        </div>

                        <div className="grid grid-cols-3 gap-1 justify-between items-center w-full">

                            <div>
                                <Input
                                    name="email"
                                    label={t('configuracion.form.email')}
                                    type="email"
                                    value={values.email}
                                    onChange={(value) =>
                                        setFieldValue('email', value.email)
                                    }
                                />
                                <FieldError touched={touched} errors={errors} field={"email"}/>
                            </div>

                            <Input
                                name="telefono"
                                label={t('configuracion.form.telefono')}
                                type="text"
                                value={values.telefono}
                                onChange={(value) =>
                                    setFieldValue('telefono', value.telefono)
                                }
                            />

                            <Input
                                name="movil"
                                label={t('configuracion.form.movil')}
                                type="text"
                                value={values.movil}
                                onChange={(value) =>
                                    setFieldValue('movil', value.movil)
                                }
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-1 justify-between items-center w-full">
                            <Input
                                name="direccion"
                                label={t('configuracion.form.direccion')}
                                type="text"
                                value={values.direccion}
                                onChange={(value) =>
                                    setFieldValue('direccion', value.direccion)
                                }
                            />
                            <Input
                                name="cp"
                                label={t('configuracion.form.cp')}
                                type="text"
                                value={values.cp}
                                onChange={(value) =>
                                    setFieldValue('cp', value.cp)
                                }
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-1 justify-between items-center w-full">

                            <div>
                                <Input
                                    name="province"
                                    label={t('configuracion.form.province')}
                                    type="text"
                                    value={values.province}
                                    onChange={(value) =>
                                        setFieldValue('province', value.province)
                                    }
                                />
                                <FieldError touched={touched} errors={errors} field={"province"}/>
                            </div>
                            <div>
                                <Input
                                    name="city"
                                    label={t('configuracion.form.city')}
                                    type="text"
                                    value={values.city}
                                    onChange={(value) =>
                                        setFieldValue('city', value.city)
                                    }
                                />
                                <FieldError touched={touched} errors={errors} field={"city"}/>
                            </div>


                            {/*<Select*/}
                            {/*    name="province"*/}
                            {/*    label={t('configuracion.form.province')}*/}
                            {/*    placeholder="common.placeholder.select-value"*/}
                            {/*    items={provinces}*/}
                            {/*    value={values.province}*/}
                            {/*    onChange={(value) =>*/}
                            {/*        setFieldValue('province', value.province)*/}
                            {/*    }*/}
                            {/*/>*/}

                            {/*<Select*/}
                            {/*    name="city"*/}
                            {/*    label={t('configuracion.form.city')}*/}
                            {/*    placeholder="common.placeholder.select-value"*/}
                            {/*    items={cities}*/}
                            {/*    value={values.city}*/}
                            {/*    onChange={(value) =>*/}
                            {/*        setFieldValue('city', value.city)*/}
                            {/*    }*/}
                            {/*/>*/}
                        </div>

                        <Toggle
                            value={values.is_gas}
                            onChange={(value) => setFieldValue('is_gas', value.toggle)}
                            label={t('configuracion.form.is_gas')}
                        />

                        {/*<div className="grid grid-cols-3 gap-1 justify-between items-center w-full">*/}

                        {/*    <DateTimePicker*/}
                        {/*        type={'date'}*/}
                        {/*        value={values.fecha_baja}*/}
                        {/*        name={'fecha_baja'}*/}
                        {/*        label={t('configuracion.form.fecha_baja')}*/}
                        {/*        onChange={(value) =>*/}
                        {/*            setFieldValue(*/}
                        {/*                'fecha_baja',*/}
                        {/*                value.fecha_baja*/}
                        {/*            )*/}
                        {/*        }*/}

                        {/*    />*/}
                        {/*</div>*/}

                        <Button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            label={t('common.button.save')}
                        />

                    </form>
                )}
            </Formik>
        </div>
    );
};
