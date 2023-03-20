import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const UpdateSuccess = () => {
    const { t } = useTranslation();

    return (
        <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
                <div className="bg-white py-8 px-4 sm:rounded-lg sm:px-10">
                    <div className="space-y-8">
                        <div>
                            <Link to="/login">
                                <span>{'< '}</span>
                                <span>{t('login.button.home')}</span>
                            </Link>
                        </div>

                        <div className="sm:mx-auto sm:w-full sm:max-w-md">
                            <h3
                                className={
                                    'font-bold mb-2 text-principal text-3xl'
                                }
                            >
                                {t('login.text.update.success.title')}
                            </h3>
                        </div>

                        <div className={''}>
                            {t('login.text.update.success.explanation')}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
