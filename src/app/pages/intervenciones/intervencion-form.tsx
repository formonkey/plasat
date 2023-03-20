import React, {useEffect, useRef, useState} from 'react';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {toast} from 'react-toastify';

import {Input} from '../../elements/input';
import {useTranslation} from 'react-i18next';
import {useHttpClient} from '../../shared/http-client';
import {Select} from '../../elements/select';
import {Toggle} from '../../elements/toggle';
import {DateTimePicker} from '../../elements/date-time-picker';
import {SelectAsync} from '../../elements/select-async';
import {TextArea} from '../../elements/text-area';
import {FieldError} from "../../elements/field-error/field-error";
import {FormFooter} from "../../elements/form-footer";
import {Button} from "../../elements/button";
import {useCookies} from "../../shared/cookies";
import {StoreKeys} from "../../shared/store";
import {useModal} from "../../shared/modals";
import {PagosForm} from "../pagos/pagos-form";
import {useDrawer} from "../../shared/drawer";
import {useNavigate} from "react-router-dom";
import dayjs from "dayjs";
import {noop} from "../../utils";

// construccion del objecto yup de validacion del cuestionario
let obligado = {
    // numero: Yup.string().required('obligatorio'),
    tipo_intervencion: Yup.number().required('obligatorio').nullable(),
    fecha_estimacion_inicio: Yup.date().required('obligatorio').nullable(),
    cliente: Yup.object().required('obligatorio').nullable(),
    instalacion: Yup.number().required('obligatorio').nullable()
};
const validacion = Yup.object().shape(obligado);

const initialValues = {
    facturar: false,
    horas_estimadas: 1,
    cliente: null,
    instalacion: null,
    tipo_intervencion: null,
    fecha_estimacion_inicio: null,
    estado: 'PENDIENTE',
};

