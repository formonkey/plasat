import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const RegistroSuccess = () => {
    const { t } = useTranslation();

    return (
            <div className="min-h-full flex flex-col justify-center py-12 px-2 sm:px-6 lg:px-8 bg-[#ebefff] w-full">
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
                <div className="py-8 px-4 sm:rounded-lg sm:px-10">
                    <div className="space-y-8">
                        <div className="sm:mx-auto sm:w-full sm:max-w-md">
                            <img
                                className="h-32"
                                src="/logo.svg"
                                alt="Workflow"
                            />
                        </div>

                        <div className="sm:mx-auto sm:w-full sm:max-w-md">
                            <h3
                                className={
                                    'font-bold mb-2 text-logo text-3xl'
                                }
                            >
                                {t('registro.success.title')}
                            </h3>
                        </div>

                        <div>
                            <Link to="/login">
                                <span className={"text-gray-700"}>{'< '}</span>
                                <span className={"text-gray-700"}>{t('registro.success.home')}</span>
                            </Link>
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
