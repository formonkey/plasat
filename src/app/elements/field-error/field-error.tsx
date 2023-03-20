import { useTranslation } from 'react-i18next';

export const FieldError = ({
    touched,
    errors,
    field
}: {
    touched: any;
    errors: any;
    field: string;
}) => {
    const { t } = useTranslation();

    // console.log('touched', touched);
    // console.log('errors', errors);
    // console.log('field', field);

    return (
        // touched[field] &&
        errors[field] && (
            <div
                className="w-full border-t-2 py-1 border-red-600 text-red-600 font-regular text-[9px] text-right mt-[-24px] "
                id="feedback"
            >
                {t(errors?.[field] as any)}
            </div>
        )
    );
};
