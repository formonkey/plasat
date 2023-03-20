import * as Yup from 'yup';

import {useEffect, useState} from 'react';

import {Formik} from 'formik';
import {toast} from 'react-toastify';

import {Input} from '../../elements/input';
import {useTranslation} from 'react-i18next';
import {useHttpClient} from '../../shared/http-client';
import {FormFooter} from '../../elements/form-footer';
import {FieldError} from '../../elements/field-error/field-error';
import {TextArea} from '../../elements/text-area';

const fields = {
    ubicacion: Yup.string().required("obligatorio"),
};

const validations = Yup.object().shape(fields);

const initialValues = {
    ubicacion: '',
    descripcion: '',
};

export const ClientsEquiposForm = ({
                                       item,
                                       close,
                                   }: {
    item?: any;
    close: () => void;
    id: string | number;
}) => {
    const {t} = useTranslation();
    const {api, state} = useHttpClient();

    const [data, setData] = useState<any | null>(null);

    const beforeSubmit = (values: any | null) => {
        let after = {...values};

        after.equipo = item.equipo.id;
        after.instalacion = item.instalacion.id;
        after.id = item.id;

        return after;
    };

    const onSubmit = async (values: any | null) => {
        const enviaremos = beforeSubmit(values);

        console.log("enviaremos", enviaremos);

        if (enviaremos.id) {
            api(`/equipos-instalacion/${enviaremos.id}/`, 'PATCH', enviaremos);
        } else {
            api('/equipos-instalacion/', 'POST', enviaremos);
        }
    };

    useEffect(() => {
        if (item) {
            setData({...item});
        }
    }, [item]);


    useEffect(() => {
        if (state.data) {
            if (state.path.includes('equipos-instalacion')) {
                close();
            }
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
                    {/*<pre>{JSON.stringify(errors, null, 4)}</pre>*/}
                    {/*<pre>{JSON.stringify(touched, null, 4)}</pre>*/}

                    <Input
                        type="text"
                        name="ubicacion"
                        value={values.ubicacion}
                        label="common.label.ubicacion"
                        placeholder="common.placeholder.ubicacion"
                        onChange={(value) => setFieldValue('ubicacion', value.ubicacion)}
                    />
                    <FieldError touched={touched} errors={errors} field={"name"}/>

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

                    <div className={"pb-24"}></div>

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
