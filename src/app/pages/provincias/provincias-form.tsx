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

// construccion del objecto yup de validacion del cuestionario
let obligado = {
    name: Yup.string().required('obligatorio'),
    country: Yup.string().required('obligatorio').nullable(),
};
const validacion = Yup.object().shape(obligado);

const initialValues = {
    name: '',
    country: null,
};

export const ProvinciasForm = ({
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
    const [countries, setCountries] = useState<any | null>([]);

    useEffect(() => {
        api('/paises/?limit=999999', 'GET');
    }, []);

    useEffect(() => {
        if (item) {
            setData(item);
        }
    }, [item]);

    const beforeSubmit = (values: any | null) => {
        let after = {...values};

        after.country =
            typeof values.country === 'object'
                ? values.country.id
                : values.country;

        return after;
    };

    const onSubmit = async (values: any | null) => {
        //
        const enviaremos = beforeSubmit(values);

        if (enviaremos.id) {
            // update
            api(`/provincias/${enviaremos.id}/`, 'PATCH', enviaremos);
        } else {
            // create
            api('/provincias/', 'POST', enviaremos);
        }
    };

    useEffect(() => {

        if (state.data) {
            if (state.path.includes('paises')) {
                setCountries(state.data.results);
            }

            if (state.path.includes('provincias')) {
                close();
            }
        }

        if (state.error) {
            if ("name" in state.error.detail) {
                toast.error(state.error.detail.name[0]);
            } else {
                toast.error(state.error.detail);
            }
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
                            label={t('provincia.form.name')}
                            type="text"
                            placeholder="Name"
                            name="name"
                            value={values.name}
                            onChange={(value) =>
                                setFieldValue('name', value.name)
                            }
                        />
                        <FieldError touched={touched} errors={errors} field={"name"}/>

                        <Select
                            label={t('provincia.form.country')}
                            placeholder="common.placeholder.select-value"
                            items={countries}
                            name="country"
                            value={values.country}
                            onChange={(value) =>
                                setFieldValue('country', value.country)
                            }
                        />
                        <FieldError touched={touched} errors={errors} field={"country"}/>

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
