import {useEffect, useState} from 'react';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {toast} from 'react-toastify';

import {Input} from '../../elements/input';
import {useTranslation} from 'react-i18next';
import {useHttpClient} from '../../shared/http-client';
import {FormFooter} from '../../elements/form-footer';
import {FileInputElement} from '../../elements/file-input';
import {DateTimePicker} from '../../elements/date-time-picker';
import {FieldError} from "../../elements/field-error/field-error";
import dayjs from "dayjs";

// construccion del objecto yup de validacion del cuestionario
let obligado = {
    name: Yup.string().required('obligatorio'),
    imagen: Yup.mixed().required('obligatorio'),
};
const validacion = Yup.object().shape(obligado);

const initialValues = {
    name: '',
    fecha: null,
    imagen: null
};

export const ImagenesIntervencionEditForm = ({
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
    const [intervencion, setIntervencion] = useState<any | null>(null);

    useEffect(() => {
        // api(`/operarios/`, 'GET');
    }, []);

    useEffect(() => {
        if (item) {
            setIntervencion(item.intervencion);
            delete item.intervencion;
            setData(item);
        }
    }, [item]);

    const beforeSubmit = (values: any | null) => {
        let after = {...values};

        after.intervencion = typeof intervencion === "object" ? intervencion?.id : intervencion;
        // after.fecha_pago = values.fecha_pago.split('T')[0];

        delete after.equipo;
        delete after.operaciones_equipo;

        return {...after};
    };

    const onSubmit = async (values: any | null) => {
        const enviaremos = beforeSubmit(values);

        let formdata = new FormData();
        if (enviaremos.imagen.imagen) {
            formdata.append(
                'imagen',
                enviaremos.imagen.imagen[0],
                enviaremos.imagen.imagen[0].name
            );
        }

        formdata.append('intervencion', enviaremos.intervencion);
        formdata.append('name', enviaremos.name);
        formdata.append('fecha', enviaremos.fecha);

        if (enviaremos.id) {
            api(`/imagenes/${enviaremos.id}/`, 'PATCH', formdata, true);
        } else {
            api('/imagenes/', 'POST', formdata, true);
        }
    };

    useEffect(() => {
        if (state.data) {
            if (state.path.includes('imagenes')) {
                close();
            }
        }

        if (state.error) {
            toast.error(state.error.detail);
        }
    }, [state]);

    return (
        <div>
            <div className="flex flex-col mb-4">
                <div className={'font-bold text-xl'}>{data?.name}</div>
            </div>

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
                      isSubmitting
                  }) => (
                    <form onSubmit={handleSubmit} autoComplete="off">
                        {/*<pre>{JSON.stringify(item, null, 4)}</pre>*/}
                        {/*<pre>{JSON.stringify(errors, null, 4)}</pre>*/}
                        {/*<div>*/}
                        {/*    <DateTimePicker*/}
                        {/*        type={'date'}*/}
                        {/*        value={values.fecha || dayjs().toDate()}*/}
                        {/*        name={'fecha'}*/}
                        {/*        label={t('intervencion.form.fecha')}*/}
                        {/*        onChange={(value) =>*/}
                        {/*            setFieldValue('fecha', value.fecha)*/}
                        {/*        }*/}
                        {/*    />*/}
                        {/*    <FieldError touched={touched} errors={errors} field={"fecha"}/>*/}
                        {/*</div>*/}

                        <Input
                            value={values.name}
                            label={t('intervencion.form.descripcion')}
                            type="text"
                            name="name"
                            placeholder={t('intervencion.form.descripcion')}
                            onChange={(value) =>
                                setFieldValue('name', value.name)
                            }
                        />
                        <FieldError touched={touched} errors={errors} field={"name"}/>

                        <FileInputElement
                            label={t('intervencion.form.imagen')}
                            name="imagen"
                            onChange={(value) => {
                                setFieldValue('imagen', value)
                            }}
                        />
                        <FieldError touched={touched} errors={errors} field={"imagen"}/>

                        {data?.imagen && <img src={data.imagen}/>}


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
