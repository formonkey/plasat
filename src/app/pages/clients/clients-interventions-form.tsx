import * as Yup from 'yup';

import {Formik} from 'formik';
import {toast} from 'react-toastify';
import {useEffect, useState} from 'react';

import {noop} from '../../utils';
import {Input} from '../../elements/input';
import {Toggle} from '../../elements/toggle';
import {Select} from '../../elements/select';
import {useTranslation} from 'react-i18next';
import {FormFooter} from '../../elements/form-footer';
import {useHttpClient} from '../../shared/http-client';
import {FieldError} from '../../elements/field-error/field-error';
import {DateTimePicker} from '../../elements/date-time-picker';

const fields = {
    numero: Yup.string().required('obligatorio'),
    tipo_intervencion: Yup.number().required('obligatorio').nullable(),
    fecha_estimacion_inicio: Yup.date().required('obligatorio').nullable(),
    cliente: Yup.number().nullable(),
    instalacion: Yup.number().nullable()
};

const validations = Yup.object().shape(fields);

const initialValues = {
    numero: '',
    facturar: false,
    fecha_estimacion_inicio: null,
    tipo_intervencion: null,
};

export const ClientsInterventionForm = ({
                                            id,
                                            item,
                                            close
                                        }: {
    item?: any;
    close: () => void;
    id: string;
}) => {
    const {t} = useTranslation();
    const {api, state} = useHttpClient();
    const [interventionTypes, setInterventionTypes] = useState<any | null>([]);
    const [clients, setClients] = useState<any | null>([]);
    const [installations, setInstallations] = useState<any | null>([]);

    const [data, setData] = useState<any | null>({
        ...initialValues,
        cliente: id,
    });

    useEffect(() => {
        api('/tipos-intervencion/?limit=9999', 'GET');
        api('/clientes/?limit=9999', 'GET');
        api(`/instalaciones/?limit=999999&cliente=${id}`, 'GET');
    }, []);

    useEffect(() => {
        if (item) {
            setData({...data, ...item, cliente: id});
        }
    }, [item]);

    const onSubmit = async (values: any | null) => {
        if (values.id) {
            api(`/intervenciones/${values.id}/`, 'PATCH', values);
        } else {
            api('/intervenciones/', 'POST', values);
        }
    };

    useEffect(() => {
        if (state.data) {
            if (state.path.includes('tipos-intervencion')) {
                setInterventionTypes(state.data.results);
            }

            if (state.path.includes('clientes')) {
                setClients(state.data.results);
            }

            if (state.path.includes('instalaciones')) {
                setInstallations(state.data.results);
            }

            if (state.path.includes('intervenciones')) {
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
                validationSchema={validations}
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
                  }) => {
                    return <form onSubmit={handleSubmit} autoComplete="off">

                        <Input
                            name="numero"
                            label={t('common.label.number')}
                            type="text"
                            placeholder={t('common.placeholder.number')}
                            value={values.numero}
                            onChange={(value) =>
                                setFieldValue('numero', value.numero)
                            }
                        />
                        <FieldError touched={touched} errors={errors} field={"numero"}/>

                        <Select
                            name="tipo_intervencion"
                            label={t('common.label.intervention-types')}
                            placeholder="common.label.select-value"
                            items={interventionTypes}
                            value={values.tipo_intervencion}
                            onChange={(value) =>
                                setFieldValue(
                                    'tipo_intervencion',
                                    value.tipo_intervencion
                                )
                            }
                        />
                        <FieldError touched={touched} errors={errors} field={"tipo_intervencion"}/>

                        <Toggle
                            value={values.facturar}
                            onChange={(value) =>
                                setFieldValue('facturar', value.toggle)
                            }
                            label={t('client.intervention-form.bill')}
                        />

                        <div className="grid grid-cols-2 gap-1 justify-between items-center w-full">
                            <div>

                                <DateTimePicker
                                    type={'time'}
                                    value={values.fecha_estimacion_inicio}
                                    name={'fecha_estimacion_inicio'}
                                    label={t(
                                        'intervencion.form.fecha_estimacion_inicio'
                                    )}
                                    onChange={(value) => {
                                        setFieldValue(
                                            'fecha_estimacion_inicio',
                                            value.fecha_estimacion_inicio
                                        );
                                    }}
                                />
                                <FieldError touched={touched} errors={errors} field={"fecha_estimacion_inicio"}/>
                            </div>

                            <DateTimePicker
                                type={'time'}
                                value={values.fecha_estimacion_final}
                                min={values.fecha_estimacion_inicio}
                                name={'fecha_estimacion_final'}
                                label={t(
                                    'intervencion.form.fecha_estimacion_final'
                                )}
                                onChange={(value) => {
                                    setFieldValue(
                                        'fecha_estimacion_final',
                                        value.fecha_estimacion_final
                                    );
                                }}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-1 justify-between items-center w-full">
                            <Select
                                name="cliente"
                                disabled={true}
                                label={t('common.label.client')}
                                placeholder="common.label.select-value"
                                items={clients}
                                value={id}
                                onChange={noop}
                            />
                            <Select
                                name="instalacion"
                                label={t('common.label.installation')}
                                placeholder="common.label.select-value"
                                items={installations}
                                value={values.instalacion}
                                onChange={(value) =>
                                    setFieldValue(
                                        'instalacion',
                                        value.instalacion
                                    )
                                }
                            />
                        </div>

                        <FormFooter
                            item={item}
                            close={close}
                            doSubmit={handleSubmit}
                        />
                    </form>
                }}
            </Formik>
        </div>
    );
};
