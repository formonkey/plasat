import * as Yup from 'yup';

import {useEffect, useState} from 'react';

import {Formik} from 'formik';
import {toast} from 'react-toastify';

import {Input} from '../../elements/input';
import {useTranslation} from 'react-i18next';
import {useHttpClient} from '../../shared/http-client';
import {FormFooter} from '../../elements/form-footer';
import dayjs from 'dayjs';
import {DateTimePicker} from '../../elements/date-time-picker';
import {SelectAsync} from '../../elements/select-async';
import {Toggle} from '../../elements/toggle';
import {FieldError} from "../../elements/field-error/field-error";

const fields = {
    fecha_pago: Yup.string().required('obligatorio').nullable(),
    importe: Yup.string().required('obligatorio').nullable(),
    cliente: Yup.mixed().required('obligatorio').nullable(),
};

const validations = Yup.object().shape(fields);

const initialValues = {
    importe: '',
    fecha_pago: new Date(),
    cliente: null,
    instalacion: null,
};

export const PagosForm = ({
                              item,
                              close
                          }: {
    item?: any;
    close: () => void;
}) => {
    const {t} = useTranslation();
    const {api, state, options} = useHttpClient();
    const [installations, setInstallations] = useState<any | null>([]);
    const [interventions, setInterventions] = useState<any | null>([]);

    const [data, setData] = useState<any | null>({
        ...initialValues
    });

    console.log('item', item);

    const beforeSubmit = (values: any | null) => {
        let after = {...values};


        after.cliente = values.cliente ? values.cliente.id : null;
        after.fecha_pago = dayjs(values.fecha_pago).format("YYYY-MM-DD");
        after.instalacion = values.instalacion ? values.instalacion.id : null;
        after.intervencion = values.intervencion
            ? values.intervencion.id
            : null;
        if (values.tipo_intervencion) {
            after.tipo_intervencion =
                typeof values.tipo_intervencion === 'object'
                    ? values.tipo_intervencion.id
                    : values.tipo_intervencion;
        }

        return after;
    };

    const onSubmit = (values: any | null) => {
        const enviaremos = beforeSubmit(values);

        if (values.id) {
            api(`/pagos/${values.id}/`, 'PATCH', enviaremos);
        } else {
            api(`/pagos/`, 'POST', enviaremos);
        }
    };

    useEffect(() => {
        if (item) {
            setData({...data, ...item});
        }
    }, [item]);

    useEffect(() => {
        if (state.data) {
            if (state.path.includes('instalaciones')) {
                setInstallations(state.data.results);
            }

            if (state.path.includes('intervenciones')) {
                setInterventions(
                    state.data.results.map((item: any) => ({
                        id: item.id,
                        name: item.id
                    }))
                );
            }

            if (state.path.includes('pagos')) {
                close();
            }
        }

        if (state.error) {
            toast.error(state.error.detail);
        }
    }, [state]);


    return (
        <Formik
            onSubmit={onSubmit}
            initialValues={data || initialValues}
            validateOnBlur={true}
            enableReinitialize={true}
            validationSchema={validations}
        >
            {({
                  values,
                  errors,
                  touched,
                  setFieldValue,
                  handleSubmit,
              }) => (
                <form onSubmit={handleSubmit} autoComplete="off">
                    {/*<pre>{JSON.stringify(values, null, 4)}</pre>*/}
                    {/*<pre>{JSON.stringify(errors, null, 4)}</pre>*/}

                    {item && (
                        <div className="w-full">
                            <Input
                                type="number"
                                name="importe"
                                value={values.importe}
                                label="common.label.importe"
                                placeholder="common.label.importe"
                                onChange={(value) =>
                                    setFieldValue('importe', value.importe)
                                }
                            />
                            <FieldError touched={touched} errors={errors} field={"importe"}/>

                            <DateTimePicker
                                type="date"
                                value={values.fecha_pago}
                                name={'fecha_pago'}
                                label={t('intervencion.form.fecha_pago')}
                                onChange={(value) => {
                                    setFieldValue(
                                        'fecha_pago',
                                        dayjs(value.fecha_pago).format(
                                            'YYYY-MM-DD'
                                        )
                                    );
                                }}
                            />
                            <FieldError touched={touched} errors={errors} field={"fecha_pago"}/>
                        </div>
                    )}

                    {!item && (
                        <>
                            <SelectAsync
                                name={'cliente'}
                                label={'intervencion.form.cliente'}
                                placeholder="common.placeholder.select-value"
                                items={(inputValue: string) => {
                                    return options(
                                        `/clientes/?limit=9999&name=${inputValue}`
                                    );
                                }}
                                value={values.cliente}
                                onChange={(value) => {
                                    // setCliente(value.cliente);
                                    setFieldValue('cliente', value || {});
                                    if (value) {
                                        api(
                                            `/instalaciones/?limit=999999&cliente=${value.id}`,
                                            'GET'
                                        );
                                    }
                                }}
                            />
                            <FieldError touched={touched} errors={errors} field={"importe"}/>
                        </>
                    )}


                    {!item && (
                        <div>
                            <DateTimePicker
                                type="date"
                                value={values.fecha_pago}
                                name={'fecha_pago'}
                                label={t(
                                    'intervencion.form.fecha_pago'
                                )}
                                onChange={(value) => {
                                    setFieldValue(
                                        'fecha_pago',
                                        value.fecha_pago
                                    );
                                }}
                            />
                        </div>
                    )}

                    {!item && (
                        <div>
                            <Input
                                type="number"
                                name="importe"
                                value={values.importe}
                                label="common.label.importe"
                                placeholder="common.label.importe"
                                onChange={(value) =>
                                    setFieldValue('importe', value.importe)
                                }
                            />
                            <FieldError touched={touched} errors={errors} field={"importe"}/>
                        </div>
                    )}

                    {/*{!item && (*/}
                    {/*    <>*/}
                    {/*        <Select*/}
                    {/*            name="instalacion"*/}
                    {/*            disabled={!installations?.length}*/}
                    {/*            label={t('common.label.installation')}*/}
                    {/*            placeholder="common.label.select-value"*/}
                    {/*            items={installations}*/}
                    {/*            value={values.instalacion}*/}
                    {/*            onChange={(value) => {*/}
                    {/*                setFieldValue('instalacion', value.instalacion);*/}
                    {/*                if (value) {*/}
                    {/*                    api(*/}
                    {/*                        `/intervenciones/?instalacion=${value.instalacion}`,*/}
                    {/*                        'GET'*/}
                    {/*                    );*/}
                    {/*                }*/}
                    {/*            }}*/}
                    {/*        />*/}
                    {/*        <FieldError touched={touched} errors={errors} field={"instalacion"}/>*/}
                    {/*    </>*/}
                    {/*)}*/}

                    {/*{!item && (*/}
                    {/*    <Select*/}
                    {/*        name="intervencion"*/}
                    {/*        disabled={!interventions?.length}*/}
                    {/*        label={t('common.label.intervention')}*/}
                    {/*        placeholder="common.label.select-value"*/}
                    {/*        items={interventions}*/}
                    {/*        value={values.intervencion}*/}
                    {/*        onChange={(value) => {*/}
                    {/*            setFieldValue(*/}
                    {/*                'intervencion',*/}
                    {/*                value.intervencion*/}
                    {/*            );*/}
                    {/*        }}*/}
                    {/*    />*/}
                    {/*)}*/}

                    <Toggle
                        value={values.cobrado || false}
                        onChange={(res) => {
                            setFieldValue('cobrado', res.toggle);
                        }}
                        label={t('intervencion.form.cobrado')}
                    />

                    <FormFooter
                        item={{}}
                        close={close}
                        doSubmit={handleSubmit}
                    />
                </form>
            )}
        </Formik>
    );
};
