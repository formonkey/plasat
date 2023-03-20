import {Dialog} from '@headlessui/react';
import {CheckIcon} from '@heroicons/react/outline';
import {useTranslation} from 'react-i18next';
import {useRef} from "react";

export const ModalConfirmation = ({
                                      close,
                                      config
                                  }: {
    close: () => void;
    config: { title: string; message?: string; onAccept?: () => void };
}) => {
    const {t} = useTranslation();
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    return (
        <>
            <div>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                    <CheckIcon
                        className="h-6 w-6 text-green-600"
                        aria-hidden="true"
                    />
                </div>
                <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title
                        as="h3"
                        className="text-lg leading-6 font-medium text-gray-900"
                    >
                        {config.title}
                    </Dialog.Title>
                    <div className="mt-2">
                        <p className="text-sm text-gray-500">
                            {config.message}
                        </p>
                    </div>
                </div>
            </div>
            <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                    ref={closeButtonRef}
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark sm:col-start-2 sm:text-sm"
                    onClick={() => {
                        // @ts-ignore
                        closeButtonRef.current.disabled = true;
                        config.onAccept?.();
                    }}
                >
                    {t('common.button.accept')}
                </button>
                <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark sm:mt-0 sm:col-start-1 sm:text-sm"
                    onClick={close}
                >
                    {t('common.button.cancel')}
                </button>
            </div>
        </>
    );
};
