import React, {useEffect, useState} from 'react';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {toast} from 'react-toastify';

import {Input} from '../../elements/input';
import {Button} from '../../elements/button';
import {TextArea} from '../../elements/text-area';
import {useTranslation} from 'react-i18next';
import {useHttpClient} from '../../shared/http-client';
import {classNames} from '../../utils';

const rules = {};

const initialValues = {};
const validation = Yup.object().shape(rules);

export const InterventionHours = ({
                                      mode,
                                      item
                                  }: {
    mode?: string;
    item?: any;
}) => {
    const {t} = useTranslation();
    const {api, state} = useHttpClient();
    const [data, setData] = useState<any>({});

    const onSubmit = (values: any) => {
        values.intervencion = item.id;
        if (values.id) {
            api(`/horas-intervencion/${values.id}/`, 'PATCH', values);
        } else {
            api('/horas-intervencion/', 'POST', values);
        }
    };

    useEffect(() => {
        const id = typeof item === 'object' ? item.id : item;
        api(
            `/horas-intervencion/?intervencion=${id}`,
            'GET'
        );
    }, []);

    useEffect(() => {
        if (state.data) {
            if (state.path.includes('/horas-intervencion/?intervencion=')) {
                setData(
                    state.data.results.length
                        ? {...state.data.results[0]}
                        : {...data}
                );
            } else if (state.path.includes('/horas-intervencion/')) {
                toast.success(t('intervention-hours.message.success'));
            }
        }
    }, [state]);

    return (
        <Formik
            enableReinitialize={true}
            initialValues={
                {
                    ...initialValues,
                    ...data,
                    intervencion: item
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
                <form autoComplete="off">

                    <div className={"grid grid-cols-2 gap-4"}>

                        <div>

                            <div className="uppercase text-[#6C727E] font-medium mt-[22px]">
                                Horas de servicio
                            </div>

                            <div
                                className={classNames(
                                    mode === 'md'
                                        ? 'flex-col w-full mt-[15px]'
                                        : 'flex space-x-5 w-full mt-[15px]'
                                )}
                            >
                                <div
                                    className={classNames(
                                        mode === 'md' ? 'w-6/6' : 'w-1/6'
                                    )}
                                >
                                    <Input
                                        name="horas_servicio_normal"
                                        label={t('Normales')}
                                        type="number"
                                        value={values.horas_servicio_normal}
                                        onChange={(value) =>
                                            setFieldValue(
                                                'horas_servicio_normal',
                                                value.horas_servicio_normal
                                            )
                                        }
                                    />
                                </div>
                                <div
                                    className={classNames(
                                        mode === 'md' ? 'w-6/6' : 'w-1/6'
                                    )}
                                >
                                    <Input
                                        name="horas_servicio_extra"
                                        label={t('Extras')}
                                        type="number"
                                        value={values.horas_servicio_extra}
                                        onChange={(value) =>
                                            setFieldValue(
                                                'horas_servicio_extra',
                                                value.horas_servicio_extra
                                            )
                                        }
                                    />
                                </div>
                                <div
                                    className={classNames(
                                        mode === 'md' ? 'w-6/6' : 'w-1/6'
                                    )}
                                >
                                    <Input
                                        name="horas_servicio_nocturna"
                                        label={t('Fest. Noct.')}
                                        type="number"
                                        value={values.horas_servicio_nocturna}
                                        onChange={(value) =>
                                            setFieldValue(
                                                'horas_servicio_nocturna',
                                                value.horas_servicio_nocturna
                                            )
                                        }
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="uppercase text-[#6C727E] font-medium mt-[22px]">
                                Horas de desplazamiento
                            </div>

                            <div
                                className={classNames(
                                    mode === 'md'
                                        ? 'flex-col w-full mt-[15px]'
                                        : 'flex space-x-5 w-full mt-[15px]'
                                )}
                            >
                                <div
                                    className={classNames(
                                        mode === 'md' ? 'w-6/6' : 'w-1/6'
                                    )}
                                >
                                    <Input
                                        name="horas_desplazamiento_normal"
                                        label={t('Normales')}
                                        type="number"
                                        value={values.horas_desplazamiento_normal}
                                        onChange={(value) =>
                                            setFieldValue(
                                                'horas_desplazamiento_normal',
                                                value.horas_desplazamiento_normal
                                            )
                                        }
                                    />
                                </div>
                                <div
                                    className={classNames(
                                        mode === 'md' ? 'w-6/6' : 'w-1/6'
                                    )}
                                >
                                    <Input
                                        name="horas_desplazamiento_extra"
                                        label={t('Extras')}
                                        type="number"
                                        value={values.horas_desplazamiento_extra}
                                        onChange={(value) =>
                                            setFieldValue(
                                                'horas_desplazamiento_extra',
                                                value.horas_desplazamiento_extra
                                            )
                                        }
                                    />
                                </div>
                                <div
                                    className={classNames(
                                        mode === 'md' ? 'w-6/6' : 'w-1/6'
                                    )}
                                >
                                    <Input
                                        name="horas_desplazamiento_nocturna"
                                        label={t('Fest. Noct.')}
                                        type="number"
                                        value={values.horas_desplazamiento_nocturna}
                                        onChange={(value) =>
                                            setFieldValue(
                                                'horas_desplazamiento_nocturna',
                                                value.horas_desplazamiento_nocturna
                                            )
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        className={classNames(
                            mode === 'md'
                                ? 'flex-col w-full mt-[15px]'
                                : 'flex space-x-5 w-full mt-[15px]'
                        )}
                    >
                        <div
                            className={classNames(
                                mode === 'md' ? 'w-6/6' : 'w-1/6'
                            )}
                        >
                            <Input
                                name="kilometros"
                                label={t('Kilómetros')}
                                type="number"
                                placeholder={t('intervencion.form.numero')}
                                value={values.kilometros}
                                onChange={(value) =>
                                    setFieldValue(
                                        'kilometros',
                                        value.kilometros
                                    )
                                }
                            />
                        </div>
                        <div
                            className={classNames(
                                mode === 'md' ? 'w-6/6' : 'w-1/6'
                            )}
                        >
                            <Input
                                name="dietas"
                                label={t('Dietas')}
                                type="number"
                                placeholder={t('intervencion.form.numero')}
                                value={values.dietas}
                                onChange={(value) =>
                                    setFieldValue('dietas', value.dietas)
                                }
                            />
                        </div>
                    </div>

                    <div
                        className={classNames(
                            mode === 'md'
                                ? 'flex-col w-full mt-[15px]'
                                : 'flex space-x-5 w-full mt-[15px]'
                        )}
                    >
                        <div
                            className={classNames(
                                mode === 'md' ? 'w-6/6' : 'w-3/6'
                            )}
                        >
                            <TextArea
                                name={'observaciones'}
                                label={t('Observaciones')}
                                value={values.observaciones}
                                onChange={(value) =>
                                    setFieldValue(
                                        'observaciones',
                                        value.observaciones
                                    )
                                }
                            />
                        </div>
                    </div>

                    <div
                        className={classNames(
                            mode === 'md'
                                ? 'flex justify-end w-6/6 pb-10'
                                : 'flex justify-end w-3/6'
                        )}
                    >
                        <Button
                            type="submit"
                            onClick={handleSubmit}
                            label={t('common.button.save')}
                        />
                    </div>
                </form>
            )}
        </Formik>
    );
};
