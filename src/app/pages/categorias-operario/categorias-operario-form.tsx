import {useEffect, useState} from 'react';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {toast} from 'react-toastify';

import {Input} from '../../elements/input';
import {useTranslation} from 'react-i18next';
import {useHttpClient} from '../../shared/http-client';
import {FormFooter} from '../../elements/form-footer';
import {FieldError} from "../../elements/field-error/field-error";

// construccion del objecto yup de validacion del cuestionario
let obligado = {
    name: Yup.string().required('obligatorio'),
    precio_hora: Yup.number().nullable().when('password', (val) => {
        if (val || val === null) {
            return Yup.number().nullable().moreThan(0, "valor mayor que 0");
        } else {
            return Yup.string().nullable().notRequired();
        }
    }),
};

const validacion = Yup.object().shape(obligado);

const initialValues = {
    name: '',
    precio_hora: null
};

export const CategoriasOperarioForm = ({
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

    useEffect(() => {
        if (item) {
            setData(item);
        }
    }, [item]);

    const beforeSubmit = (values: any | null) => {
        const after = {...values};
        after.precio_hora = after.precio_hora === '' ? null : after.precio_hora;
        return {...after};
    };

    const onSubmit = async (values: any | null) => {
        const enviaremos = beforeSubmit(values);

        if (enviaremos.id) {
            // update
            api(`/categorias-operario/${enviaremos.id}/`, 'PATCH', enviaremos);
        } else {
            // create
            api('/categorias-operario/', 'POST', enviaremos);
        }
    };

    useEffect(() => {
        if (state.data) {
            close();
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
                        {/*<pre>{JSON.stringify(item, null, 4)}</pre>*/}
                        {/*<pre>{JSON.stringify(errors, null, 4)}</pre>*/}

                        <Input
                            label={t('categoria-operario.form.name')}
                            type="text"
                            placeholder={t('categoria-operario.form.name')}
                            name="name"
                            value={values.name}
                            onChange={(value) =>
                                setFieldValue('name', value.name)
                            }
                        />
                        <FieldError touched={touched} errors={errors} field={"name"}/>

                        <Input
                            label={t('categoria-operario.form.precio_hora')}
                            type="number"
                            placeholder={t(
                                'categoria-operario.form.precio_hora'
                            )}
                            name="precio_hora"
                            value={values.precio_hora}
                            onChange={(value) =>
                                setFieldValue('precio_hora', value.precio_hora)
                            }
                        />
                        <FieldError touched={touched} errors={errors} field={"precio_hora"}/>

                        <FormFooter
                            item={item}
                            doDelete={doDelete}
                            doSubmit={handleSubmit}
                            close={close}
                        />
                    </form>
                )}
            </Formik>
        </div>
    );
};
