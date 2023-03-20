import { useEffect, useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

import { Input } from '../../elements/input';
import { useTranslation } from 'react-i18next';
import { useHttpClient } from '../../shared/http-client';
import { FormFooter } from '../../elements/form-footer';
import { DatePicker } from '../../elements/date-picker';
import {FieldError} from "../../elements/field-error/field-error";

// construccion del objecto yup de validacion del cuestionario
let obligado = {
    name: Yup.string().required('obligatorio')
};
const validacion = Yup.object().shape(obligado);

const initialValues = {
    name: '',
    province: {}
};

export const TicketsForm = ({
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
        // api('/provincias/', 'GET');
    }, []);

    useEffect(() => {
        if (item) {
            setData(item);
        }
    }, [item]);

    const beforeSubmit = (values: any | null) => {
        let after = { ...values };

        after.province =
            typeof values.province === 'object'
                ? values.province.id
                : values.province;

        // TODO: delete this in real form
        after.intervencion = 53;

        return after;
    };

    const onSubmit = async (values: any | null) => {
        //
        const enviaremos = beforeSubmit(values);

        if (enviaremos.id) {
            // update
            api(`/tickets/${enviaremos.id}/`, 'PATCH', enviaremos);
        } else {
            // create
            api('/tickets/', 'POST', enviaremos);
        }
    };

    useEffect(() => {

        if (state.data) {
            if (state.path.includes('tickets')) {
                close();
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
                        <Input
                            name="name"
                            label={t('ticket.form.name')}
                            type="text"
                            placeholder={t('ticket.form.name')}
                            value={values.name}
                            onChange={(value) =>
                                setFieldValue('name', value.name)
                            }
                        />
                        <FieldError touched={touched} errors={errors} field={"name"}/>

                        <DatePicker
                            name={'fecha'}
                            label={t('ticket.form.fecha')}
                            onChange={(value: any) =>
                                setFieldValue('fecha', value.fecha)
                            }
                        />

                        <Input
                            name="importe"
                            label={t('ticket.form.importe')}
                            type="number"
                            placeholder={t('ticket.form.importe')}
                            value={values.importe}
                            onChange={(value) =>
                                setFieldValue('importe', value.importe)
                            }
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
        </div>
    );
};
