import * as Yup from 'yup';

import React, {useEffect, useState} from 'react';

import {Formik} from 'formik';
import {useTranslation} from 'react-i18next';
import {FormFooter} from '../../../elements/form-footer';
import {useHttpClient} from '../../../shared/http-client';
import {TextArea} from "../../../elements/text-area";

const validations = Yup.object().shape({});

export const HomeInterventionForm = ({item, close}: any) => {
    const {t} = useTranslation();
    const {api, state} = useHttpClient();
    const [values, setValues] = useState<any>({});

    const onSubmit = (values: any) => {
        api(`/intervenciones/${item.id}/`, 'PATCH', values);
    };

    useEffect(() => {
        setValues({
            descripcion: item?.descripcion ?? "",
            observaciones: item?.observaciones ?? "",
            trabajos: item?.trabajos ?? "",
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

                    <TextArea
                        label={t('descripcion')}
                        name={"descripcion"}
                        value={values.descripcion}
                        onChange={(value) =>
                            setFieldValue('descripcion', value.descripcion)
                        }
                    />

                    <TextArea
                        label={t('observaciones')}
                        name={"observaciones"}
                        value={values.observaciones}
                        onChange={(value) =>
                            setFieldValue('observaciones', value.observaciones)
                        }
                    />

                    <TextArea
                        label={t('trabajos')}
                        name={"trabajos"}
                        value={values.trabajos}
                        onChange={(value) =>
                            setFieldValue('trabajos', value.trabajos)
                        }
                    />

                    <FormFooter
                        doSubmit={handleSubmit}
                        close={close}
                    />
                </form>
            )}
        </Formik>
    );
};
