/* This example requires Tailwind CSS v2.0+ */
import { useState, useEffect } from 'react';

import { Switch } from '@headlessui/react';
import { useTranslation } from 'react-i18next';

import { classNames } from '../../utils';

export const Toggle = ({
    name,
    label,
    sublabel = '',
    onChange,
    noMargin,
    size = 'md',
    value = false,
    hasInfo = false
}: {
    name?: string;
    label?: string;
    sublabel?: string;
    value?: boolean;
    hasInfo?: boolean;
    size?: 'sm' | 'md';
    noMargin?: boolean;
    onChange: (item: { [key: string]: boolean }) => void;
}) => {
    const { t } = useTranslation();
    const [enabled, setEnabled] = useState(value);

    useEffect(() => {
        if (name) {
            onChange({ [name]: enabled });
        } else {
            onChange({ toggle: enabled });
        }
    }, [enabled]);

    useEffect(() => {
        setEnabled(value);
    }, [value]);

    return (
        <div
            className={classNames(
                'flex w-full',
                label ? 'justify-between' : '',
                noMargin ? 'mb-0' : 'mb-[24px]'
            )}
        >
            <div className={'flex flex-col justify-start items-start'}>
                <label className="not-italic font-medium text-sm leading-6">
                    {t(label || '')}
                </label>
                {sublabel !== '' && (
                    <label className="not-italic text-xs leading-1">
                        {t(sublabel || '')}
                    </label>
                )}
            </div>

            <div
                className={classNames(
                    hasInfo ? 'flex items-center space-x-[8px]' : ''
                )}
            >
                {hasInfo && (
                    <span className="not-italic font-light text-xs mt-[2px] leading-4 text-gray-darker">
                        {t('common.label.no')}
                    </span>
                )}
                <Switch
                    checked={enabled}
                    onChange={setEnabled}
                    className={classNames(
                        enabled ? 'bg-primary' : 'bg-gray',
                        size === 'md' ? 'h-6 w-11' : 'h-5 w-9 mt-[3px]',
                        'relative inline-flex flex-shrink-0 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-transparent outline-0'
                    )}
                >
                    <span
                        aria-hidden="true"
                        className={classNames(
                            enabled
                                ? size === 'md'
                                    ? 'translate-x-5'
                                    : 'translate-x-4'
                                : 'translate-x-0',
                            size === 'md' ? 'h-5 w-5' : 'h-4 w-4',
                            'pointer-events-none inline-block rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
                        )}
                    />
                </Switch>
                {hasInfo && (
                    <span className="not-italic font-light mt-[3px] text-xs leading-4">
                        {t('common.label.yes')}
                    </span>
                )}
            </div>
        </div>
    );
};
