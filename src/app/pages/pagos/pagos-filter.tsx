import * as Yup from 'yup';

import {useEffect, useState} from 'react';

import {Formik} from 'formik';
import {toast} from 'react-toastify';

import {useTranslation} from 'react-i18next';
import {useHttpClient} from '../../shared/http-client';
import dayjs from 'dayjs';
import {DateTimePicker} from '../../elements/date-time-picker';
import {SelectAsync} from "../../elements/select-async";
import {FilterFooter} from "../../elements/filter-footer";
import {Toggle} from "../../elements/toggle";

const fields = {};

const validations = Yup.object().shape(fields);

const initialValues = {
    todos: false,
};

export const PagosFilter = ({
                                item,
                                doFilter,
                                close,
                            }: {
    item?: any;
    close: () => void;
    doFilter: (item: any) => void;
}) => {
    const {t} = useTranslation();
    const {api, state, options} = useHttpClient();

    const [data, setData] = useState<any | null>({
        ...initialValues
    });

    const beforeSubmit = (values: any | null) => {
        let after = {...values};


        after.cliente = values.cliente ? values.cliente.id : null;
        after.instalacion = values.instalacion ? values.instalacion.id : null;
        after.intervencion = values.intervencion ? values.intervencion.id : null;

        if (after.todos) {
            delete after.cobrado
        }

        delete after.instalaciones;
        delete after.intervenciones;
        delete after.tipo_intervencion;

        !after.cliente && delete after.cliente
        !after.instalacion && delete after.instalacion
        !after.intervencion && delete after.intervencion

        return after;
    };

    const onSubmit = (values: any | null) => {
        const enviaremos = beforeSubmit(values);

        doFilter(enviaremos);
    };

    useEffect(() => {
        api(`/periodicidades/`, 'GET');
        api('/tipos-intervencion/?limit=9999', 'GET');
    }, []);

    useEffect(() => {
        if (item) {
            setData({...data, ...item});
        }
    }, [item]);

    useEffect(() => {
        if (state.data) {
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
                  setFieldValue,
                  handleSubmit,
                  isSubmitting
              }) => (
                <form onSubmit={handleSubmit} autoComplete="off">
                    {/*<pre>{JSON.stringify(values, null, 4)}</pre>*/}
                    {/*<pre>{JSON.stringify(errors, null, 4)}</pre>*/}

                    {item && (
                        <div className="grid grid-cols-2 gap-2 justify-between items-center w-full">
                            <DateTimePicker
                                type="date"
                                value={values.fecha_pago_after}
                                name={'fecha_pago_after'}
                                label={t('intervencion.form.fecha_pago_after')}
                                onChange={(value) => {
                                    setFieldValue(
                                        'fecha_pago_after',
                                        dayjs(value.fecha_pago_after).format("YYYY-MM-DD")
                                    );
                                }}
                            />
                            <DateTimePicker
                                type="date"
                                value={values.fecha_pago_before}
                                name={'fecha_pago_before'}
                                label={t('intervencion.form.fecha_pago_before')}
                                onChange={(value) => {
                                    setFieldValue(
                                        'fecha_pago_before',
                                        dayjs(value.fecha_pago_before).format("YYYY-MM-DD")
                                    );
                                }}
                            />
                        </div>
                    )}

                    <Toggle
                        value={values.todos || false}
                        onChange={(res) => {
                            setFieldValue('todos', res.toggle)
                        }
                        }
                        label={t('pagos.form.todos')}
                    />

                    {!values.todos ? (
                        <Toggle
                            value={values.cobrado || false}
                            onChange={(res) => {
                                setFieldValue('cobrado', res.toggle)
                            }
                            }
                            label={t('pago.form.cobrado')}
                        />) : null}

                    <SelectAsync
                        name={'cliente'}
                        label={'intervencion.form.cliente'}
                        placeholder={t("common.label.select-value")}
                        items={(inputValue: string) => {
                            return options(
                                `/clientes/?limit=9999&name=${inputValue}`
                            );
                        }}
                        value={values.cliente}
                        onChange={(value) => {
                            setFieldValue('cliente', value || {});
                        }}
                    />

                    <FilterFooter
                        item={item}
                        doDelete={() => doFilter({})}
                        doSubmit={handleSubmit}
                        close={close}
                    />
                </form>
            )}
        </Formik>
    );
};