export const IntervencionForm = ({
                                     item,
                                     close,
                                     cancel = noop,
                                     doDelete
                                 }: {
    item?: any;
    close: () => void;
    cancel: () => void;
    doDelete?: (item: any) => void;
}) => {
    const {t} = useTranslation();
    const navigation = useNavigate()
    const {api, state, options} = useHttpClient();
    const {get: getCookie} = useCookies();
    const {open} = useDrawer();
    const {open: openModal, close: closeModal} = useModal();
    const [data, setData] = useState<any | null>(null);
    const [tiposIntervencion, setTiposIntervencion] = useState<any | null>([]);
    const [instalaciones, setInstalaciones] = useState<any | null>([]);
    const [operarios, setOperarios] = useState<any | null>([]);
    const [profile, setProfile] = useState<any>({});

    let isCerrando = useRef<boolean>(false)
    let isCreando = useRef<boolean>(false)

    useEffect(() => {
        api('/tipos-intervencion/?limit=9999', 'GET');

        // get connected user roles
        if (getCookie(StoreKeys.Token)) {
            setProfile(getCookie(StoreKeys.Profile));
        }
    }, []);

    useEffect(() => {
        if (item) {
            setData({...item});
        }
    }, [item]);

    const beforeSubmit = (values: any | null) => {
        let after = {...values};

        // console.log('beforeSubmit', values);

        const hora = dayjs(values.fecha_estimacion_inicio).get('hour');
        if (hora === 0) {
            after.fecha_estimacion_inicio = dayjs(values.fecha_estimacion_inicio).set('hour', 7).format("YYYY-MM-DDTHH:mm:ssZ");
        }

        after.cliente = after.cliente ? after.cliente.id : null;
        after.intervencion = after.intervencion ? after.intervencion.id : null;

        delete after.operarios;
        delete after.firma_operario;

        // console.log('afterSubmit', after);

        return after;
    };

    const onSubmit = async (values: any | null) => {
        //

        const enviaremos = beforeSubmit(values);

        if (enviaremos.id) {
            // update
            api(`/intervenciones/${enviaremos.id}/`, 'PATCH', enviaremos);
        } else {
            // create
            isCreando.current = true;
            api('/intervenciones/', 'POST', enviaremos);
        }
    };

    const handleAddCobro = () => {
        closeModal();
        setTimeout(() => {
            open(
                'cobros.form.new-item',
                <PagosForm item={{cliente: data.cliente}} close={() => close()}/>
            );
        }, 200);
    }

    useEffect(() => {
        if (state.data) {
            if (state.path.includes('tipos-intervencion')) {
                setTiposIntervencion(state.data.results);
                api('/instalaciones/?limit=9999', 'GET');
            }

            if (state.path.includes('instalaciones')) {
                setInstalaciones(state.data.results);
                api(`/operarios/?is_active=true`, 'GET');
            }

            if (state.path.includes('operarios')) {
                setOperarios(state.data.results);
            }

            if (state.path.includes('intervenciones')) {
                // preguntar si hay que añadir pago si estamos cerrando

                if (isCerrando.current) {
                    openModal('custom', {
                            title: 'common.modal.delete',
                            message: 'common.modal.validate-delete',
                        },
                        () => (
                            <div>
                                <p>{t("common.modal.add-payment")}</p>
                                <div className={"w-full flex justify-end space-x-2 py-8"}>
                                    <Button
                                        variant="gray-light"
                                        label={t("common.label.no")}
                                        onClick={() => {
                                            closeModal();
                                            close()
                                        }}
                                    />
                                    <Button
                                        variant="primary"
                                        label={t("common.label.yes-payment")}
                                        onClick={handleAddCobro}
                                    />

                                </div>
                            </div>
                        ));
                } else {
                    if (isCreando.current) {
                        navigation(`/intervenciones/${state.data.id}/tareas`)
                    }
                    close();
                }

            }
        }

        if (state.error) {
            toast.error(state.error.detail);
        }
    }, [state]);

    const handleCloseIntervention = () => {
        console.log('handleCloseIntervention', item);
        if (item.estado === "FINALIZADO") {
            api(`/intervenciones/${item.id}/`, 'PATCH', {estado: 'CERRADO'});
            isCerrando.current = true;
        }
        if (item.estado === "CERRADO") {
            api(`/intervenciones/${item.id}/`, 'PATCH', {estado: 'FINALIZADO'});
            isCerrando.current = false;
        }
    }


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
                  }) => (
                    <form onSubmit={handleSubmit} autoComplete="off">
                        {/*<pre>{JSON.stringify(values, null, 4)}</pre>*/}
                        {/*<pre>{JSON.stringify(errors, null, 4)}</pre>*/}


                        <Select
                            name="tipo_intervencion"
                            label={t('intervencion.form.tipo_intervencion')}
                            placeholder="common.placeholder.select-value"
                            items={tiposIntervencion}
                            value={values.tipo_intervencion}
                            onChange={(value) => {
                                setFieldValue(
                                    'tipo_intervencion',
                                    value.tipo_intervencion
                                );
                            }}
                        />
                        <FieldError touched={touched} errors={errors} field={"tipo_intervencion"}/>

                        <Input
                            name="horas_estimadas"
                            type="number"
                            label={t(
                                'intervention-hours.label.estimated-hours'
                            )}
                            placeholder={t(
                                'intervention-hours.label.estimated-hours'
                            )}
                            value={values.horas_estimadas}
                            onChange={(value) =>
                                setFieldValue(
                                    'horas_estimadas',
                                    value.horas_estimadas
                                )
                            }
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
                            <div>
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
                                <FieldError touched={touched} errors={errors} field={"cliente"}/>
                            </div>

                            <Select
                                name="instalacion"
                                label={t('intervencion.form.instalacion')}
                                placeholder="common.placeholder.select-value"
                                items={instalaciones}
                                value={values.instalacion}
                                disabled={!values.cliente}
                                onChange={(value) =>
                                    setFieldValue(
                                        'instalacion',
                                        value.instalacion
                                    )
                                }
                            />
                        </div>
                        <FieldError touched={touched} errors={errors} field={"isntalacion"}/>

                        <Toggle
                            value={values.is_tiempos_operacion}
                            onChange={(value) =>
                                setFieldValue(
                                    'is_tiempos_operacion',
                                    value.toggle
                                )
                            }
                            label={t('intervencion.form.is_tiempos_operacion')}
                        />

                        <Toggle
                            value={values.facturar}
                            onChange={(value) =>
                                setFieldValue('facturar', value.toggle)
                            }
                            label={t('intervencion.form.facturar')}
                        />

                        <TextArea
                            label={t('intervencion.form.descripcion')}
                            name={'descripcion'}
                            value={values.descripcion}
                            onChange={(value) =>
                                setFieldValue('descripcion', value.descripcion)
                            }
                        />

                        <Select
                            value={
                                values.operario instanceof Array
                                    ? values.operario[0]
                                    : values.operario
                            }
                            label={t('intervencion.form.operario')}
                            placeholder="common.placeholder.select-value"
                            items={operarios}
                            name="operario"
                            onChange={(value) =>
                                setFieldValue('operario', value.operario)
                            }
                        />

                        <div className={"flex justify-end"}>
                            {profile.rol === "superadmin" && values.estado === "FINALIZADO" ? (
                                <Button
                                    variant={"secondary"}
                                    onClick={() => handleCloseIntervention()}
                                    label={t('intervencion.form.cerrar')}
                                />
                            ) : null}
                            {profile.rol === "superadmin" && values.estado === "CERRADO" ? (
                                <Button
                                    variant={"secondary"}
                                    onClick={() => handleCloseIntervention()}
                                    label={t('intervencion.form.reabrir')}
                                />
                            ) : null}
                        </div>

                        <div className={"py-16"}/>

                        <FormFooter
                            item={item}
                            doDelete={doDelete}
                            doSubmit={handleSubmit}
                            close={close}
                            isSubmitting={values.estado === "CERRADO"}
                        />
                    </form>
                )}
            </Formik>
        </div>
    );
};
