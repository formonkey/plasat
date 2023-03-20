import { Fragment, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { XIcon } from '@heroicons/react/outline';
import { Dialog, Transition } from '@headlessui/react';

import { DrawerProvider } from './contexts';
import { noop } from '../../utils';

export const Drawer = ({ children }: { children: JSX.Element }) => {
    const { t } = useTranslation();
    const [title, setTitle] = useState<string>('');
    const [open, setOpen] = useState<boolean>(false);
    const [component, setComponent] = useState<JSX.Element | null>(null);
    const [hasInternalClose, setHasInternalClose] = useState<boolean>(true);
    const [size, setSize] = useState<string>('lg');

    const onOpen = (
        title: string,
        Component: JSX.Element,
        hasClose: boolean = true,
        size: string = 'lg'
    ) => {
        setTitle(title);
        setComponent(Component);
        setHasInternalClose(hasClose);
        setSize(size);

        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);

        setTimeout(() => {
            setTitle('');
            setComponent(null);
        }, 300);
    };

    return (
        <DrawerProvider value={{ open: onOpen, close: onClose }}>
            {children}

            <Transition.Root show={open} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-10"
                    onClose={noop}
                >
                    <Transition.Child
                        as={Fragment}
                        enter="ease-in-out duration-500"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in-out duration-500"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-hidden">
                        <div className="absolute inset-0 overflow-hidden">
                            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                                <Transition.Child
                                    as={Fragment}
                                    enter="transform transition ease-in-out duration-500 sm:duration-500"
                                    enterFrom="translate-x-full"
                                    enterTo="translate-x-0"
                                    leave="transform transition ease-in-out duration-500 sm:duration-500"
                                    leaveFrom="translate-x-0"
                                    leaveTo="translate-x-full"
                                >
                                    <Dialog.Panel
                                        className={`pointer-events-auto w-screen max-w-${size}`}
                                    >
                                        <div className="flex h-full flex-col overflow-y-scroll bg-white pb-0 shadow-xl">
                                            <div className="px-4 sm:px-6 flex items-center justify-between bg-gray-light h-[56px]">
                                                <Dialog.Title className="text-lg font-medium text-gray-900">
                                                    {t(title)}
                                                </Dialog.Title>
                                                <div className="ml-3 flex h-7 items-center">
                                                    {hasInternalClose && (
                                                        <button
                                                            type="button"
                                                            className="text-black hover:text-black focus:outline-none focus:ring-2 focus:ring-transparent"
                                                            onClick={() =>
                                                                setOpen(false)
                                                            }
                                                        >
                                                            <XIcon
                                                                className="h-6 w-6"
                                                                aria-hidden="true"
                                                            />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="relative mt-6 flex-1 px-4 sm:px-6">
                                                <div className="absolute inset-0 px-4 sm:px-6">
                                                    {component}
                                                </div>
                                            </div>
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
        </DrawerProvider>
    );
};
