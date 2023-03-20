import { useEffect, useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

import { Input } from '../../elements/input';
import { useTranslation } from 'react-i18next';
import { useHttpClient } from '../../shared/http-client';
import { FormFooter } from '../../elements/form-footer';
import {FieldError} from "../../elements/field-error/field-error";

// construccion del objecto yup de validacion del cuestionario
let obligado = {
    name: Yup.string().required('obligatorio'),
    numero_meses: Yup.number().required('obligatorio').moreThan(0, "valor mayor que 0").lessThan(100, "valor inferior a 100").nullable(),
};
const validacion = Yup.object().shape(obligado);

const initialValues = {
    name: '',
    numero_meses: null
};

export const PeriodicidadesForm = ({
    item,
    close,
    doDelete
}: {
    item?: any;
    close: () => void;
    doDelete?: (item: any) => void;
}) => {
    const { t } = useTranslation();
    const { api, state } = useHttpClient();
    const [data, setData] = useState<any | null>(null);

    useEffect(() => {
        if (item) {
            setData(item);
        }
    }, [item]);

    const beforeSubmit = (values: any | null) => {
        return { ...values };
    };

    const onSubmit = async (values: any | null) => {
        //
        const enviaremos = beforeSubmit(values);

        if (enviaremos.id) {
            // update
            api(`/periodicidades/${enviaremos.id}/`, 'PATCH', enviaremos);
        } else {
            // create
            api('/periodicidades/', 'POST', enviaremos);
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
                            label={t('periodicidad.form.name')}
                            type="text"
                            placeholder={t('periodicidad.form.name')}
                            name="name"
                            value={values.name}
                            onChange={(value) =>
                                setFieldValue('name', value.name)
                            }
                        />
                        <FieldError touched={touched} errors={errors} field={"name"}/>

                        <Input
                            label={t('periodicidad.form.numero_meses')}
                            type="number"
                            placeholder={t('periodicidad.form.numero_meses')}
                            name="numero_meses"
                            value={values.numero_meses}
                            onChange={(value) =>
                                setFieldValue(
                                    'numero_meses',
                                    value.numero_meses
                                )
                            }
                        />
                        <FieldError touched={touched} errors={errors} field={"numero_meses"}/>

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

