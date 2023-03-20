import {useEffect, useState} from 'react';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {toast} from 'react-toastify';

import {useTranslation} from 'react-i18next';
import {useHttpClient} from '../../../shared/http-client';
import {Select} from '../../../elements/select';
import {FilterFooter} from '../../../elements/filter-footer';
import {SelectAsync} from "../../../elements/select-async";

// construccion del objecto yup de validacion del cuestionario
let obligado = {};
const validacion = Yup.object().shape(obligado);

const initialValues = {
    numero: '',
    operario: null
};

export const IntervencionFilter = ({
                                       item,
                                       doFilter,
                                       close,
                                   }: {
    item?: any;
    close: () => void;
    doFilter: (item: any) => void;
}) => {

    const {t} = useTranslation();
    const {api, state, options} = useHttpClient();
    const [data, setData] = useState<any | null>(null);
    const [operarios, setOperarios] = useState<any | null>([]);

    useEffect(() => {
        api('/operarios/?limit=9999&is_active=true', 'GET');
    }, []);

    useEffect(() => {
        if (item) {
            setData(item);
        }
    }, [item]);

    const beforeSubmit = (values: any | null) => {
        let after = {...values};

                if (values.cliente) {
            after.cliente = values.cliente.id;
        }

        return after;
    };

    const onSubmit = async (values: any | null) => {
        //
        const enviaremos = beforeSubmit(values);

        doFilter(enviaremos);
    };

    useEffect(() => {

        if (state.data) {
            if (state.path.includes('operarios')) {
                setOperarios(state.data.results);
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
                validationSchema={validacion}
                validateOnBlur={true}
                onSubmit={onSubmit}
            >
                {({
                      values,
                      errors,
                      setFieldValue,
                      handleSubmit,
                  }) => (
                    <form onSubmit={handleSubmit} autoComplete="off">
                        {/*<pre>{JSON.stringify(values, null, 4)}</pre>*/}
                        {/*<pre>{JSON.stringify(errors, null, 4)}</pre>*/}

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

                        <SelectAsync
                            name={'cliente'}
                            label={'intervencion.form.cliente'}
                            placeholder="common.placeholder.select-value"
                            items={(inputValue: string) => {
                                return options(
                                    `/clientes/?limit=9999&name=${inputValue}&activo=true`
                                );
                            }}
                            value={values.cliente}
                            onChange={(value) => {
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
