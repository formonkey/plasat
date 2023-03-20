import { useEffect, useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

import { Input } from '../../elements/input';
import { useTranslation } from 'react-i18next';
import { useHttpClient } from '../../shared/http-client';
import { Select } from '../../elements/select';
import { FilterFooter } from '../../elements/filter-footer';

// construccion del objecto yup de validacion del cuestionario
let obligado = {};
const validacion = Yup.object().shape(obligado);

const initialValues = {
    numero: '',
    operario: null
};

export const EquipoFilter = ({
    item,
    doFilter,
    close,
}: {
    item?: any;
    close: () => void;
    doFilter: (item: any) => void;
}) => {

    const { t } = useTranslation();
    const { api, state } = useHttpClient();
    const [data, setData] = useState<any | null>(null);
    const [tiposEquipo, setTiposEquipo] = useState<any | null>([]);

    useEffect(() => {
        api('/tipos-equipo/?limit=9999', 'GET');
    }, []);

    useEffect(() => {
        if (item) {
            setData(item);
        }
    }, [item]);

    const beforeSubmit = (values: any | null) => {
        let after = { ...values };

        return after;
    };

    const onSubmit = async (values: any | null) => {
        //
        const enviaremos = beforeSubmit(values);

        doFilter(enviaremos);
    };

    useEffect(() => {

        if (state.data) {
            if (state.path.includes('tipos-equipo')) {
                setTiposEquipo(state.data.results);
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
                    isSubmitting
                }) => (
                    <form onSubmit={handleSubmit} autoComplete="off">
                        {/*<pre>{JSON.stringify(values, null, 4)}</pre>*/}
                        {/*<pre>{JSON.stringify(errors, null, 4)}</pre>*/}

                        <Input
                            name="name"
                            label={t('equipo.form.name')}
                            type="text"
                            placeholder={t('equipo.form.name')}
                            value={values.name}
                            onChange={(value) =>
                                setFieldValue('name', value.name)
                            }
                        />

                        <Input
                            name="modelo"
                            label={t('equipo.form.modelo')}
                            type="text"
                            placeholder={t('equipo.form.modelo')}
                            value={values.modelo}
                            onChange={(value) =>
                                setFieldValue('modelo', value.modelo)
                            }
                        />

                        <Select
                            name="tipo_equipo"
                            label={t('equipo.form.tipo_equipo')}
                            placeholder="common.placeholder.select-value"
                            items={tiposEquipo}
                            value={values.tipo_equipo}
                            onChange={(value) => {
                                setFieldValue('tipo_equipo', value.tipo_equipo);
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
