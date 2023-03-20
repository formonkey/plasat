/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useState } from 'react';

import { Dialog, Transition } from '@headlessui/react';

import { ModalProvider } from './contexts';
import { ModalError, ModalConfirmation } from './components';

export const Modal = ({ children }: { children: JSX.Element }) => {
    const [open, setOpen] = useState(false);
    const [component, setComponent] = useState<JSX.Element | null>(null);
    const [type, setType] = useState<'error' | 'info' | 'custom' | null>(null);

    const [config, setConfig] = useState<{
        title: string;
        message?: string;
        onAccept?: () => void;
    }>({ title: '' });

    const onOpen = (
        type: 'error' | 'info' | 'custom',
        config: { title: string; message?: string },
        component: JSX.Element | null = null
    ) => {
        if (type === 'custom') {
            if (!component) {
                throw new Error('Custom modal requires component');
            }

            setComponent(component);
        }

        setType(type);
        setConfig(config);

        setTimeout(() => {
            setOpen(true);
        }, 300);
    };

    const onClose = () => {
        setOpen(false);

        setTimeout(() => {
            setType(null);
            setComponent(null);
            setConfig({ title: '' });
        }, 300);
    };

    return (
        <ModalProvider value={{ open: onOpen, close: onClose }}>
            {children}

            <Transition.Root show={open} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={setOpen}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    <div className="fixed z-10 inset-0 overflow-y-auto">
                        <div className="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                enterTo="opacity-100 translate-y-0 sm:scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            >
                                <Dialog.Panel className="relative bg-white rounded-md px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full sm:p-6">
                                    {type === 'custom' ? (
                                        component
                                    ) : type === 'error' ? (
                                        <ModalError
                                            config={config}
                                            close={onClose}
                                        />
                                    ) : type === 'info' ? (
                                        <ModalConfirmation
                                            config={config}
                                            close={onClose}
                                        />
                                    ) : null}
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
        </ModalProvider>
    );
};
