import { useTranslation } from 'react-i18next';
import { classNames } from '../../utils';
import { noop } from '../../utils';
import AsyncSelect from 'react-select/async';

export const SelectAsync = ({
    name,
    label,
    disabled,
    value = {},
    items = [],
    placeholder,
    onChange = noop,
    noMargin = false,
    optionsLabel = 'name',
}: {
    name: string;
    label?: string;
    optionsLabel?: string;
    noMargin?: boolean;
    disabled?: boolean;
    placeholder?: string;
    items: any;
    value?: { id?: number | string; name?: string } | any;
    onChange: (item: { [key: string]: number | string } | any) => void;
}) => {
    const { t } = useTranslation();

    return (
        <div className={classNames('w-full', noMargin ? 'mb-0' : 'mb-[24px]')}>
            <div className="block text-sm font-medium text-gray-700 mb-1">
                {t(label || '')}
            </div>
            <AsyncSelect
                name={name}
                placeholder={placeholder ? t(placeholder) : ''}
                isClearable
                isDisabled={disabled}
                getOptionLabel={(e: any) => e[optionsLabel]}
                getOptionValue={(e: any) => e.id}
                loadOptions={items}
                // onInputChange={onChange}
                value={value}
                onChange={onChange}
                theme={(theme) => ({
                    ...theme,
                    borderRadius: 0
                })}
            />
        </div>
    );
};
