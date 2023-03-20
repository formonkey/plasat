import {useEffect, useState} from 'react';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {toast} from 'react-toastify';

import {useTranslation} from 'react-i18next';
import {useHttpClient} from '../../../shared/http-client';
import {Select} from '../../../elements/select';
import {FilterFooter} from '../../../elements/filter-footer';
import {SelectAsync} from '../../../elements/select-async';

let rules = {};
const validation = Yup.object().shape(rules);

const initialValues = {
    numero: '',
    operario: null
};

export const InterventionHoursFilters = ({
                                             item,
                                             doFilter,
                                             close
                                         }: {
    item?: any;
    close: () => void;
    doFilter: (item: any) => void;
}) => {

    const {t} = useTranslation();
    const {api, state, options} = useHttpClient();
    const [data, setData] = useState<any | null>(null);
    const [operarios, setOperarios] = useState<any | null>([]);
    const [tipos, setTipos] = useState<any | null>([]);

    useEffect(() => {
        api('/operarios/?limit=9999?is_active=true', 'GET');
    }, []);

    useEffect(() => {
        if (item) {
            setData(item);
        }
    }, [item]);

    const beforeSubmit = (values: any | null) => {
        let after = {...values};

        after.cliente = typeof values.cliente === "object" ? values.cliente.id : values.cliente;

        return after;
    };

    const onSubmit = async (values: any | null) => {
        const enviaremos = beforeSubmit(values);

        values.cliente = values.cliente?.id;

        doFilter(enviaremos);
    };

    useEffect(() => {

        if (state.data) {
            if (state.path.includes('operarios')) {
                setOperarios(state.data.results);
                api('/tipos-intervencion/?limit=9999?is_active=true', 'GET');
            }
            if (state.path.includes('tipos-intervencion')) {
                setTipos(state.data.results);
            }
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
                validationSchema={validation}
                validateOnBlur={true}
                onSubmit={onSubmit}
            >
                {({
                      values,
                      errors,
                      setFieldValue,
                      handleSubmit,
                  }) => (
                    <form autoComplete="off">
                        <Select
                            name="operario"
                            label={t('intervencion.form.operario')}
                            placeholder="common.placeholder.select-value"
                            items={operarios}
                            value={values.operario}
                            onChange={(value) => {
                                setFieldValue('operario', value.operario);
                            }}
                        />

                        <Select
                            name="tipo_intervencion"
                            label={t('intervencion.form.tipo_intervencion')}
                            placeholder="common.placeholder.select-value"
                            items={tipos}
                            value={values.tipo_intervencion}
                            onChange={(value) => {
                                setFieldValue('tipo_intervencion', value.tipo_intervencion);
                            }}
                        />

                        <SelectAsync
                            name={'cliente'}
                            label={'intervencion.form.cliente'}
                            placeholder="common.placeholder.select-value"
                            items={(inputValue: string) => {
                                return options(
                                    `/clientes/?limit=9999&name=${inputValue}`
                                );
                            }}
                            value={values.cliente}
                            onChange={(value: any) => {
                                setFieldValue('cliente', value || {});
                                if (value) {
                                    api(
                                        `/instalaciones/?limit=999999&cliente=${value.id}`,
                                        'GET'
                                    );
                                }
                            }}
                        />

                        <FilterFooter
                            item={item}
                            doDelete={() => doFilter({})}
                            doSubmit={handleSubmit}
                            close={close}
                        />
                    </form>
                )}
            </Formik>
        </div>
    );
};
