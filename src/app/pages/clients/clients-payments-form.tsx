import * as Yup from 'yup';

import {useEffect, useState} from 'react';

import {Formik} from 'formik';
import {toast} from 'react-toastify';

import {Input} from '../../elements/input';
import {useTranslation} from 'react-i18next';
import {useHttpClient} from '../../shared/http-client';
import {FormFooter} from '../../elements/form-footer';
import {Select} from '../../elements/select';
import dayjs from 'dayjs';
import {CalendarSmall} from '../../../assets/icons/CalndarSmall';
import {DateTimePicker} from '../../elements/date-time-picker';
import {FieldError} from "../../elements/field-error/field-error";

const fields = {
    fecha_arranque: Yup.string().required('obligatorio').nullable(),
    instalacion: Yup.string().required('obligatorio').nullable(),
    importe: Yup.string().required('obligatorio').nullable(),
};

const validations = Yup.object().shape(fields);

const initialValues = {
    intervenciones: 1,
    instalacion: null,
    importe: null,
    fecha_arranque: new Date(),
};

export const ClientsPaymentsForm = ({
                                        id,
                                        item,
                                        close
                                    }: {
    item?: any;
    close: () => void;
    id: any;
}) => {
    const {t} = useTranslation();
    const {api, state} = useHttpClient();
    const [installation, setInstallation] = useState<any>(null);
    const [installations, setInstallations] = useState<any | null>([]);
    const [interventions, setInterventions] = useState<any | null>([]);
    const [periodicities, setPeriodicities] = useState<any | null>([]);
    const [tiposIntervencion, setTiposIntervencion] = useState<any | null>([]);
    const [listaFechas, setListaFechas] = useState<any | null>([]);

    const [data, setData] = useState<any | null>({
        cliente: id,
        ...initialValues
    });

    const beforeSubmit = (values: any | null) => {
        let after = {...values};

        after.tipo_intervencion =
            typeof values.tipo_intervencion === 'object'
                ? values.tipo_intervencion.id
                : values.tipo_intervencion;

        delete after.fecha_arranque;

        return after;
    };

    const onSubmit = (values: any | null) => {
        const enviaremos = beforeSubmit(values);

        if (values.id) {
            api(`/pagos/${values.id}/`, 'PATCH', enviaremos);
        } else {
            if (listaFechas.length > 0) {
                const fechas = [];
                for (const fecha of listaFechas) {
                    fechas.push(dayjs(fecha).format('YYYY-MM-DDTHH:mm:ss'));
                }

                enviaremos.fechas = listaFechas;
                enviaremos.cliente = id;

                delete enviaremos.periodicidad;
                delete enviaremos.intervenciones;

                api('/pagos/recursivos/', 'POST', enviaremos);
            }
        }
    };

    useEffect(() => {
        api(`/periodicidades/`, 'GET');
        api('/tipos-intervencion/?limit=9999', 'GET');
        api(`/instalaciones/?limit=999999&cliente=${id}`, 'GET');
    }, []);

    useEffect(() => {
        if (item) {
            setData({...data, ...item, cliente: id});
        }
    }, [item]);

    useEffect(() => {
        if (installation) {
            api(
                `/intervenciones/?cliente=${id}&installacion=${installation}`,
                'GET'
            );
        }
    }, [installation]);

    useEffect(() => {
        if (state.data) {
            if (state.path.includes('tipos-intervencion')) {
                setTiposIntervencion(state.data.results);
            }

            if (state.path.includes('instalaciones')) {
                setInstallations(state.data.results);
            }

            if (state.path.includes('intervenciones')) {
                setInterventions(
                    state.data.results.map((item: any) => ({
                        id: item.id,
                        name: item.numero
                    }))
                );
            }

            if (state.path.includes('periodicidades')) {
                setPeriodicities(state.data.results);
            }

            if (state.path.includes('pagos')) {
                close();
            }
        }

        if (state.error) {
            toast.error(state.error.detail);
        }
    }, [state]);

    const calcula = (values: any) => {
        if (values.fecha_arranque && values.periodicidad) {
            const periodo = periodicities.find(
                (x: any) => x.id === values.periodicidad
            );

            if (periodo) {
                let fechas = [];

                if (periodo.numero_meses === 0) {
                    for (let i = 0; i < +values.intervenciones; i++) {
                        const fecha = dayjs(values.fecha_arranque)
                            .add(i, 'week')
                            .format('YYYY-MM-DD');
                        fechas.push(fecha);
                    }
                } else {
                    for (let i = 0; i < +values.intervenciones; i++) {
                        const fecha = dayjs(values.fecha_arranque)
                            .add(i * periodo.numero_meses, 'month')
                            .format('YYYY-MM-DD');

                        fechas.push(fecha);
                    }
                }
                setListaFechas(fechas);
            }
        }
    };

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
                  isSubmitting
              }) => (
                <form onSubmit={handleSubmit} autoComplete="off">
                    {/*<pre>{JSON.stringify(values, null, 4)}</pre>*/}
                    {/*<pre>{JSON.stringify(errors, null, 4)}</pre>*/}

                    {item && (
                        <div className="grid grid-cols-2 gap-2 justify-between items-center w-full">
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
                        </div>
                    )}

                    {!item && (
                        <div className="grid grid-cols-2 gap-2 justify-between items-center w-full">

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

                            <Select
                                name="tipo_intervencion"
                                label={t('intervencion.form.tipo_intervencion')}
                                placeholder={t('common.placeholder.select-value')}
                                items={tiposIntervencion}
                                value={values.tipo_intervencion}
                                onChange={(value) => {
                                    setFieldValue(
                                        'tipo_intervencion',
                                        value.tipo_intervencion
                                    );
                                }}
                            />
                        </div>
                    )}

                    {!item && (
                        <div className="grid grid-cols-2 gap-2 justify-between items-center w-full mb-4">
                            <div className="flex flex-col">
                                <DateTimePicker
                                    type="date"
                                    value={values.fecha_arranque}
                                    name={'fecha_arranque'}
                                    label={t(
                                        'intervencion.form.fecha_arranque'
                                    )}
                                    onChange={(value) => {
                                        setFieldValue(
                                            'fecha_arranque',
                                            value.fecha_arranque
                                        );
                                        calcula({
                                            ...values,
                                            fecha_arranque: value.fecha_arranque
                                        });
                                    }}
                                />
                                <FieldError touched={touched} errors={errors} field={"fecha_arranque"}/>

                                <Select
                                    name="periodicidad"
                                    label={t('intervencion.form.periodicidad')}
                                    placeholder="common.placeholder.select-value"
                                    items={periodicities}
                                    value={values.periodicidad}
                                    onChange={(value) => {
                                        setFieldValue(
                                            'periodicidad',
                                            value.periodicidad
                                        );
                                        calcula({
                                            ...values,
                                            periodicidad: value.periodicidad
                                        });
                                    }}
                                />

                                <Input
                                    name="intervenciones"
                                    label={t('common.label.number-of-payments')}
                                    type="number"
                                    placeholder={t(
                                        'common.label.number-of-payments'
                                    )}
                                    value={values.intervenciones}
                                    onChange={(value) => {
                                        setFieldValue(
                                            'intervenciones',
                                            value.intervenciones
                                        );
                                        calcula({
                                            ...values,
                                            intervenciones: value.intervenciones
                                        });
                                    }}
                                />
                            </div>

                            <div className="flex flex-col bg-gray-light w-full h-full p-2 rounded-[4px]">
                                <div
                                    className={
                                        'text-xs text-gray-darker mb-4 flex justify-start space-x-2'
                                    }
                                >
                                    <CalendarSmall/>
                                    <div>
                                        {t('intervencion.form.programadas')}
                                    </div>
                                </div>
                                <ul>
                                    {listaFechas.map(
                                        (fecha: string, index: number) => (
                                            <li
                                                key={index}
                                                className={
                                                    'text-xs text-gray-darker ml-4 mb-1'
                                                }
                                            >
                                                {fecha}
                                            </li>
                                        )
                                    )}
                                </ul>
                            </div>
                        </div>
                    )}

                    <Select
                        name="instalacion"
                        label={t('common.label.installation')}
                        placeholder="common.label.select-value"
                        items={installations}
                        value={values.instalacion}
                        onChange={(value) => {
                            setInstallation(value.instalacion);
                            setFieldValue('instalacion', value.instalacion);
                        }}
                    />
                    <FieldError touched={touched} errors={errors} field={"instalacion"}/>

                    <Select
                        name="intervencion"
                        disabled={!interventions?.length}
                        label={t('common.label.intervention')}
                        placeholder="common.label.select-value"
                        items={interventions}
                        value={values.intervencion}
                        onChange={(value) => {
                            setFieldValue('intervencion', value.intervencion);

                            // const intervention = interventions.find(
                            //     (e: any) => e.id === value.intervencion
                            // );
                            //
                            // setFieldValue(
                            //     'intervencion',
                            //     intervention.intervencion
                            // );
                        }}
                    />

                    <FormFooter
                        item={{}}
                        close={close}
                        doSubmit={handleSubmit}
                        isSubmitting={isSubmitting}
                    />
                </form>
            )}
        </Formik>
    );
};
