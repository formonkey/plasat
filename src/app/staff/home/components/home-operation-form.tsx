import * as Yup from 'yup';

import React, { useEffect, useState } from 'react';

import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';

import { noop } from '../../../utils';
import { Input } from '../../../elements/input';
import { FormFooter } from '../../../elements/form-footer';
import { useHttpClient } from '../../../shared/http-client';

const validations = Yup.object().shape({});

export const HomeOperationForm = ({ item, close }: any) => {
    const { t } = useTranslation();
    const { api, state } = useHttpClient();
    const [ values, setValues ] = useState<any>({});

    const onSubmit = (values: any) => {
        api(`/operaciones-equipo/${item.id}/`, 'PATCH', values);
    };

    useEffect(() => {
        setValues({
            horas_estimadas: item?.horas_estimadas ?? 0,
            precio_hora: item?.precio_hora ?? 0,
            horas_reales: item?.horas_reales ?? 0
        })
    }, [item])

    useEffect(() => {
        if (state.data && !state.isLoading) {
            close();
        }
    }, [state])

    return (
        <Formik
            enableReinitialize={true}
            initialValues={values}
            validationSchema={validations}
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
                    {/*<Input*/}
                    {/*    value={values.horas_estimadas}*/}
                    {/*    label={t('intervencion.form.horas_estimadas')}*/}
                    {/*    type="number"*/}
                    {/*    name="horas_estimadas"*/}
                    {/*    placeholder={t('intervencion.form.horas_estimadas')}*/}
                    {/*    onChange={(value) =>*/}
                    {/*        setFieldValue(*/}
                    {/*            'horas_estimadas',*/}
                    {/*            value.horas_estimadas*/}
                    {/*        )*/}
                    {/*    }*/}
                    {/*/>*/}

                    {/*<Input*/}
                    {/*    value={values.precio_hora}*/}
                    {/*    label={t('intervencion.form.precio_hora')}*/}
                    {/*    type="number"*/}
                    {/*    name="precio_hora"*/}
                    {/*    placeholder={t('intervencion.form.precio_hora')}*/}
                    {/*    onChange={(value) =>*/}
                    {/*        setFieldValue('precio_hora', value.precio_hora)*/}
                    {/*    }*/}
                    {/*    extraHolder={'€ / h'}*/}
                    {/*/>*/}

                    <Input
                        value={values.horas_reales}
                        label={t('intervencion.form.horas_reales')}
                        type="number"
                        name="horas_reales"
                        placeholder={t('intervencion.form.horas_reales')}
                        onChange={(value) =>
                            setFieldValue(
                                'horas_reales',
                                value.horas_reales
                            )
                        }
                    />

                    <FormFooter
                        doSubmit={handleSubmit}
                        close={noop}
                    />
                </form>
            )}
        </Formik>
    );
};
