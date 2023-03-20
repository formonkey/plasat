import { useTranslation } from 'react-i18next';

import { classNames, noop } from '../../utils';
import { FileInput } from 'flowbite-react';

export const FileInputElement = ({
                                     name,
                                     label,
                                     accept = 'image/png, image/jpeg',
                                     forceWidth,
                                     onChange = noop
                                 }: {
    name: string;
    label?: string;
    accept?: string;
    forceWidth?: number;
    onChange?: (item: { [key: string]: string | number }) => void;
}) => {
    const { t } = useTranslation();

    const handleChange = (e: { target: { files: any } }) => {
        onChange({ [name]: e.target.files });
    };

    return (
        <div
            className={`'w-full  mb-[24px]'}`}
            style={{ width: forceWidth ? `${forceWidth}ch` : '100%' }}
        >
            {label && (
                <label
                    htmlFor={`${name}`}
                    className="block text-sm font-normal leading-6 text-black"
                >
                    {t(label)}
                </label>
            )}
            <div
                className={classNames(
                    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-transparent outline-0',
                    'mt-1 relative border border-gray-dark shadow-sm'
                )}
            >
                <FileInput onChange={handleChange} accept={accept} />
            </div>
        </div>
    );
};
