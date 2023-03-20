import React, {useEffect, useState} from 'react';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {toast} from 'react-toastify';

import {Input} from '../../elements/input';
import {Select} from '../../elements/select';
import {Button} from '../../elements/button';
import {DatePicker} from '../../elements/date-picker';
import {useTranslation} from 'react-i18next';
import {useHttpClient} from '../../shared/http-client';
import {classNames, noop} from '../../utils';

const rules = {
    equipo_intervencion: Yup.string().required()
};

const initialValues = {};
const validation = Yup.object().shape(rules);

export const InterventionConsume = ({
                                        mode,
                                        item
                                    }: {
    mode?: string;
    item?: any;
}) => {
    const {t} = useTranslation();
    const {api, state} = useHttpClient();
    const [data, setData] = useState<any>({});
    const [equipments, setEquipments] = useState<any>([]);
    const [inEdition, setInEdition] = useState<boolean>(false);
    const [editing, setEditing] = useState<number | null>(null);

    console.log('item', item);

    const onSubmit = (values: any) => {
        api(
            `/perdidas-consumos/${inEdition ? values.id + '/' : ''}`,
            inEdition ? 'PUT' : 'POST',
            values
        );
    };

    const getConsume = (id: number) => {

        console.log('id', id);
        console.log('inEdition', inEdition);

        setEditing(id);

        if (id) {
            if (!inEdition) {
                setData({});
            }
            api(`/perdidas-consumos/?equipo_intervencion=${id}`, 'GET');
        } else {
            setData({})
        }
    };

    useEffect(() => {
        const id = typeof item === 'object' ? item.id : item;
        api(
            `/equipos-intervencion/?intervencion=${id}`,
            'GET'
        );
    }, []);

    useEffect(() => {
        if (state.data) {
            if (state.path.includes('/equipos-intervencion/')) {
                setEquipments(state.data.results);
            } else if (
                state.path.includes('/perdidas-consumos/?equipo_intervencion=')
            ) {

                console.log('state.data', !!state.data.results.length);
                setInEdition(!!state.data.results.length);

                setData(
                    state.data.results.length
                        ? {...state.data.results[0]}
                        : {}
                );
            } else if (state.path.includes('/perdidas-consumos/')) {
                if (editing) {
                    getConsume(editing);
                } else {
                    setEditing(null)
                    setData({})
                }
                toast.success(t('intervention-consume.message.success'));
            }
        }
    }, [state]);

    return (
        <Formik
            enableReinitialize={true}
            initialValues={
                {
                    ...initialValues,
                    ...data
                } as any
            }
            validationSchema={validation}
            validateOnBlur={true}
            onSubmit={onSubmit}
        >
            {({
                  values,
                  setFieldValue,
                  handleSubmit,
              }) => (
                <form onSubmit={handleSubmit} autoComplete="off">
                    <div
                        className={classNames(
                            mode === 'md' ? 'w-6/6' : 'w-full'
                        )}
                    >
                        <Select
                            name="equipo_intervencion"
                            items={equipments}
                            value={values.equipo_intervencion}
                            label={t('common.label.equipment')}
                            placeholder="common.label.select-value"
                            onChange={(value) => {
                                setFieldValue(
                                    'equipo_intervencion',
                                    +value.equipo_intervencion
                                );
                                getConsume(+value.equipo_intervencion);
                            }}
                        />
                    </div>
                    {editing ? (
                        <div className={"grid grid-cols-2 gap-4"}>

                            <div>

                                <div className="uppercase text-[#6C727E] font-medium mt-[22px] font-bold">
                                    Control de pérdidas de calor por chimenea
                                </div>

                                <div className="grid grid-cols-2 gap-2">

                                    <div
                                        className={classNames(
                                            mode === 'md'
                                                ? 'flex-col w-full mt-[15px]'
                                                : 'flex-col w-full mt-[4px]'
                                        )}
                                    >
                                        {/*<div*/}
                                        {/*    className={classNames(*/}
                                        {/*        mode === 'md'*/}
                                        {/*            ? 'flex-col w-full mt-[15px]'*/}
                                        {/*            : 'flex space-x-5 w-full mt-[15px]'*/}
                                        {/*    )}*/}
                                        {/*>*/}
                                        <div
                                            className={classNames(
                                                mode === 'md' ? 'w-6/6' : 'w-6/6'
                                            )}
                                        >
                                            {/*<div*/}
                                            {/*    className={classNames(*/}
                                            {/*        mode === 'md' ? 'w-6/6' : 'w-full'*/}
                                            {/*    )}*/}
                                            {/*>*/}
                                            <Input
                                                name="co2"
                                                label="%CO2"
                                                type="number"
                                                value={values.co2}
                                                onChange={(value) =>
                                                    setFieldValue('co2', value.co2)
                                                }
                                            />
                                        </div>
                                        <div
                                            className={classNames(
                                                mode === 'md' ? 'w-6/6' : 'w-full'
                                            )}
                                        >
                                            <Input
                                                name="co2_1"
                                                label="%CO (1)"
                                                type="number"
                                                value={values.co2_1}
                                                onChange={(value) =>
                                                    setFieldValue('co2_1', value.co2_1)
                                                }
                                            />
                                        </div>
                                        <div
                                            className={classNames(
                                                mode === 'md' ? 'w-6/6' : 'w-full'
                                            )}
                                        >
                                            <Input
                                                name="indice_opacimetrico"
                                                label={t('Índice opacimátrico')}
                                                type="number"
                                                value={values.indice_opacimetrico}
                                                onChange={(value) =>
                                                    setFieldValue(
                                                        'indice_opacimetrico',
                                                        value.indice_opacimetrico
                                                    )
                                                }
                                            />
                                        </div>
                                        <div
                                            className={classNames(
                                                mode === 'md' ? 'w-6/6' : 'w-full'
                                            )}
                                        >
                                            <Input
                                                name="temperatura_humos"
                                                label={t('T. humos (ºC)')}
                                                type="number"
                                                value={values.temperatura_humos}
                                                onChange={(value) =>
                                                    setFieldValue(
                                                        'temperatura_humos',
                                                        value.temperatura_humos
                                                    )
                                                }
                                            />
                                        </div>
                                        <div
                                            className={classNames(
                                                mode === 'md' ? 'w-6/6' : 'w-full'
                                            )}
                                        >
                                            <Input
                                                name="temperatura_sala"
                                                label={t('T. sala (ºC)')}
                                                type="number"
                                                value={values.temperatura_sala}
                                                onChange={(value) =>
                                                    setFieldValue(
                                                        'temperatura_sala',
                                                        value.temperatura_sala
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div
                                        className={classNames(
                                            mode === 'md'
                                                ? 'flex-col w-full mt-[15px]'
                                                : 'flex-col w-full mt-[4px]'
                                        )}
                                    >
                                        {/*<div*/}
                                        {/*    className={classNames(*/}
                                        {/*        mode === 'md'*/}
                                        {/*            ? 'flex-col w-full mt-[15px]'*/}
                                        {/*            : 'flex space-x-5 w-full mt-[15px]'*/}
                                        {/*    )}*/}
                                        {/*>*/}
                                        <div
                                            className={classNames(
                                                mode === 'md' ? 'w-6/6' : 'w-full'
                                            )}
                                        >
                                            <Input
                                                name="perdida_calor"
                                                label={t('Pérdida calor sensible')}
                                                type="number"
                                                value={values.perdida_calor}
                                                onChange={(value) =>
                                                    setFieldValue(
                                                        'perdida_calor',
                                                        value.perdida_calor
                                                    )
                                                }
                                            />
                                        </div>
                                        <div
                                            className={classNames(
                                                mode === 'md' ? 'w-6/6' : 'w-full'
                                            )}
                                        >
                                            <Input
                                                name="temperatura_fluido_salida"
                                                label={t('T. fluido salida (ºC)')}
                                                type="number"
                                                value={values.temperatura_fluido_salida}
                                                onChange={(value) =>
                                                    setFieldValue(
                                                        'temperatura_fluido_salida',
                                                        value.temperatura_fluido_salida
                                                    )
                                                }
                                            />
                                        </div>
                                        <div
                                            className={classNames(
                                                mode === 'md' ? 'w-6/6' : 'w-full'
                                            )}
                                        >
                                            <Input
                                                name="temperatura_fluido_retorno"
                                                label={t('T. fluido retorno (ºC)')}
                                                type="number"
                                                value={values.temperatura_fluido_retorno}
                                                onChange={(value) =>
                                                    setFieldValue(
                                                        'temperatura_fluido_retorno',
                                                        value.temperatura_fluido_retorno
                                                    )
                                                }
                                            />
                                        </div>
                                        <div
                                            className={classNames(
                                                mode === 'md' ? 'w-6/6' : 'w-full'
                                            )}
                                        >
                                            <Input
                                                name="presion_hogar"
                                                label={t('Presión hogar (mm.c.a.)')}
                                                type="number"
                                                value={values.presion_hogar}
                                                onChange={(value) =>
                                                    setFieldValue(
                                                        'presion_hogar',
                                                        value.presion_hogar
                                                    )
                                                }
                                            />
                                        </div>
                                        <div
                                            className={classNames(
                                                mode === 'md' ? 'w-6/6' : 'w-full'
                                            )}
                                        >
                                            <Input
                                                name="depresion_chimenea"
                                                label={t('Dep.chimenea (mm.c.a.)')}
                                                type="number"
                                                value={values.depresion_chimenea}
                                                onChange={(value) =>
                                                    setFieldValue(
                                                        'depresion_chimenea',
                                                        value.depresion_chimenea
                                                    )
                                                }
                                            />
                                        </div>
                                        <div
                                            className={classNames(
                                                mode === 'md' ? 'w-6/6' : 'w-full'
                                            )}
                                        >
                                            <Input
                                                name="caldera_gas"
                                                label={t('Pérdida calor sensible')}
                                                type="number"
                                                value={values.caldera_gas}
                                                onChange={(value) =>
                                                    setFieldValue(
                                                        'caldera_gas',
                                                        value.caldera_gas
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>

                            </div>

                            <div>
                                <div className="uppercase text-[#6C727E] font-medium mt-[22px] font-bold">
                                    Control de consumo de combustible
                                </div>

                                <div
                                    className={classNames(
                                        mode === 'md'
                                            ? 'flex-col w-full mt-[15px]'
                                            : 'flex-col w-full mt-[4px]'
                                    )}
                                >
                                    {/*<div*/}
                                    {/*    className={classNames(*/}
                                    {/*        mode === 'md'*/}
                                    {/*            ? 'flex-col w-full mt-[15px]'*/}
                                    {/*            : 'flex space-x-5 w-full mt-[15px]'*/}
                                    {/*    )}*/}
                                    {/*>*/}
                                    <div
                                        className={classNames(
                                            mode === 'md' ? 'w-6/6' : 'w-full'
                                        )}
                                    >
                                        <DatePicker
                                            value={values.fecha}
                                            name="fecha"
                                            label={t('Fecha medición')}
                                            onChange={(value) =>
                                                setFieldValue('fecha', value.fecha)
                                            }
                                        />
                                    </div>
                                    <div
                                        className={classNames(
                                            mode === 'md' ? 'w-6/6' : 'w-full'
                                        )}
                                    >
                                        <Input
                                            name="suministro"
                                            label={t('Sum. (L, Kg, m3)')}
                                            type="number"
                                            placeholder={t('intervencion.form.numero')}
                                            value={values.suministro}
                                            onChange={(value) =>
                                                setFieldValue(
                                                    'suministro',
                                                    value.suministro
                                                )
                                            }
                                        />
                                    </div>
                                    <div
                                        className={classNames(
                                            mode === 'md' ? 'w-6/6' : 'w-full'
                                        )}
                                    >
                                        <Input
                                            name="existencia"
                                            label={t('Existencia')}
                                            type="number"
                                            value={values.existencia}
                                            onChange={(value) =>
                                                setFieldValue(
                                                    'existencia',
                                                    value.existencia
                                                )
                                            }
                                        />
                                    </div>
                                    <div
                                        className={classNames(
                                            mode === 'md' ? 'w-6/6' : 'w-full'
                                        )}
                                    >
                                        <Input
                                            name="suma_lectura"
                                            label={t('Lectura contadores')}
                                            type="number"
                                            value={values.suma_lectura}
                                            onChange={(value) =>
                                                setFieldValue(
                                                    'suma_lectura',
                                                    value.suma_lectura
                                                )
                                            }
                                        />
                                    </div>
                                    <div
                                        className={classNames(
                                            mode === 'md' ? 'w-6/6' : 'w-full'
                                        )}
                                    >
                                        <Input
                                            name="consumo"
                                            label={t('Consumo')}
                                            type="number"
                                            value={values.consumo}
                                            onChange={(value) =>
                                                setFieldValue('consumo', value.consumo)
                                            }
                                        />
                                    </div>
                                </div>
                            </div>

                        </div>
                    ) : null}

                    {editing ? (

                        <div
                            className={classNames(
                                mode === 'md'
                                    ? 'flex justify-end pb-10'
                                    : 'flex justify-end'
                            )}
                        >
                            <Button
                                type="submit"
                                onClick={noop}
                                label={t('common.button.save')}
                            />
                        </div>
                    ) : null}

                </form>
            )}
        </Formik>
    );
};
