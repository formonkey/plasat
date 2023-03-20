import {useEffect, useState} from 'react';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {toast} from 'react-toastify';

import {Input} from '../../elements/input';
import {useTranslation} from 'react-i18next';
import {useHttpClient} from '../../shared/http-client';
import {Select} from '../../elements/select';
import {FormFooter} from '../../elements/form-footer';
import {DatePicker} from '../../elements/date-picker';
import {FieldError} from "../../elements/field-error/field-error";

// construccion del objecto yup de validacion del cuestionario
let obligado = {
    name: Yup.string().required('obligatorio'),
    email: Yup.string().email('Introducir email válido').nullable(),
    nif: Yup.string().nullable().test(
        "len",
        "menor de 16 caracteres",
        (val) => {
            if (val === undefined || val === null) {
                return true;
            }
            return val.length <= 16;
        }
    ),
};
const validacion = Yup.object().shape(obligado);

const initialValues = {
    name: '',
    province: {},
    city: {},
    email: ''
};

export const ProveedoresExternosForm = ({
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
    const [ciudades, setCiudades] = useState<any | null>([]);
    const [countries, setCountries] = useState<any | null>([]);
    const [country, setCountry] = useState<any | null>(null);
    const [province, setProvince] = useState<any | null>(null);

    useEffect(() => {
        api('/paises/?limit=999999', 'GET');

        console.log("ITEM ::: ", item)

        if (item) {
            const datos = {...item};
            datos.province = item.province ? item.province?.id || {} : {};
            datos.city = item.city ? item.city?.id || {} : {};
            datos.contact_province = item.contact_province
                ? item.contact_province?.id || {}
                : {};
            datos.contact_city = item.contact_city ? item.contact_city?.id || {} : {};
            datos.country = item.province?.country || {};

            setData(datos);
        }
    }, [item]);

    const beforeSubmit = (values: any | null) => {
        let after = {...values};

        after.province =
            typeof values.province === 'object'
                ? values.province?.id || null
                : values.province;
        after.city =
            typeof values.city === 'object' ? values.city?.id || null : values.city;
        after.contact_province =
            typeof values.contact_province === 'object'
                ? values.contact_province.id || null
                : values.contact_province || null;
        after.contact_city =
            typeof values.contact_city === 'object'
                ? values.contact_city?.id || null
                : values.contact_city;

        return after;
    };

    const onSubmit = async (values: any | null) => {
        //
        const enviaremos = beforeSubmit(values);

        if (enviaremos.id) {
            // update
            api(`/proveedores-externo/${enviaremos.id}/`, 'PATCH', enviaremos);
        } else {
            // create
            api('/proveedores-externo/', 'POST', enviaremos);
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
                setCiudades(state.data.results);
            }

            if (state.path.includes('proveedores-externo')) {
                close();
            }
        }

        if (state.error) {
            if ("nif" in state.error.detail) {
                toast.error(state.error.detail.nif[0]);
            } else {
                toast.error(state.error.detail);
            }
        }
    }, [state]);

    useEffect(() => {
        if (country) {
            api(`/provincias/?pais=${country}&limit=999999`, 'GET');
        }
    }, [country]);

    useEffect(() => {
        if (province) {
            api(`/ciudades/?provincia=${province}&limit=999999`, 'GET');
        }
    }, [province]);

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
                        {/*<pre>{JSON.stringify(errors, null, 4)}</pre>*/}

                        <div className={'flex space-x-2'}>

                            <Input
                                name="nif"
                                label={t('proveedores.form.nif')}
                                type="text"
                                placeholder={t('proveedores.form.nif')}
                                value={values.nif}
                                onChange={(value) =>
                                    setFieldValue('nif', value.nif)
                                }
                            />
                        </div>
                        <FieldError touched={touched} errors={errors} field={"nif"}/>

                        <Input
                            name="name"
                            label={t('proveedores.form.name')}
                            type="text"
                            placeholder={t('proveedores.form.name')}
                            value={values.name}
                            onChange={(value) =>
                                setFieldValue('name', value.name)
                            }
                        />
                        <FieldError touched={touched} errors={errors} field={"name"}/>

                        <Input
                            name="email"
                            label={t('proveedores.form.email')}
                            type="email"
                            placeholder={t('proveedores.form.email')}
                            value={values.email}
                            onChange={(value) =>
                                setFieldValue('email', value.email)
                            }
                        />
                        <FieldError touched={touched} errors={errors} field={"email"}/>

                        <div className={'flex space-x-2'}>
                            <Input
                                name="telefono"
                                label={t('proveedores.form.phone')}
                                type="text"
                                placeholder={t('proveedores.form.phone')}
                                value={values.telefono}
                                onChange={(value) =>
                                    setFieldValue('telefono', value.telefono)
                                }
                            />

                            <Input
                                name="movil"
                                label={t('proveedores.form.mobile')}
                                type="text"
                                placeholder={t('proveedores.form.mobile')}
                                value={values.movil}
                                onChange={(value) =>
                                    setFieldValue('movil', value.movil)
                                }
                            />
                        </div>

                        <Input
                            name="direccion"
                            label={t('proveedores.form.direccion')}
                            type="text"
                            placeholder={t('proveedores.form.direccion')}
                            value={values.direccion}
                            onChange={(value) =>
                                setFieldValue('direccion', value.direccion)
                            }
                        />

                        <Input
                            name="cp"
                            label={t('proveedores.form.cp')}
                            type="text"
                            placeholder={t('proveedores.form.cp')}
                            value={values.cp}
                            onChange={(value) =>
                                    setFieldValue('cp', value.cp)}
                        />

                        <div className={'flex flex-col'}>
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


                            <Select
                                name="province"
                                disabled={!provinces.length}
                                label={t('proveedores.form.province')}
                                placeholder={t('proveedores.form.province')}
                                items={provinces}
                                value={values.province}
                                onChange={(value) => {
                                    if (value.province) {
                                        setFieldValue('province', value.province);
                                        setProvince(value.province);
                                    } else {
                                        setFieldValue('province', {});
                                        setFieldValue('city', {})
                                    }
                                }}
                            />

                            <Select
                                name="city"
                                label={t('proveedores.form.city')}
                                placeholder={t('proveedores.form.city')}
                                items={ciudades}
                                value={values.city}
                                disabled={!ciudades.length}
                                onChange={(value) =>
                                    setFieldValue('city', value.city)
                                }
                            />
                        </div>

                        <div className="relative py-2">
                            <div
                                className="absolute inset-0 flex items-center"
                                aria-hidden="true"
                            >
                                <div className="w-full border-t border-gray-300"/>
                            </div>
                            <div className="relative flex justify-center">
                                <span className="px-2 bg-white text-sm text-gray-500">
                                    {t('proveedores.label.contact')}
                                </span>
                            </div>
                        </div>

                        <Input
                            name="contact"
                            label={t('proveedores.form.contact')}
                            type="text"
                            placeholder={t('proveedores.form.contact')}
                            value={values.contact}
                            onChange={(value) =>
                                setFieldValue('contact', value.contact)
                            }
                        />

                        <div className="relative py-2">
                            <div
                                className="absolute inset-0 flex items-center"
                                aria-hidden="true"
                            >
                                <div className="w-full border-t border-gray-300"/>
                            </div>
                        </div>

                        <DatePicker
                            name={'fecha_baja'}
                            label={t('proveedores.form.fecha_baja')}
                            value={values.fecha_baja}
                            onChange={(value) =>
                                setFieldValue('fecha_baja', value.fecha_baja)
                            }
                        />

                        <div className={"pb-24"}></div>

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
