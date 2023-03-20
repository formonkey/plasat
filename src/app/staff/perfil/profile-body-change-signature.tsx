import * as Yup from 'yup';

import React, {useEffect, useState} from 'react';

import {Formik} from 'formik';
import {FormFooter} from '../../elements/form-footer';
import SignatureCanvas from 'react-signature-canvas';
import {useTranslation} from 'react-i18next';
import {dataURLtoFile} from '../home/constants';
import {useHttpClient} from '../../shared/http-client';
import {useCookies} from '../../shared/cookies';
import {StoreKeys} from "../../shared/store";

const rules = Yup.object().shape({});

export const ProfileBodyChangeSignature = ({item, close}: any) => {
    const {t} = useTranslation();
    const {api, state} = useHttpClient();
    const [signatureRef, setSignatureRef] = useState<any>({});
    const [showCurrentSignature, setShowCurrentSignature] = useState<boolean>(
        !!item?.profile?.firma
    );
    const {get: getCookie, set: setCookie} = useCookies();

    console.log('item', item);

    const onEndSignature = () =>
        dataURLtoFile(signatureRef.toDataURL(), 'signature-operator.jpg');

    const onSubmit = (values: any) => {
        const formData = new FormData();

        console.log('values', values);

        if (values.firma) {
            formData.append('firma', values.firma);
            api(`/perfiles/${item.profile.id}/`, 'PATCH', formData, true);

        } else {
            api(`/perfiles/${item.profile.id}/`, 'PATCH', {firma: null});
        }
    };

    useEffect(() => {
        if (state.data && !state.isLoading) {
            let profile = getCookie(StoreKeys.Profile)
            profile = {...profile, profile: state.data}
            setCookie(StoreKeys.Profile, profile, `.${process.env.REACT_APP_DOMAIN}`);
            close();
        }
    }, [state]);

    return (
        <Formik
            enableReinitialize={true}
            initialValues={{
                firma: null
            }}
            validationSchema={rules}
            validateOnBlur={true}
            onSubmit={onSubmit}
        >
            {({
                  setFieldValue,
                  handleSubmit,
              }) => (
                <form onSubmit={handleSubmit} autoComplete="off">
                    <div className="flex justify-between">
                        <label className="mb-2 block text-sm font-normal leading-6 text-black">
                            {t('profile.label.signature-operator')}
                        </label>

                        {showCurrentSignature ? (
                            <div
                                className="flex text-[#001878]"
                                onClick={() => setShowCurrentSignature(false)}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-[22px] h-[22px] mr-2"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                    />
                                </svg>

                                <span className="text-sm font-normal leading-6 text-black">
                                    {t('common.label.trash')}
                                </span>
                            </div>
                        ) : null}
                    </div>

                    {showCurrentSignature ? (
                        <div className="w-full h-[200px] border border-gray-300">
                            <img
                                src={item.profile.firma}
                                alt={item.profile.firma}
                            />
                        </div>
                    ) : (
                        <SignatureCanvas
                            penColor="black"
                            ref={setSignatureRef}
                            onEnd={() => {
                                const signature: any = onEndSignature();

                                if (signature) {
                                    setFieldValue('firma', signature);
                                }
                            }}
                            canvasProps={{
                                height: 200,
                                width: 440,
                                className:
                                    'w-full h-[200px] border border-gray-300'
                            }}
                        />
                    )}

                    {showCurrentSignature ? null : (
                        <FormFooter doSubmit={handleSubmit} close={close}/>
                    )}
                </form>
            )}
        </Formik>
    );
};
