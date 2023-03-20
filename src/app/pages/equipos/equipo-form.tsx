import { useEffect, useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

import { Input } from '../../elements/input';
import { useTranslation } from 'react-i18next';
import { useHttpClient } from '../../shared/http-client';
import { Select } from '../../elements/select';
import { TextArea } from '../../elements/text-area';
import { FormFooter } from '../../elements/form-footer';
import {FieldError} from "../../elements/field-error/field-error";
import {useCookies} from "../../shared/cookies";
import {StoreKeys} from "../../shared/store";

// construccion del objecto yup de validacion del cuestionario
let obligado = {
    name: Yup.string().required('obligatorio'),
    tipo_equipo: Yup.string().required('obligatorio').nullable()
};
const validacion = Yup.object().shape(obligado);

const initialValues = {
    name: '',
    modelo: '',
    descripcion: '',
    observaciones: '',
    modo: 'APARATO',
    tipo_equipo: ''
};

export const EquipoForm = ({
    item,
    close,
    doDelete
}: {
    item?: any;
    close: (data?: any) => void;
    doDelete?: (item: any) => void;
}) => {
    const { t } = useTranslation();
    const { api, state } = useHttpClient();
    const {get} = useCookies();
    const [data, setData] = useState<any | null>(null);
    const [tiposEquipo, setTiposEquipo] = useState<any | null>([]);
    const [configuration, setConfiguration] = useState<any>({});
    const [modos] = useState<any | null>([
        {
            id: 1,
            value: 'APARATO',
            name: t('equipos.modo.aparato')
        },
        {
            id: 2,
            value: 'ZONA',
            name: t('equipos.modo.zona')
        }
    ]);

    useEffect(() => {
        if (get(StoreKeys.Token)) {
            setConfiguration(get(StoreKeys.Configuration));
        }
        api('/tipos-equipo/?limit=999999', 'GET');
    }, []);

    useEffect(() => {
        if (item) {
            const datos = { ...item };
            datos.modo = item.modo
                ? modos.find((m: any) => m.value === item.modo)
                : {};

            console.log('datos', datos);

            setData(datos);
        }
    }, [item]);

    const beforeSubmit = (values: any | null) => {
        let after = { ...values };

        after.modo =
            typeof values.modo === 'object' ?  values.modo.value : modos.find((m:any) => (m.value === values.modo)).value;

        after.tipo_equipo =
            typeof values.tipo_equipo === 'object'
                ? values.tipo_equipo.id
                : values.tipo_equipo;


        return after;
    };

    const onSubmit = async (values: any | null) => {
        //
        const enviaremos = beforeSubmit(values);

        if (enviaremos.id) {
            // update
            api(`/equipos/${enviaremos.id}/`, 'PATCH', enviaremos);
        } else {
            // create
            api('/equipos/', 'POST', enviaremos);
        }
    };

    useEffect(() => {
        if (state.data) {
            if (state.path.includes('tipos-equipo')) {
                setTiposEquipo(state.data.results);
            }

            if (state.path.includes('equipos')) {
                close(state.data);
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
                        {/*<pre>{JSON.stringify(item, null, 4)}</pre>*/}
                        {/*<pre>{JSON.stringify(errors, null, 4)}</pre>*/}

                        {/*<Select*/}
                        {/*    name="modo"*/}
                        {/*    label={t('equipos.form.modo')}*/}
                        {/*    placeholder="common.placeholder.select-value"*/}
                        {/*    items={modos}*/}
                        {/*    value={typeof values.modo === "object" ? values.modo.id : values.modo }*/}
                        {/*    onChange={(value) => {*/}
                        {/*        setFieldValue('modo', value.modo);*/}
                        {/*    }}*/}
                        {/*/>*/}

                        <Input
                            name="name"
                            label={t('equipos.form.name')}
                            type="text"
                            placeholder="Name"
                            value={values.name}
                            onChange={(value) =>
                                setFieldValue('name', value.name)
                            }
                        />
                        <FieldError touched={touched} errors={errors} field={"name"}/>

                        {configuration?.is_gas && (
                            <Input
                                name="modelo"
                                label={t('equipos.form.modelo')}
                                type="text"
                                placeholder="Name"
                                value={values.modelo}
                                onChange={(value) =>
                                    setFieldValue('modelo', value.modelo)
                                }
                            />
                        )}

                        <TextArea
                            name={'descripcion'}
                            label={t('equipos.form.descripcion')}
                            value={values.descripcion}
                            onChange={(value) =>
                                setFieldValue('descripcion', value.descripcion)
                            }
                        />

                        <TextArea
                            name={'observaciones'}
                            label={t('equipos.form.observaciones')}
                            value={values.observaciones}
                            onChange={(value) =>
                                setFieldValue(
                                    'observaciones',
                                    value.observaciones
                                )
                            }
                        />

                        {/*<div className="grid grid-cols-2 gap-1 justify-between items-center w-full">*/}
                        {/*    <DatePicker*/}
                        {/*        name={'fecha_instalacion'}*/}
                        {/*        label={t('equipos.form.fecha_instalacion')}*/}
                        {/*        onChange={(value) =>*/}
                        {/*            setFieldValue(*/}
                        {/*                'fecha_instalacion',*/}
                        {/*                value.fecha_instalacion*/}
                        {/*            )*/}
                        {/*        }*/}
                        {/*    />*/}

                        {/*    <DatePicker*/}
                        {/*        name={'fecha_baja'}*/}
                        {/*        label={t('equipos.form.fecha_baja')}*/}
                        {/*        onChange={(value) =>*/}
                        {/*            setFieldValue(*/}
                        {/*                'fecha_baja',*/}
                        {/*                value.fecha_baja*/}
                        {/*            )*/}
                        {/*        }*/}
                        {/*    />*/}
                        {/*</div>*/}

                        <Select
                            name="tipo_equipo"
                            label={t('equipos.form.tipo_equipo')}
                            placeholder="common.placeholder.select-value"
                            items={tiposEquipo}
                            value={values.tipo_equipo}
                            onChange={(value) =>
                                setFieldValue('tipo_equipo', value.tipo_equipo)
                            }
                        />
                        <FieldError touched={touched} errors={errors} field={"tipo_equipo"}/>

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
