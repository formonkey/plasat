import * as Yup from 'yup';

import React, {useEffect} from 'react';

import {Formik} from 'formik';
import {FormFooter} from '../../elements/form-footer';
import {Input} from '../../elements/input';
import {useTranslation} from 'react-i18next';
import {useHttpClient} from '../../shared/http-client';
import {toast} from "react-toastify";
import {FieldError} from "../../elements/field-error/field-error";

const rules = Yup.object().shape({
    password: Yup.string().required('obligatorio'),
    currentPassword: Yup.string().required('obligatorio'),
    repeatPassword: Yup.string().required('obligatorio')
});

export const ProfileBodyChangePassword = ({close}: any) => {
    const {t} = useTranslation();
    const {api, state} = useHttpClient();

    const onSubmit = (values: any) => {
        if (values.password === values.repeatPassword) {
            console.log('onSubmit', values);
            api('/users/update_password/', "PATCH", {
                new_password: values.password,
                old_password: values.currentPassword
            });
        } else {
            toast.error(t('passwords_not_match'));
        }
    };

    useEffect(() => {
        if (state.data && !state.isLoading) {
            close();
        }

        if (state.error) {
            if ("old_password" in state.error.detail) {
                toast.error(t(state.error.detail.old_password["0"]));
            } else {
                toast.error(t('error'));
            }
        }

    }, [state]);

    return (
        <Formik
            enableReinitialize={true}
            initialValues={{
                password: '',
                currentPassword: '',
                repeatPassword: ''
            }}
            validationSchema={rules}
            validateOnBlur={true}
            onSubmit={onSubmit}
        >
            {({
                  values,
                  errors,
                  touched,
                  setFieldValue,
                  handleSubmit,
              }) => (
                <form onSubmit={handleSubmit} autoComplete="off">
                    <Input
                        label={t('common.label.current-password')}
                        type="password"
                        placeholder={t('common.label.current-password')}
                        name="currentPassword"
                        value={values.currentPassword}
                        onChange={(value) =>
                            setFieldValue(
                                'currentPassword',
                                value.currentPassword
                            )
                        }
                    />
                    <FieldError touched={touched} errors={errors} field={"currentPassword"}/>

                    <Input
                        label={t('common.label.password')}
                        type="password"
                        placeholder={t('common.label.password')}
                        name="password"
                        value={values.password}
                        onChange={(value) =>
                            setFieldValue('password', value.password)
                        }
                    />
                    <FieldError touched={touched} errors={errors} field={"password"}/>

                    <Input
                        label={t('common.label.repeat-password')}
                        type="password"
                        placeholder={t('common.label.repeat-password')}
                        name="repeatPassword"
                        value={values.repeatPassword}
                        onChange={(value) =>
                            setFieldValue(
                                'repeatPassword',
                                value.repeatPassword
                            )
                        }
                    />
                    <FieldError touched={touched} errors={errors} field={"repeatPassword"}/>

                    <FormFooter doSubmit={handleSubmit} close={close}/>
                </form>
            )}
        </Formik>
    );
};
