import {useEffect, useState} from 'react';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {toast} from 'react-toastify';
import {ColorResult, CompactPicker} from 'react-color';

import {Input} from '../../elements/input';
import {useTranslation} from 'react-i18next';
import {useHttpClient} from '../../shared/http-client';
import {Toggle} from '../../elements/toggle';
import {FormFooter} from '../../elements/form-footer';
import {FieldError} from '../../elements/field-error/field-error';

// construccion del objecto yup de validacion del cuestionario
let obligado = {
    name: Yup.string().required('obligatorio')
};
const validacion = Yup.object().shape(obligado);

const initialValues = {
    name: '',
    is_preventivo: false,
    color: ''
};

export const TiposIntervencionForm = ({
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
    const [data, setData] = useState<any | null>(null);

    useEffect(() => {
        if (item) {
            setData(item);
        }
    }, [item]);

    const beforeSubmit = (values: any | null) => {
        let after = {...values};

        return after;
    };

    const onSubmit = async (values: any | null) => {
        //
        const enviaremos = beforeSubmit(values);

        console.log('enviaremos', enviaremos);

        if (enviaremos.id) {
            // update
            api(`/tipos-intervencion/${enviaremos.id}/`, 'PATCH', enviaremos);
        } else {
            // create
            api('/tipos-intervencion/', 'POST', enviaremos);
        }
    };

    useEffect(() => {

        if (state.data) {
            close();
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

                        <Input
                            label={t('estado.form.name')}
                            type="text"
                            placeholder={t('estado.form.name')}
                            name="name"
                            value={values.name}
                            onChange={(value) =>
                                setFieldValue('name', value.name)
                            }
                        />
                        <FieldError touched={touched} errors={errors} field={"name"}/>

                        <div className={'flex space-x-2'}>
                            <Toggle
                                name="is_preventivo"
                                label={t(
                                    'tipos-intervencion.form.is_preventivo'
                                )}
                                value={values.is_preventivo}
                                onChange={(value) =>
                                    setFieldValue(
                                        'is_preventivo',
                                        value.is_preventivo
                                    )
                                }
                            />
                        </div>

                        <div className={'flex flex-col space-y-4'}>
                            <label
                                className="not-italic font-medium text-sm leading-6"
                            >
                                {t("tipos-intervencion.form.color")}
                            </label>

                            <CompactPicker
                                color={values.color || ""}
                                onChange={(color: ColorResult) => setFieldValue("color", color.hex)}
                            />
                        </div>

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
