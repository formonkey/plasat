import React, {useEffect, useState} from 'react';

import {Formik} from 'formik';
import {useHttpClient} from '../../shared/http-client';
import {Input} from '../../elements/input';
import {Select} from '../../elements/select';
import {toast} from 'react-toastify';
import {useTranslation} from 'react-i18next';
import * as Yup from 'yup';
import {Toggle} from '../../elements/toggle';
import {FilterFooter} from '../../elements/filter-footer';

export const ClientFilterForm = ({item, close, onFilter}: any) => {
    const {t} = useTranslation();
    const {api, state} = useHttpClient();
    const [cities, setCities] = useState<any | null>([]);
    const [countries, setCountries] = useState<any | null>([]);
    const [provinces, setProvinces] = useState<any | null>([]);
    const [province, setProvince] = useState<any | null>(null);
    const [country, setCountry] = useState<any | null>(null);

    const onSubmit = (values: any) => {
        delete values.country;
        onFilter(values);

        close();
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
        }

        if (state.error) {
            toast.error(state.error.detail);
        }
    }, [state]);

    return (
        <Formik
            onSubmit={onSubmit}
            initialValues={{
                city: '',
                name: '',
                codigo: '',
                province: '',
                activo: null,

                ...item,
            }}
            validateOnBlur={true}
            enableReinitialize={true}
            validationSchema={Yup.object().shape({})}
        >
            {({
                  values,
                  errors,
                  setFieldValue,
                  handleSubmit,
                  isSubmitting
              }) => (
                <form onSubmit={handleSubmit} autoComplete="off">
                    <div className="flex space-x-[24px]">
                        <div className="w-1/2">
                            <Input
                                type="text"
                                name="name"
                                value={values.name}
                                label="common.label.name"
                                placeholder="common.placeholder.name"
                                onChange={(value) =>
                                    setFieldValue('name', value.name)
                                }
                            />
                        </div>
                        <div className="w-1/2">
                            <Input
                                type="text"
                                name="codigo"
                                value={values.codigo}
                                label="common.label.code"
                                placeholder="common.placeholder.code"
                                onChange={(value) =>
                                    setFieldValue('codigo', value.codigo)
                                }
                            />
                        </div>
                    </div>

                    <div>
                        <Select
                            name="country"
                            label={t('common.label.country')}
                            placeholder="common.label.select-value"
                            items={countries}
                            value={values.country}
                            onChange={(value) => {
                                setCountry(value.country);
                                setFieldValue('country', value.country);
                            }}
                        />
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

                    <Toggle
                        hasInfo
                        value={values.activo}
                        onChange={(value) =>
                            setFieldValue('activo', value.toggle)
                        }
                        label={t('client.filter.active')}
                    />

                    <FilterFooter
                        item={{}}
                        doDelete={() => onSubmit({})}
                        doSubmit={handleSubmit}
                        close={close}
                    />
                </form>
            )}
        </Formik>
    );
};
