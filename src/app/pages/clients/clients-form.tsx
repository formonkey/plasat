import * as Yup from 'yup';

import {Formik} from 'formik';
import {toast} from 'react-toastify';
import {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';

import {Input} from '../../elements/input';
import {Toggle} from '../../elements/toggle';
import {Select} from '../../elements/select';
import {FormFooter} from '../../elements/form-footer';
import {useHttpClient} from '../../shared/http-client';
import {FieldError} from '../../elements/field-error/field-error';
import {TextArea} from "../../elements/text-area";

const obligado = {
    name: Yup.string().required('obligatorio'),
    nif: Yup.string().test(
        "len",
        "menor de 16 caracteres",
        (val) => {
            if (val === undefined || val === null) {
                return true;
            }
            return val.length <= 16;
        }
    ).nullable(),
    email: Yup.string().email('Introducir email válido').nullable().required('obligatorio'),
};

const validacion = Yup.object().shape(obligado);

const initialValues = {
    name: '',
    activo: true,
};

export const ClientsForm = ({
                                item,
                                close
                            }: {
    item?: any;
    close: () => void;
}) => {
    const {t} = useTranslation();
    const {api, state} = useHttpClient();
    const [cities, setCities] = useState<any | null>([]);
    const [provinces, setProvinces] = useState<any | null>([]);
    const [countries, setCountries] = useState<any | null>([]);
    const [province, setProvince] = useState<any | null>(null);
    const [country, setCountry] = useState<any | null>(null);

    const [data, setData] = useState<any | null>({
        ...initialValues
    });

    const beforeSubmit = (values: any) => {
        const after = {...values}

        delete after.equipos;
        delete after.contact_province;
        delete after.contact_city;

        return {...after};
    }

    const onSubmit = (values: any | null) => {
        const enviaremos = beforeSubmit(values);

        if (values.id) {
            api(`/clientes/${values.id}/`, 'PATCH', enviaremos);
        } else {
            api('/clientes/', 'POST', enviaremos);
        }
    };

    useEffect(() => {
        api('/paises/?limit=999999', 'GET');
    }, []);

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

    useEffect(() => {
        if (item) {
            setData({...data, ...item, country: item.province?.country || null});
        }
    }, [item]);

    useEffect(() => {
            if (state.data) {
                if (state.path.includes('paises')) {
                    setCountries(state.data.results);
                }

                if (state.path.includes('provincias')) {
                    setProvinces(state.data.results);
                }

                if (state.path.includes('ciudades')) {
                    if (province) {
                        setCities(state.data.results);
                    }
                }

                if (state.path.includes('cliente')) {
                    {
                        close();
                    }
                }
            }

            if (state.error) {
                toast.error(state.error.detail);
            }
        }
        ,
        [state]
    )
    ;

    return (
        <Formik
            onSubmit={onSubmit}
            initialValues={data || initialValues}
            validateOnBlur={true}
            enableReinitialize={true}
            validationSchema={validacion}
        >
            {({
                  values,
                  errors,
                  touched,
                  setFieldValue,
                  handleSubmit,
              }) => (
                <form onSubmit={handleSubmit} autoComplete="off">
                    {/*<pre>{JSON.stringify(errors, null, 4)}</pre>*/}
                    {/*<pre>{JSON.stringify(touched, null, 4)}</pre>*/}

                    <Input
                        type="text"
                        name="name"
                        value={values.name}
                        label="common.label.name"
                        placeholder="common.label.name"
                        onChange={(value) => setFieldValue('name', value.name)}
                    />
                    <FieldError touched={touched} errors={errors} field={"name"}/>

                    <div className="flex space-x-[24px]">
                        <div className="w-1/2">
                            <Input
                                type="text"
                                name="codigo"
                                value={values.codigo}
                                label="common.label.client-code"
                                placeholder="common.label.client-code"
                                onChange={(value) =>
                                    setFieldValue('codigo', value.codigo)
                                }
                            />
                        </div>
                        <div className="w-1/2">
                            <Input
                                type="text"
                                name="nif"
                                value={values.nif}
                                label="common.label.nif"
                                placeholder="common.label.nif"
                                onChange={(value) =>
                                    setFieldValue('nif', value.nif)
                                }
                            />
                            <FieldError touched={touched} errors={errors} field={"nif"}/>
                        </div>
                    </div>

                    <div className="flex space-x-[24px]">
                        <div className="w-1/2">
                            <Input
                                type="text"
                                name="direccion"
                                value={values.direccion}
                                label="common.label.direction"
                                placeholder="common.label.direction"
                                onChange={(value) =>
                                    setFieldValue('direccion', value.direccion)
                                }
                            />
                        </div>
                        <div className="w-1/2">
                            <Input
                                type="text"
                                name="cp"
                                value={values.cp}
                                label="common.label.postal-code"
                                placeholder="common.label.postal-code"
                                onChange={(value) =>
                                    setFieldValue('cp', value.cp)
                                }
                            />
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <Select
                            label={t('provincia.form.country')}
                            placeholder="common.placeholder.select-value"
                            items={countries}
                            name="country"
                            value={values.country}
                            onChange={(value) => {
                                setFieldValue('country', value.country)
                                console.log("COUNTRY", value.country)
                                setCountry(value.country)
                            }}
                        />
                        <FieldError touched={touched} errors={errors} field={"country"}/>
                        <Select
                            name="province"
                            disabled={!provinces.length}
                            label={t('common.label.province')}
                            placeholder="common.label.select-value"
                            items={provinces}
                            value={values.province}
                            onChange={(value) => {
                                setProvince(value.province);
                                setFieldValue('province', value.province);
                            }}
                        />
                        <div className="">
                            <Select
                                name="city"
                                disabled={!cities.length}
                                label={t('common.label.city')}
                                placeholder="common.label.select-value"
                                items={cities}
                                value={values.city}
                                onChange={(value) =>
                                    setFieldValue('city', value.city)
                                }
                            />
                        </div>
                    </div>

                    <div className="relative mb-[16px] mt-[4px]">
                        <div
                            className="absolute inset-0 flex items-center"
                            aria-hidden="true"
                        >
                            <div className="w-full border-t border-gray-300"/>
                        </div>
                        <div className="relative flex justify-start">
                            <span className="pr-2 bg-white text-sm text-gray-500">
                                {t('client.form.contact-data')}
                            </span>
                        </div>
                    </div>

                    <Input
                        type="text"
                        name="contact"
                        value={values.contact}
                        label="common.label.contact"
                        placeholder="common.label.contact"
                        onChange={(value) =>
                            setFieldValue('contact', value.contact)
                        }
                    />

                    <Input
                        type="email"
                        name="email"
                        value={values.email}
                        label="common.label.email"
                        placeholder="common.label.email"
                        onChange={(value) =>
                            setFieldValue('email', value.email)
                        }
                    />
                    <FieldError touched={touched} errors={errors} field={"email"}/>

                    <div className="flex space-x-[24px]">
                        <div className="w-1/2">
                            <Input
                                type="text"
                                name="telefono"
                                value={values.telefono}
                                label="common.label.phone"
                                placeholder="common.label.phone"
                                onChange={(value) =>
                                    setFieldValue('telefono', value.telefono)
                                }
                            />
                        </div>
                        <div className="w-1/2">
                            <Input
                                type="text"
                                name="movil"
                                value={values.movil}
                                label="common.label.mobile-phone"
                                placeholder="common.label.mobile-phone"
                                onChange={(value) =>
                                    setFieldValue('movil', value.movil)
                                }
                            />
                        </div>
                    </div>

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

                    <div className="flex space-x-[24px] pb-16">
                        <div className="w-1/2"/>
                        <div className="w-1/2">
                            <Toggle
                                name="activo"
                                label={t('common.label.active-client')}
                                value={values.activo}
                                onChange={(value) =>
                                    setFieldValue('activo', value.activo)
                                }
                            />
                        </div>
                    </div>

                    <FormFooter
                        item={item}
                        doSubmit={handleSubmit}
                        close={close}
                    />
                </form>
            )}
        </Formik>
    );
};
