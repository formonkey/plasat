import {useEffect, useState} from 'react';
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

// construccion del objecto yup de validacion del cuestionario
let obligado = {
    first_name: Yup.string().required('obligatorio'),
    last_name: Yup.string().required('obligatorio'),
    email: Yup.string().email('Introducir email válido').required('obligatorio'),
    password: Yup.string().required('obligatorio').matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/,
        "La contraseña ha de contener al menos 8 caracteres, 1 letra mayúscula, 1 letra minúscula y 1 número."
    ),
};
const validacion = Yup.object().shape(obligado);

const initialValues = {
    first_name: '',
    last_name: '',
    email: '',
    password: '',
};

export const User = () => {
        const {t} = useTranslation();
        const navigate = useNavigate();
        const {api, state} = useHttpClient();
        const [data, setData] = useState<any | null>(null);
        const {get, set} = useStore();

        const [cliente, setCliente] = useState<any | null>(null);

        useEffect(() => {
            setCliente(get(StoreKeys.User))
        }, []);


        const beforeSubmit = (values: any | null) => {
            let after = {...values};

            after.username = values.email;
            after.domain = cliente?.id;
            after.rol = "superadmin";

            return after;
        };

        const onSubmit = async (values: any | null) => {
            //
            const enviaremos = beforeSubmit(values);

            console.log('enviaremos', enviaremos);

            api('/users/', 'POST', enviaremos);
        };

        useEffect(() => {
                if (state.data) {
                    if (state.path.includes('users')) {
                        navigate('/registro/products');
                    }
                }

                if (state.error) {
                    if ("email" in state.error.detail) {
                        toast.error(t(state.error.detail.email[0]));
                    } else {
                        toast.error(state.error.detail.detail);
                    }
                }
            }, [state]
        )
        ;

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
                                {t('registro.user.title')}
                            </h3>
                        </div>

                        <label className="block text-sm font-normal text-gray-700">
                            {t('registro.user.description')}
                        </label>


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

                                    <div className="grid grid-cols-2 gap-1 justify-between items-center w-full">
                                        <div>
                                            <Input
                                                name="first_name"
                                                label={t('user.form.first_name')}
                                                type="text"
                                                value={values.first_name}
                                                onChange={(value) =>
                                                    setFieldValue('first_name', value.first_name)
                                                }
                                            />
                                            <FieldError touched={touched} errors={errors} field={"first_name"}/>
                                        </div>

                                        <div>
                                            <Input
                                                name="last_name"
                                                label={t('user.form.last_name')}
                                                type="text"
                                                value={values.last_name}
                                                onChange={(value) =>
                                                    setFieldValue('last_name', value.last_name)
                                                }
                                            />
                                            <FieldError touched={touched} errors={errors} field={"last_name"}/>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-1 justify-between items-center w-full">

                                        <div>
                                            <Input
                                                name="email"
                                                label={t('user.form.email')}
                                                type="email"
                                                value={values.email}
                                                onChange={(value) =>
                                                    setFieldValue('email', value.email)
                                                }
                                            />
                                            <FieldError touched={touched} errors={errors} field={"email"}/>
                                        </div>

                                    </div>

                                    <div className="grid grid-cols-1 gap-1 justify-between items-center w-full">
                                        <div>
                                            <Input
                                                name="password"
                                                label={t('user.form.password')}
                                                type="password"
                                                value={values.password}
                                                onChange={(value) =>
                                                    setFieldValue('password', value.password)
                                                }
                                            />
                                            <FieldError touched={touched} errors={errors} field={"password"}/>
                                            <label className="block text-sm font-medium text-gray-700 text-xs mb-4">
                                                {t('registro.user.password')}
                                            </label>

                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-1 justify-end items-center w-full">
                                        <Button
                                            onClick={handleSubmit}
                                            disabled={isSubmitting}
                                            label={t('configuracion.button.save')}
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
