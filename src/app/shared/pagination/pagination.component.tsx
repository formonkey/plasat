import {
    ChevronDoubleLeftIcon,
    ChevronDoubleRightIcon,
    ChevronLeftIcon,
    ChevronRightIcon
} from '@heroicons/react/outline';
import { usePagination } from './hooks';
import { useTranslation } from 'react-i18next';
import { noop } from '../../utils';
import { useEffect } from 'react';

export const PaginationComponent = ({
    doPage = () => noop(),
    limit = 20,
    maxRecords = 0,
    reset = noop()
}: {
    doPage: (page: number) => void;
    limit?: number;
    maxRecords?: number;
    reset?: string | null;
}) => {
    const { t } = useTranslation();
    const { page, next, prev, last, first, setLimit, setMaxRecords } =
        usePagination();

    useEffect(() => {

        // console.log("RESET PAGINATION :: ", reset);

        doPage(page);
        setLimit(limit);
        setMaxRecords(maxRecords);
        if (reset) {
            first();
        }
    }, [page, limit, reset, maxRecords]);

    return (
        <div
            className={
                'flex flex-1 justify-center items-center mt-8 space-x-2 py-4 rounded-md border-t border-t-gray-300 bg-white'
            }
        >
            <button
                className={'hover:bg-gray p-2 rounded-md disabled:opacity-10'}
                onClick={() => first()}
                disabled={page === 0}
            >
                <ChevronDoubleLeftIcon className={'h-4 w-4'} />
            </button>
            <button
                className={'hover:bg-gray p-2 rounded-md disabled:opacity-10'}
                onClick={() => prev()}
                disabled={page === 0}
            >
                <ChevronLeftIcon className={'h-4 w-4'} />
            </button>

            <div className={'text-xs text-gray-darker'}>{`${t(
                'common.label.page'
            )} ${+page / +limit + 1} ${t('common.label.de')} ${
                +page / limit > Math.ceil(maxRecords / limit) - 1
                    ? '1'
                    : Math.ceil(maxRecords / limit)
            }`}</div>
            <button
                className={'hover:bg-gray p-2 rounded-md disabled:opacity-10'}
                onClick={() => next()}
                disabled={+page / limit >= Math.ceil(maxRecords / limit) - 1}
            >
                <ChevronRightIcon className={'h-4 w-4'} />
            </button>
            <button
                className={'hover:bg-gray p-2 rounded-md disabled:opacity-10'}
                onClick={() => last()}
                disabled={+page / limit + 1 >= Math.ceil(maxRecords / limit)}
            >
                <ChevronDoubleRightIcon className={'h-4 w-4'} />
            </button>
        </div>
    );
};
