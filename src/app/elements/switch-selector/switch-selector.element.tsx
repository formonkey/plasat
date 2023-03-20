import { useState, useEffect } from 'react';

import { Toggle } from '../toggle';
import { Select } from '../select';
import { t } from 'i18next';

export const SwitchSelector = ({
    label,
    items,
    selectName,
    toggleName,
    selectValue,
    toggleValue,
    selectOnChange,
    toggleOnchange
}: {
    label: string;
    selectName: string;
    toggleName: string;
    toggleValue: boolean;
    items: { id: number; name: string }[];
    selectValue: { id: number; name: string };
    selectOnChange: (item: { [key: string]: number }) => void;
    toggleOnchange: (item: { [key: string]: boolean }) => void;
}) => {
    const [value, setValue] = useState(selectValue);
    const [enabled, setEnabled] = useState<boolean>(toggleValue);

    useEffect(() => {
        setEnabled(toggleValue);
    }, [toggleValue]);

    useEffect(() => {
        setValue(selectValue);
    }, [selectValue]);

    useEffect(() => {
        if (enabled !== toggleValue) {
            toggleOnchange({ [toggleName]: enabled });
        }
    }, [enabled]);

    useEffect(() => {
        if (value?.id !== selectValue?.id) {
            selectOnChange({ [selectName]: value?.id });
        }
    }, [value]);

    return (
        <div className="flex flex-col items-start p-[12px] w-full h-auto rounded space-y-[20px] bg-gray-lighter mb-[24px]">
            <Toggle
                hasInfo
                noMargin
                size="sm"
                value={enabled}
                name={toggleName}
                label={label}
                onChange={(item) => setEnabled(item[toggleName])}
            />
            {enabled && (
                <Select
                    noMargin
                    name={selectName}
                    placeholder={t('common.placeholder.select-value')}
                    onChange={console.log}
                    value={value}
                    items={items}
                />
            )}
        </div>
    );
};
