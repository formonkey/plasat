import * as Yup from 'yup';

import {useEffect, useState} from 'react';

import {Formik} from 'formik';
import {toast} from 'react-toastify';

import {Input} from '../../elements/input';
import {useTranslation} from 'react-i18next';
import {useHttpClient} from '../../shared/http-client';
import {FormFooter} from '../../elements/form-footer';
import {Select} from '../../elements/select';
import {DatePicker} from '../../elements/date-picker';
import {FieldError} from '../../elements/field-error/field-error';
import {TextArea} from '../../elements/text-area';

const fields = {
    name: Yup.string().required("obligatorio")
};

const validations = Yup.object().shape(fields);

const initialValues = {
    name: ''
};

export const ClientsInstallationsForm = ({
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
    const [cities, setCities] = useState<any | null>([]);
    const [provinces, setProvinces] = useState<any | null>([]);
    const [province, setProvince] = useState<any | null>(null);
    const [countries, setCountries] = useState<any | null>([]);
    const [country, setCountry] = useState<any | null>(null);

    const [data, setData] = useState<any | null>({
        cliente: id,
        ...initialValues
    });

    const beforeSubmit = (values: any | null) => {
        let after = {...values};

        delete after.equipos

        return after;
    };

    const onSubmit = async (values: any | null) => {
        const enviaremos = beforeSubmit(values);

        if (values.id) {
            api(`/instalaciones/${values.id}/`, 'PATCH', enviaremos);
        } else {
            api('/instalaciones/', 'POST', enviaremos);
        }
    };

    useEffect(() => {
        if (item) {
            setData({...data, ...item, cliente: id, country: item.province?.country || {}});
        }
    }, [item]);

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
        if (state.data) {
            if (state.path.includes('paises')) {
                setCountries(state.data.results);
            }
            if (state.path.includes('provincias')) {
                setProvinces(state.data.results);
            }
            if (state.path.includes('ciudades')) {
                setCities(state.data.results);
            }
            if (state.path.includes('instalaciones')) {
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

                    <Input
                        type="text"
                        name="direccion"
                        value={values.direccion}
                        label="common.label.direction"
                        placeholder="common.placeholder.direction"
                        onChange={(value) =>
                            setFieldValue('direccion', value.direccion)
                        }
                    />

                    <div className="flex space-x-[24px]">
                        <div className="w-1/2">
                            <Input
                                type="text"
                                name="cp"
                                value={values.cp}
                                label="common.label.postal-code"
                                placeholder="common.placeholder.postal-code"
                                onChange={(value) =>
                                    setFieldValue('cp', value.cp)
                                }
                            />
                        </div>
                        <div className="w-1/2"/>
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
                                setFieldValue('province', value.province);
                                setProvince(value.province);
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

                    <div className="flex space-x-[24px]">
                        <div className="w-1/2">
                            <Input
                                type="text"
                                name="telefono"
                                value={values.telefono}
                                label="common.label.phone"
                                placeholder="common.placeholder.phone"
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
                                label="common.label.mobile"
                                placeholder="common.placeholder.mobile"
                                onChange={(value) =>
                                    setFieldValue('movil', value.movil)
                                }
                            />
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <DatePicker
                            name="fecha_instalacion"
                            label={t('common.label.installation-date')}
                            value={values.fecha_instalacion}
                            onChange={(value) => {
                                console.log("fecha instalacion ::: ", value);
                                setFieldValue(
                                    'fecha_instalacion',
                                    value.fecha_instalacion
                                )
                            }}
                        />
                        <DatePicker
                            name="fecha_baja"
                            label={t('common.label.down-date')}
                            value={values.fecha_baja || ""}
                            onChange={(value) =>
                                setFieldValue(
                                    'fecha_baja',
                                    value.fecha_baja
                                )
                            }
                        />
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
