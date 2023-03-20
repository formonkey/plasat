import { useEffect, useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

import { Input } from '../../elements/input';
import { useTranslation } from 'react-i18next';
import { useHttpClient } from '../../shared/http-client';
import { FormFooter } from '../../elements/form-footer';
import { DatePicker } from '../../elements/date-picker';

// construccion del objecto yup de validacion del cuestionario
let obligado = {
    name: Yup.string().required('obligatorio')
};
const validacion = Yup.object().shape(obligado);

const initialValues = {
    name: '',
    fecha: null
};

export const FirmasIntervencionEditForm = ({
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
        // api(`/operarios/`, 'GET');
    }, []);

    useEffect(() => {
        if (item) {
            setData(item);
        }
    }, [item]);

    const beforeSubmit = (values: any | null) => {
        let after = { ...values };

        after.operario =
            typeof values.operario === 'object'
                ? values.operario?.id ?? null
                : values.operario;

        delete after.equipo;
        delete after.imagen;
        delete after.imagen_url;
        delete after.operaciones_equipo;

        return { ...after };
    };

    const onSubmit = async (values: any | null) => {
        //
        const enviaremos = beforeSubmit(values);

        if (enviaremos.id) {
            // update
            api(`/firmas/${enviaremos.id}/`, 'PATCH', enviaremos);
        } else {
            // create
            api('/firmas/', 'POST', enviaremos);
        }
    };

    useEffect(() => {
        if (state.data) {
            if (state.path.includes('firmas')) {
                close();
            }
        }

        if (state.error) {
            toast.error(state.error.detail);
        }
    }, [state]);

    return (
        <div>
            <div className="flex flex-col mb-4">
                <div className={'font-bold text-xl'}>{data?.name}</div>
            </div>

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
                    setFieldValue,
                    handleSubmit,
                    isSubmitting
                }) => (
                    <form onSubmit={handleSubmit} autoComplete="off">
                        {/*<pre>{JSON.stringify(item, null, 4)}</pre>*/}
                        {/*<pre>{JSON.stringify(errors, null, 4)}</pre>*/}

                        <DatePicker
                            value={values.fecha}
                            name={'fecha'}
                            label={t('intervencion.form.fecha')}
                            onChange={(value) =>
                                setFieldValue('fecha', value.fecha)
                            }
                        />

                        <Input
                            value={values.name}
                            label={t('intervencion.form.name')}
                            type="text"
                            name="name"
                            placeholder={t('intervencion.form.name')}
                            onChange={(value) =>
                                setFieldValue('name', value.name)
                            }
                        />

                        {data?.imagen && <img src={data.imagen}/>}

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

