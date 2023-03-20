import React, {useEffect, useState} from 'react';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {toast} from 'react-toastify';

import {Input} from '../../elements/input';
import {useTranslation} from 'react-i18next';
import {useHttpClient} from '../../shared/http-client';
import {Button} from "../../elements/button";
import {FieldError} from "../../elements/field-error/field-error";
import {StoreKeys, useStore} from "../../shared/store";
import {useNavigate} from "react-router-dom";
import {CogIcon} from "@heroicons/react/outline";

// construccion del objecto yup de validacion del cuestionario
let obligado = {
    name: Yup.string().required('obligatorio'),
    nif: Yup.string().required('obligatorio'),
    email: Yup.string().email('Introducir email válido').required('obligatorio'),
    telefono: Yup.string().required('obligatorio'),
    direccion: Yup.string().required('obligatorio'),
    cp: Yup.string().required('obligatorio'),
    province: Yup.string().required('obligatorio'),
    city: Yup.string().required('obligatorio'),
    schema_name: Yup.string().required('obligatorio').matches(
        /^[a-z][a-z0-9]*$/,
        "solo letras minusculas y numeros"
    ),
};

// yup validate field contains only letters and numbers



const validacion = Yup.object().shape(obligado);

const initialValues = {
    name: '',
    nif: '',
    email: '',
    telefono: '',
    direccion: '',
    cp: '',
    province: '',
    city: '',
    schema_name: '',
};

export const Registro = () => {
        const {t} = useTranslation();
        const navigate = useNavigate();
        const {api, state} = useHttpClient();
        const {set, remove} = useStore();

        const [available, setAvailable] = useState<any | null>(null);

        useEffect(() => {
            remove();
        }, []);

        const beforeSubmit = (values: any | null) => {
            let after = {...values};

            return after;
        };

        const onSubmit = async (values: any | null) => {
            //
            const enviaremos = beforeSubmit(values);

            console.log('enviaremos', enviaremos);

            let formdata = new FormData();

            if (enviaremos.logo) {
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

            api('/plannsat/clientes/', 'POST', formdata, true);
        };

        useEffect(() => {
                if (state.data) {
                    if (state.path.includes('is_available')) {
                        setAvailable(state.data.available);
                    } else if (state.path.includes('plannsat/clientes')) {
                        set(StoreKeys.User, state.data);
                        navigate('/registro/user');
                    }
                }

                if (state.error) {
                    toast.error(t("common.error.tenant-exists"));
                }
            }, [state]
        )
        ;

        const handleComprueba = (name: string) => {
            if (name && name !== "") {
                api(`/plannsat/clientes/is_available/?domain=${name}`, 'GET');
            } else {
                setAvailable(null);
            }
        }

        return (
            <div className="min-h-full flex flex-col justify-center py-12 px-2 sm:px-6 lg:px-8 bg-[#ebefff] w-full">
                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
                    <div className="space-y-8">
                        <div className="sm:mx-auto sm:w-full sm:max-w-md">
                            <img
                                className="h-32"
                                src="/logo.svg"
                                alt="Workflow"
                            />
                        </div>

                        <div className="sm:w-full sm:max-w-md">
                            <h3
                                className={
                                    'font-bold mb-2 text-logo text-2xl'
                                }
                            >
                                {t('registro.text.title')}
                            </h3>
                        </div>

                        <Formik
                            enableReinitialize={true}
                            initialValues={initialValues}
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

                                    <div className="grid grid-cols-2 gap-1 justify-between items-center w-full">
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

                                        <div>
                                            <Input
                                                name="nif"
                                                label={t('configuracion.form.nif')}
                                                type="text"
                                                value={values.nif}
                                                onChange={(value) =>
                                                    setFieldValue('nif', value.nif)
                                                }
                                            />
                                            <FieldError touched={touched} errors={errors} field={"nif"}/>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-1 justify-between items-center w-full">

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

                                        <div>
                                            <Input
                                                name="telefono"
                                                label={t('configuracion.form.telefono')}
                                                type="text"
                                                value={values.telefono}
                                                onChange={(value) =>
                                                    setFieldValue('telefono', value.telefono)
                                                }
                                            />
                                            <FieldError touched={touched} errors={errors} field={"telefono"}/>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-1 justify-between items-center w-full">
                                        <div>
                                            <Input
                                                name="direccion"
                                                label={t('configuracion.form.direccion')}
                                                type="text"
                                                value={values.direccion}
                                                onChange={(value) =>
                                                    setFieldValue('direccion', value.direccion)
                                                }
                                            />
                                            <FieldError touched={touched} errors={errors} field={"direccion"}/>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-1 justify-between items-center w-full">
                                        <div>
                                            <Input
                                                name="cp"
                                                label={t('configuracion.form.cp')}
                                                type="text"
                                                value={values.cp}
                                                onChange={(value) =>
                                                    setFieldValue('cp', value.cp)
                                                }
                                            />
                                            <FieldError touched={touched} errors={errors} field={"cp"}/>
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
                                    </div>

                                    <label className="block text-sm font-normal text-gray-700">
                                        {' '}
                                        {t('configuracion.form.choose')}
                                    </label>

                                    {available === true
                                        ? <p className="text-green-500 text-xs italic mt-4">
                                            Disponible
                                            {available ? ` ${values.schema_name}.plannsat.com` : ""}
                                        </p>
                                        : available === false
                                            ? <p className="text-red-500 text-xs italic mt-4">No disponible</p>
                                            : <p className="text-gray-500 text-xs italic"></p>
                                    }

                                    <div className="flex flex-row space-x-2 justify-between items-center w-full">
                                        <div className={"flex flex-col justify-center items-center flex-1"}>
                                            <Input
                                                name="schema_name"
                                                label={t('configuracion.form.schema_name')}
                                                type="text"
                                                value={values.schema_name}
                                                onFocus={() => {
                                                    setFieldValue('schema_name', "")
                                                    setAvailable(null)
                                                }}
                                                onChange={(value) =>
                                                    setFieldValue('schema_name', value.schema_name)
                                                }
                                            />
                                            <FieldError touched={touched} errors={errors} field={"schema_name"}/>
                                        </div>
                                        <div className={"mb-[12px]"}>
                                            <Button
                                                onClick={() => handleComprueba(values.schema_name)}
                                                label={t('configuracion.button.comprobar')}
                                            />
                                        </div>
                                    </div>


                                    <div className="grid grid-cols-1 gap-1 justify-end items-center w-full">
                                        <Button
                                            onClick={handleSubmit}
                                            disabled={isSubmitting}
                                            label={!state.isLoading ? t('configuracion.button.save') : ""}
                                            icon={state.isLoading
                                                ? <CogIcon className={"h-6 w-6 text-gray-400 animate-spin"}/>
                                                : undefined}
                                        />
                                    </div>

                                </form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>
        );
    }
;
