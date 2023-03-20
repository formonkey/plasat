import { useTranslation } from 'react-i18next';

import { TrashIcon } from '@heroicons/react/outline';

import { noop } from '../../utils';
import { Button } from '../button';

export const FormFooter = ({
    item,
    close,
    doDelete,
    doSubmit,
    isSubmitting,
    hasClose = true
}: {
    item?: any;
    close: () => void;
    doSubmit: () => void;
    isSubmitting?: boolean;
    doDelete?: (item: any) => void;
    hasClose?: boolean;
}) => {
    const { t } = useTranslation();

    return (
        <div className="fixed w-full bottom-0 inset-x-0 bg-white">
            <div className="flex border-t border-gray-light py-4 justify-between items-center space-x-1 px-4 sm:px-6">
                <div className={'flex-1'}>
                    {item && doDelete && (
                        <Button
                            onClick={doDelete ? () => doDelete(item) : noop}
                            icon={
                                <TrashIcon
                                    className={'w-6 h-6 text-gray mr-2'}
                                />
                            }
                            label={t('common.button.delete')}
                            variant={'transparent'}
                        />
                    )}
                </div>
                {hasClose && (
                    <Button
                        onClick={() => close()}
                        label={t('common.button.cancel')}
                        outlined
                    />
                )}
                <Button
                    onClick={doSubmit}
                    disabled={isSubmitting}
                    label={t('common.button.save')}
                />
            </div>
        </div>
    );
};
