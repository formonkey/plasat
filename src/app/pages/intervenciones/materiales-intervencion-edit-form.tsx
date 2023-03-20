import {useEffect, useState} from 'react';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {toast} from 'react-toastify';

import {Input} from '../../elements/input';
import {useTranslation} from 'react-i18next';
import {useHttpClient} from '../../shared/http-client';
import {Select} from '../../elements/select';
import {FormFooter} from '../../elements/form-footer';
import {FieldError} from "../../elements/field-error/field-error";
import {DateTimePicker} from "../../elements/date-time-picker";
import dayjs from "dayjs";

// construccion del objecto yup de validacion del cuestionario
let obligado = {
    name: Yup.string().required('obligatorio'),
};
const validacion = Yup.object().shape(obligado);

const initialValues = {
    intervencion: null,
    name: null,
    operario: null,
    modo_pago: null,
    fecha: null,
};

export const MaterialesIntervencionEditForm = ({
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
    const [data, setData] = useState<any | null>({});
    const [operarios, setOperarios] = useState<any | null>([]);
    const [modosPago, setModosPago] = useState<any | null>([]);
    const [intervencion, setIntervencion] = useState<any | null>(null);


    useEffect(() => {
        api(`/operarios/?is_active=true`, 'GET');
        api(`/modos-pago/`, 'GET');
    }, []);

    useEffect(() => {
        if (item) {
            setIntervencion(item.intervencion);
            delete item.intervencion;
            setData(item);
        }
    }, [item]);

    const beforeSubmit = (values: any | null) => {
        let after = {...values};

        after.operario =
            typeof values.operario === 'object'
                ? values.operario?.id ?? null
                : values.operario;

        after.intervencion = typeof intervencion === "object" ? intervencion?.id : intervencion;
        // after.fecha_pago = values.fecha_pago.split('T')[0];

        after.modo_pago =
            typeof values.modo_pago === 'object'
                ? values.modo_pago?.id ?? null
                : values.modo_pago;

        delete after.equipo;
        delete after.operaciones_equipo;

        return {...after};
    };

    const onSubmit = async (values: any | null) => {
        const enviaremos = beforeSubmit(values);

        if (enviaremos.id) {
            // update
            api(
                `/materiales-intervencion/${enviaremos.id}/`,
                'PATCH',
                enviaremos
            );
        } else {
            // create
            api('/materiales-intervencion/', 'POST', enviaremos);
        }
    };

    useEffect(() => {
        if (state.data) {

            if (state.path.includes('operarios')) {
                setOperarios(state.data.results);
            }

            if (state.path.includes('modos-pago')) {
                setModosPago(state.data.results);
            }

            if (state.path.includes('materiales-intervencion')) {
                close();
            }
        }

        if (state.error) {
            toast.error(state.error.detail.detail);
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
                      touched,
                      setFieldValue,
                      handleSubmit,
                  }) => (
                    <form onSubmit={handleSubmit} autoComplete="off">
                        {/*<pre>{JSON.stringify(item, null, 4)}</pre>*/}
                        {/*<pre>{JSON.stringify(errors, null, 4)}</pre>*/}

                        {/*<DateTimePicker*/}
                        {/*    type={'date'}*/}
                        {/*    value={values.fecha_pago || dayjs().toDate()}*/}
                        {/*    name={'fecha_pago'}*/}
                        {/*    label={t('intervencion.form.fecha_pago')}*/}
                        {/*    onChange={(value) =>*/}
                        {/*        setFieldValue('fecha_pago', value.fecha_pago)*/}
                        {/*    }*/}
                        {/*/>*/}

                        <div>
                            <Input
                                name="name"
                                label={t('intervencion.form.descripcion')}
                                placeholder={t('intervencion.form.descripcion')}
                                value={values.name}
                                type="text"
                                onChange={(value) =>
                                    setFieldValue('name', value.name)
                                }
                            />
                            <FieldError touched={touched} errors={errors} field={"name"}/>
                        </div>

                        <Input
                            value={values.proveedor}
                            label={t('intervencion.form.proveedor')}
                            type="text"
                            name="proveedor"
                            placeholder={t('intervencion.form.proveedor')}
                            onChange={(value) =>
                                setFieldValue('proveedor', value.proveedor)
                            }
                        />

                        <Input
                            value={values.importe}
                            label={t('intervencion.form.importe')}
                            type="number"
                            name="importe"
                            placeholder={t('intervencion.form.importe')}
                            onChange={(value) =>
                                setFieldValue('importe', value.importe)
                            }
                            extraHolder={'€'}
                        />

                        <Select
                            value={values.modo_pago ?? {}}
                            label={t('intervencion.form.modo_pago')}
                            placeholder="common.placeholder.select-value"
                            items={modosPago}
                            name="modo_pago"
                            onChange={(value) =>
                                setFieldValue('modo_pago', value.modo_pago)
                            }
                        />

                        <Select
                            value={values.operario ?? {}}
                            label={t('intervencion.form.operario')}
                            placeholder="common.placeholder.select-value"
                            items={operarios}
                            name="operario"
                            onChange={(value) =>
                                setFieldValue('operario', value.operario)
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
