import * as Yup from 'yup';

import React, {useEffect, useState} from 'react';
import SignatureCanvas from 'react-signature-canvas';
import {dataURLtoFile, toDataUrl} from '../constants';
import {Formik} from 'formik';
import {Input} from '../../../elements/input';
import {FormFooter} from '../../../elements/form-footer';
import {useTranslation} from 'react-i18next';
import {useHttpClient} from '../../../shared/http-client';
import {useCookies} from "../../../shared/cookies";
import {StoreKeys} from "../../../shared/store";

const validations = Yup.object().shape({});

export const HomeSignatureForm = ({item, cancel, close}: any) => {
    const {get: getCookie} = useCookies();
    const {t} = useTranslation();
    const {api, state} = useHttpClient();
    const [values, setValues] = useState<any>({});
    const [profile, setProfile] = useState<any>({});
    const [operatorSignatureRef, operatorSetSignatureRef] = useState<any>({});
    const [clientSignatureRef, clientSetSignatureRef] = useState<any>({});

    const onEndSignature = (signatureRef: any) =>
        dataURLtoFile(signatureRef.toDataURL(), 'signature.jpg');

    console.log("ITEM :: ", item);
    const onSubmit = (values: any) => {
        let formData = new FormData();

        formData.append('name', values.name);
        formData.append('imagen', values.imagen);
        formData.append('intervencion', values.intervencion);

        console.log("FORM DATA values :: ", values);
        // close();

        api('/firmas/', 'POST', formData, true);

        if (profile.profile.firma) {
            toDataUrl(profile.profile.firma, (image: any) => {

                console.log(dataURLtoFile(image, 'signature-operator.jpg') as any);

                formData = new FormData();

                formData.append('nombre_operario', profile.name);
                formData.append(
                    'firma_operario',
                    dataURLtoFile(image, 'signature-operator.jpg') as any
                );

                api(`/intervenciones/${item.id}/`, 'PATCH', formData, true);
            });
        } else {
            formData = new FormData();

            formData.append('nombre_operario', profile.name);
            formData.append('firma_operario', values.firma_operario);

            api(`/intervenciones/${item.id}/`, 'PATCH', formData, true);
        }
    };

    useEffect(() => {
        if (getCookie(StoreKeys.Token)) {
            setProfile(getCookie(StoreKeys.Profile));
        }
    }, []);

    useEffect(() => {
        if (item) {
            setValues({
                ...values,
                intervencion: item.id
            });
        }
    }, [item]);

    useEffect(() => {
        if (state.data && !state.isLoading) {
            if (state.path.includes('/intervenciones/')) {
                api(`/intervenciones/${item.id}/send_pdf_intervencion/`, 'GET');
                close();
            }
        }
    }, [state]);

    return (
        <Formik
            enableReinitialize={true}
            initialValues={values}
            validationSchema={validations}
            validateOnBlur={true}
            onSubmit={onSubmit}
        >
            {({
                  values,
                  setFieldValue,
                  handleSubmit,
              }) => (
                <form onSubmit={handleSubmit} autoComplete="off">
                    <label className="block text-sm font-normal leading-6 text-black">
                        {t('common.label.operator-signature')}
                    </label>

                    {!profile?.profile?.firma ? (
                        <>
                            <label className="block mt-6 text-sm font-normal leading-6 text-black">
                                {t('common.label.operator-signature')}
                            </label>

                            <SignatureCanvas
                                penColor="black"
                                ref={operatorSetSignatureRef}
                                onEnd={() => {
                                    const signature: any =
                                        onEndSignature(operatorSignatureRef);

                                    if (signature) {
                                        setFieldValue(
                                            'firma_operario',
                                            signature
                                        );
                                    }
                                }}
                                canvasProps={{
                                    height: 200,
                                    width: 440,
                                    className:
                                        'w-full h-[200px] border border-gray-300'
                                }}
                            />
                        </>
                    ) : null}

                    <label className="block mt-6 text-sm font-normal leading-6 text-black">
                        {t('common.label.client-signature')}
                    </label>

                    <SignatureCanvas
                        penColor="black"
                        ref={clientSetSignatureRef}
                        onEnd={() => {
                            const signature: any =
                                onEndSignature(clientSignatureRef);


                            if (signature) {
                                setFieldValue('imagen', signature);
                            }
                        }}
                        canvasProps={{
                            height: 200,
                            width: 440,
                            className: 'w-full h-[200px] border border-gray-300'
                        }}
                    />

                    <Input
                        value={values.horas_reales}
                        label={t('common.form-label.name')}
                        type="text"
                        name="name"
                        placeholder={t('common.form-placeholder.name')}
                        onChange={(value) => setFieldValue('name', value.name)}
                    />

                    <FormFooter doSubmit={handleSubmit} close={cancel}/>
                </form>
            )}
        </Formik>
    );
};
