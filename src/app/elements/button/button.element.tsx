import {classNames, noop} from '../../utils';
import {useTranslation} from 'react-i18next';

export const Button = ({
                           icon,
                           label,
                           outlined,
                           disabled,
                           onClick = noop,
                           type = 'button',
                           variant = 'primary'
                       }: {
    label?: string;
    icon?: JSX.Element;
    outlined?: boolean;
    onClick: () => any;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
    variant?: 'primary' | 'gray' | 'gray-light' | 'transparent' | 'secondary';
}) => {
    const {t} = useTranslation();

    return (
        <button
            type={type}
            onClick={!disabled ? onClick : noop}
            className={classNames(
                'inline-flex justify-center items-center border h-[32px] text-sm leading-4 font-medium rounded-[4px]',
                icon && label ? 'px-4' : '',
                icon ? '' : 'px-3 py-2',
                outlined
                    ? ' border-gray-300 shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-transparent'
                    : 'border-transparent shadow-sm ',
                !outlined && variant === 'primary'
                    ? 'text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-transparent'
                    : !outlined && variant === 'gray'
                        ? 'text-black bg-gray hover:bg-gray-darker focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-transparent'
                        : !outlined && variant === 'gray-light'
                            ? 'text-black-dark bg-gray-100 hover:bg-gray-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-transparent'
                            : !outlined && variant === 'secondary'
                                ? 'text-black-dark bg-secondary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary'
                                : '',
                disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
            )}
        >
            {icon && (
                <div className={classNames(label ? 'mr-1' : '')}>{icon}</div>
            )}
            {t(label || '')}
        </button>
    );
};
