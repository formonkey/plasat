import * as Yup from 'yup';

import {useEffect, useState} from 'react';

import {Formik} from 'formik';
import {toast} from 'react-toastify';

import {Input} from '../../elements/input';
import {useHttpClient} from '../../shared/http-client';
import {FormFooter} from '../../elements/form-footer';
import {Toggle} from '../../elements/toggle';
import {FieldError} from "../../elements/field-error/field-error";
import {useTranslation} from "react-i18next";

const fields = {
    name: Yup.string().required('obligatorio')
};

const validations = Yup.object().shape(fields);

const initialValues = {
    name: '',
    por_defecto: false
};

export const TypeEquipmentOperationForm = ({
                                               id,
                                               item,
                                               close
                                           }: {
    item?: any;
    close: () => void;
    id: string | number;
}) => {
    const {t} = useTranslation();
    const {api, state} = useHttpClient();
    const [data, setData] = useState<any | null>({
        tipo_equipo: id,
        ...initialValues
    });

    const onSubmit = async (values: any | null) => {
        if (values.id) {
            api(`/operaciones/${values.id}/`, 'PATCH', values);
        } else {
            api('/operaciones/', 'POST', values);
        }
    };

    useEffect(() => {
        if (item) {
            setData({...data, ...item, tipo_equipo: id});
        }
    }, [item]);

    useEffect(() => {

        if (state.data) {
            close();
        }

        if (state.error) {
            if ("non_field_errors" in state.error.detail) {
                toast.error(t(state.error.detail.non_field_errors[0]));
            } else {
                toast.error(state.error.detail);
            }
        }
    }, [state]);

    return (
        <Formik
            onSubmit={onSubmit}
            initialValues={data}
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
                    <Input
                        type="text"
                        name="name"
                        value={values.name}
                        label="common.label.name"
                        placeholder="common.placeholder.name"
                        onChange={(value) => setFieldValue('name', value.name)}
                    />
                    <FieldError touched={touched} errors={errors} field={"name"}/>

                    <Toggle
                        name="por_defecto"
                        value={values.por_defecto}
                        label="common.label.by-default"
                        onChange={(value) =>
                            setFieldValue('por_defecto', value.por_defecto)
                        }
                    />

                    <FormFooter
                        item={item}
                        close={close}
                        doSubmit={handleSubmit}
                        isSubmitting={isSubmitting}
                    />
                </form>
            )}
        </Formik>
    );
};
