import {useEffect, useState} from 'react';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {toast} from 'react-toastify';

import {Input} from '../../elements/input';
import {useTranslation} from 'react-i18next';
import {useHttpClient} from '../../shared/http-client';
import {Select} from '../../elements/select';
import {FilterFooter} from '../../elements/filter-footer';
import {ESTADOS} from "./constants";
import {SelectAsync} from "../../elements/select-async";
import {DateRangePicker} from "../../elements/date-range-picker";
import dayjs from "dayjs";

// construccion del objecto yup de validacion del cuestionario
let obligado = {};
const validacion = Yup.object().shape(obligado);

const initialValues = {
    numero: '',
    estado: null,
    operario: null,
    cliente: null,
};

export const IntervencionFilter = ({
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
    const [data, setData] = useState<any | null>(null);
    const [operarios, setOperarios] = useState<any | null>([]);
    const [estados, setEstados] = useState<any | null>([]);
    const [startDate, setStartDate] = useState<any | null>(null);
    const [endDate, setEndDate] = useState<any | null>(null);

    useEffect(() => {
        api('/operarios/?is_active=true&limit=9999', 'GET');
    }, []);

    useEffect(() => {
        if (item) {
            setData(item);
            setEstados(ESTADOS.map((item: any) => ({id: item.id, name: item.label})))
        }
    }, [item]);

    const beforeSubmit = (values: any | null) => {
        let after = {...values};

        if (values.estado) {
            const estado = ESTADOS.find((item: any) => (item.id === values.estado))
            after.estado = estado?.value;
        }

        if (values.cliente) {
            after.cliente = values.cliente.id;
        }

        return after;
    };

    const onSubmit = async (values: any | null) => {
        //
        const enviaremos = beforeSubmit(values);

        doFilter(enviaremos);
    };

    useEffect(() => {

        if (state.data) {
            if (state.path.includes('operarios')) {
                setOperarios(state.data.results);
            }
        }

        if (state.error) {
            toast.error(state.error.detail);
        }

    }, [state]);


    const handleDates = (dates: any) => {
        if (dates) {
            const start = dayjs(dates[0]);
            const end = dates[1]
                ? dayjs(dates[1]).add(1, 'day')
                : dayjs(dates[0]).add(1, 'day');
            if (dates[1]) {
                setStartDate(`${start.format('YYYY-MM-DD')}`)
                setEndDate(`${end.format('YYYY-MM-DD')}`)
            }
        } else {
            setStartDate(null)
            setEndDate(null)
        }
    };

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
                      setFieldValue,
                      handleSubmit,
                      isSubmitting
                  }) => (
                    <form onSubmit={handleSubmit} autoComplete="off">
                        {/*<pre>{JSON.stringify(values, null, 4)}</pre>*/}
                        {/*<pre>{JSON.stringify(errors, null, 4)}</pre>*/}

                        <Input
                            name="id"
                            label={t('intervencion.form.id')}
                            type="text"
                            placeholder={t('intervencion.form.id')}
                            value={values.id}
                            onChange={(value) =>
                                setFieldValue('id', value.id)
                            }
                        />

                        <Select
                            name="estado"
                            label={t('intervencion.form.estado')}
                            placeholder="common.placeholder.select-value"
                            items={estados}
                            value={values.estado}
                            onChange={(value) => {
                                setFieldValue('estado', value.estado);
                            }}
                        />

                        <Select
                            name="operario"
                            label={t('intervencion.form.operario')}
                            placeholder="common.placeholder.select-value"
                            items={operarios}
                            value={values.operario}
                            onChange={(value) => {
                                setFieldValue('operario', value.operario);
                            }}
                        />

                        <SelectAsync
                            name={'cliente'}
                            label={'intervencion.form.cliente'}
                            placeholder="common.placeholder.select-value"
                            items={(inputValue: string) => {
                                return options(
                                    `/clientes/?limit=9999&name=${inputValue}&activo=true`
                                );
                            }}
                            value={values.cliente}
                            onChange={(value) => {
                                setFieldValue('cliente', value || {});
                                if (value) {
                                    api(
                                        `/instalaciones/?limit=999999&cliente=${value.id}`,
                                        'GET'
                                    );
                                }
                            }}
                        />

                        <DateRangePicker doChange={handleDates}/>


                        <FilterFooter
                            item={item}
                            doDelete={() => doFilter({})}
                            doSubmit={handleSubmit}
                            close={close}
                        />
                    </form>
                )}
            </Formik>
        </div>
    );
};
