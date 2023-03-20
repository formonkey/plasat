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
    province: Yup.string().required('obligatorio').nullable(),
};
const validacion = Yup.object().shape(obligado);

const initialValues = {
    name: '',
    province: null,
    country: null,
};

export const CiudadesForm = ({
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
    const [provinces, setProvinces] = useState<any | null>([]);
    const [country, setCountry] = useState<any | null>(null);
    const [countries, setCountries] = useState<any | null>([]);

    useEffect(() => {
        api('/paises/?limit=999999', 'GET');
    }, []);

    useEffect(() => {
        if (item) {
            setData({...item, country: item.province.country});
        }
    }, [item]);

    const beforeSubmit = (values: any | null) => {
        let after = {...values};

        after.province =
            typeof values.province === 'object'
                ? values.province.id
                : values.province;

        return after;
    };

    const onSubmit = async (values: any | null) => {
        const enviaremos = beforeSubmit(values);

        if (enviaremos.id) {
            // update
            api(`/ciudades/${enviaremos.id}/`, 'PATCH', enviaremos);
        } else {
            // create
            api('/ciudades/', 'POST', enviaremos);
        }
    };

    useEffect(() => {


        if (state.data) {
            if (state.path.includes('paises')) {
                setCountries(state.data.results);
            }

            if (state.path.includes('provincias')) {
                setProvinces(state.data.results);
            }

            if (state.path.includes('ciudades')) {
                close();
            }
        }

        if (state.error) {
            if ("non_field_errors" in state.error.detail) {
                toast.error(state.error.detail.non_field_errors[0]);
            } else {
                toast.error(state.error.detail);
            }
        }
    }, [state]);

    useEffect(() => {
        if (country) {
            api(`/provincias/?pais=${country}`, 'GET');
        }
    }, [country]);

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
                      touched,
                      errors,
                      setFieldValue,
                      handleSubmit,
                  }) => {

                    // console.log("ERR", JSON.stringify(errors, null, 4));
                    // console.log("ERR", JSON.stringify(touched, null, 4));

                    return <form onSubmit={handleSubmit} autoComplete="off">
                        <Input
                            name="name"
                            label={t('ciudad.form.name')}
                            type="text"
                            placeholder="Name"
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
                            onChange={(value) => {
                                setFieldValue('country', value.country)
                                setCountry(value.country)
                            }}
                        />
                        <FieldError touched={touched} errors={errors} field={"country"}/>


                        <div>
                            <Select
                                name="province"
                                label={t('ciudad.form.province')}
                                placeholder={t('common.placeholder.select-value')}
                                items={provinces}
                                value={values.province}
                                disabled={!values.country}
                                onChange={(value) =>
                                    setFieldValue('province', value.province)
                                }
                            />
                            <FieldError touched={touched} errors={errors} field={"province"}/>
                        </div>

                        <FormFooter
                            item={item}
                            doDelete={doDelete}
                            doSubmit={handleSubmit}
                            close={close}
                        />
                    </form>
                }}
            </Formik>
        </div>
    );
};
