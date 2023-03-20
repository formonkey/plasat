import React, { Fragment } from 'react';
import { PageHeaderTypes } from './types';
import { useTranslation } from 'react-i18next';
import {
    CogIcon,
    FilterIcon,
    InformationCircleIcon,
    PlusIcon
} from '@heroicons/react/outline';
import { Popover, Transition } from '@headlessui/react';
import { Button } from '../button';

export const PageHeader = ({
    title,
    filterAction,
    filters,
    infoText,
    hasInfo = false,
    newAction,
    newActionTitle,
    secondaryAction,
    secondaryActionTitle,
    exportAction,
    exportStatus,
    exportActionTitle,
}: PageHeaderTypes) => {
    const { t } = useTranslation();

    return (
        <div className="mx-auto px-4 sm:px-6 md:px-8 flex space-x-2">
            <div className="text-4xl font-bold text-gray-900 flex flex-1 justify-start items-start">
                <h1 className="text-4xl font-bold text-gray-900">
                    {t(title)}
                </h1>
                {hasInfo && (
                    <Popover className="relative flex items-start">
                        {({ open }) => (
                            <>
                                <Popover.Button
                                    className={`
                                    ${open ? '' : 'text-opacity-90'}
                                    group inline-flex items-center bg-red ring-0 ring-transparent outline-0`}
                                >
                                    <InformationCircleIcon className="h-[18px] mt-[10px] w-[18px] text-gray-800 mx-2" />
                                </Popover.Button>
                                <Transition
                                    as={Fragment}
                                    enter="transition ease-out duration-200"
                                    enterFrom="opacity-0 translate-y-1"
                                    enterTo="opacity-100 translate-y-0"
                                    leave="transition ease-in duration-150"
                                    leaveFrom="opacity-100 translate-y-0"
                                    leaveTo="opacity-0 translate-y-1"
                                >
                                    <Popover.Panel className="absolute top-8 left-1/2 z-10 w-screen max-w-xs transform px-4 sm:px-0 lg:max-w-md">
                                        <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                                            <div className="relative bg-white p-7 leading-[0.5]">
                                                <span className="text-sm font-medium text-gray-900">
                                                    {t(infoText ?? '')}
                                                </span>
                                            </div>
                                        </div>
                                    </Popover.Panel>
                                </Transition>
                            </>
                        )}
                    </Popover>
                )}
            </div>

            <div className="space-x-[16px]">
                {filterAction && (
                    <Button
                        variant={`${
                            filters && Object.keys(filters).length === 0
                                ? 'gray'
                                : 'gray-light'
                        }`}
                        onClick={() => filterAction()}
                        icon={
                            <FilterIcon className="h-5 w-5 text-black mx-2" />
                        }
                    />
                )}
                {secondaryAction && (
                    <Button
                        onClick={secondaryAction}
                        label={t(secondaryActionTitle ?? '')}
                        icon={<PlusIcon className="h-5 w-5 text-white mx-2" />}
                    />
                )}
                {newAction && (
                    <Button
                        onClick={newAction}
                        label={t(newActionTitle ?? '')}
                        icon={<PlusIcon className="h-5 w-5 text-white mx-2" />}
                    />
                )}
                {exportAction && (
                    <Button
                        onClick={exportAction}
                        label={t(exportActionTitle ?? '')}
                        icon={exportStatus ?  <CogIcon className="animate-spin h-5 w-5 text-white mx-2" /> : <PlusIcon className="h-5 w-5 text-white mx-2" />}
                    />
                )}
            </div>
        </div>
    );
};
