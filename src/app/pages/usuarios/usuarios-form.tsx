import {useEffect, useState} from 'react';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {toast} from 'react-toastify';

import {Input} from '../../elements/input';
import {useTranslation} from 'react-i18next';
import {useHttpClient} from '../../shared/http-client';
import {FormFooter} from '../../elements/form-footer';
import {FieldError} from "../../elements/field-error/field-error";
import {Select} from "../../elements/select";
import {useCookies} from "../../shared/cookies";
import {StoreKeys} from "../../shared/store";

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
    })
};
const validacion = Yup.object().shape(obligado, [['password', 'password']]);

const initialValues = {
    email: '',
    first_name: '',
    last_name: '',
    mobile: '',
    password: null,
};

const roles = [
    {id: 1, name: 'Administrador', rol: "superadmin"},
    {id: 2, name: 'Usuario', rol: "usuario"},
]

export const UsuariosForm = ({
                                 item,
                                 close,
                                 doDelete
                             }: {
    item?: any;
    close: () => void;
    doDelete?: (item: any) => void;
}) => {

    const {t} = useTranslation();
    const {api, state} = useHttpClient();
    const [data, setData] = useState<any | null>(null);
    const {set: setCookie, get: getCookie} = useCookies();

    useEffect(() => {
        if (item) {
            setData(item);
        }
    }, [item]);

    const beforeSubmit = (values: any | null) => {

        const token = getCookie(StoreKeys.Token);

        const after = {...values}
        after.rol = roles.find((rol) => rol.id === values.rol)?.rol || "usuario";
        after.domain = token.domain_id;

        return after;
    };


    const onSubmit = async (values: any | null) => {
        //
        const enviaremos = beforeSubmit(values);

        if (enviaremos.id) {
            // update
            enviaremos.username = enviaremos.email;
            api(`/users/${enviaremos.id}/`, 'PATCH', enviaremos);
        } else {
            // create
            enviaremos.username = enviaremos.email;
            api('/users/', 'POST', enviaremos);
        }
    };

    useEffect(() => {

        if (state.data) {
            close();
        }

        if (state.error) {
            if ("email" in state.error.detail) {
                toast.error(state.error.detail.email[0]);
            } else {
                toast.error(state.error.detail);
            }
        }
    }, [state]);

    return (
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
                    {/*<pre>{JSON.stringify(item, null, 4)}</pre>*/}
                    {/*<pre>{JSON.stringify(errors, null, 4)}</pre>*/}

                    <Input
                        label={t('usuario.form.email')}
                        type="email"
                        placeholder={t('usuario.form.email')}
                        name="email"
                        value={values.email}
                        onChange={(value) =>
                            setFieldValue('email', value.email)
                        }
                    />
                    <FieldError touched={touched} errors={errors} field={"email"}/>

                    <Input
                        label={t('usuario.form.first_name')}
                        type="text"
                        placeholder={t('usuario.form.first_name')}
                        name="first_name"
                        value={values.first_name}
                        onChange={(value) =>
                            setFieldValue('first_name', value.first_name)
                        }
                    />
                    <FieldError touched={touched} errors={errors} field={"first_name"}/>

                    <Input
                        label={t('usuario.form.last_name')}
                        type="text"
                        placeholder={t('usuario.form.last_name')}
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
                                label={t('usuario.form.password')}
                                type="password"
                                placeholder={t('usuario.form.password')}
                                name="password"
                                value={values.password}
                                onChange={(value) =>
                                    setFieldValue('password', value.password)
                                }
                            />
                            <FieldError touched={touched} errors={errors} field={"password"}/>
                        </>
                    )}

                    <Select
                        label={t('usuario.form.rol')}
                        noMargin
                        name={"rol"}
                        placeholder={t('usuario.form.rol')}
                        onChange={(value) =>
                            setFieldValue('rol', value.rol)
                        }
                        value={values.rol === "usuario" || values.rol === "superadmin"
                            ? roles.find((rol: any) => rol.rol === values.rol)
                            : values.rol
                        }
                        items={roles}
                    />

                    <FormFooter
                        item={item}
                        doDelete={doDelete}
                        doSubmit={handleSubmit}
                        close={close}
                    />
                </form>
            )}
        </Formik>
    );
};
