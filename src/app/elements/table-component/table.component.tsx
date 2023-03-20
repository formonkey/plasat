import {PencilIcon, TrashIcon} from '@heroicons/react/outline';
import {useTranslation} from 'react-i18next';
import {useEffect, useState} from 'react';
import {useHttpClient} from '../../shared/http-client';
import {toast} from 'react-toastify';
import {useDrawer} from '../../shared/drawer';
import {renderItem} from '../table-item';
import {useModal} from '../../shared/modals';
import {classNames} from '../../utils';
import {TableComponentTypes} from './';
import {PaginationComponent} from '../../shared/pagination';

export const TableComponent = ({
                                   path,
                                   refresh,
                                   Form,
                                   formTitle,
                                   columns,
                                   limit = 20,
                                   withPagination = true
                               }: TableComponentTypes) => {
    const {t} = useTranslation();
    const {api, state} = useHttpClient();
    const {open, close} = useDrawer();
    const {open: openModal, close: closeModal} = useModal();
    const [hover, setHover] = useState<number | null>(null);
    const [refreshPagination, setRefreshPagination] = useState<string | null>(null);

    const [data, setData] = useState<any[] | null>(null);

    const [page, setPage] = useState<number>(0);
    const [maxRecords, setMaxRecords] = useState<number>(0);

    useEffect(() => {
        api(`/${path}/?limit=${limit}&offset=${page}`, 'GET');
        setRefreshPagination(null)
    }, [refresh, page]);

    const handleEditAction = (item: any) => {
        open(
            formTitle,
            <Form item={item} close={handleClose} doDelete={handleDelete}/>
        );
    };

    const handleClose = () => {
        api(`/${path}/?limit=${limit}&offset=${page}`, 'GET');
        close();
    };

    const executeDelete = (id: number) => {
        api(`/${path}/${id}/`, 'DELETE');
        setTimeout(() => {
            api(`/${path}/?limit=${limit}&offset=${page}`, 'GET');
            close();
            closeModal();
            setRefreshPagination(Date.now().toString());
        }, 300);
    };

    const handleDelete = (item: any) => {
        openModal('error', {
            onAccept: () => executeDelete(item.id),
            title: t('foldable-card.modal.delete-title'),
            message: t('foldable-card.modal.delete-message')
        });
    };

    useEffect(() => {
        if (state.data) {
            if (state.path.includes(`/${path}/`)) {
                if (state.data.results) {
                    setData([...state.data.results]);
                    setMaxRecords(+state.data.count);
                }
            }
        }

        if (state.error) {
            if ("detail" in state.error.detail) {
                toast.error(state.error.detail.detail);
            } else {
                toast.error(state.error.detail);
            }
        }
    }, [state]);

    const renderHeader = (include?: string[]) =>
        columns ? columns.map((key, index) => {
                if (
                    !Array.isArray(data?.[0][key]) &&
                    (include ? include?.includes(key) : true)
                ) {
                    return (
                        <th
                            key={index}
                            scope="col"
                            className="py-3.5 px-3 text-left text-sm font-semibold text-gray-dark"
                        >
                            {t(!key.includes('.') ? key : key.split('.')[1])}
                        </th>
                    );
                }
            })
            : Object.keys(data?.[0]).map((key, index) => {
                if (
                    !Array.isArray(data?.[0][key]) &&
                    (include ? include?.includes(key) : true)
                ) {
                    return (
                        <th
                            key={index}
                            scope="col"
                            className="py-3.5 px-3 text-left text-sm font-semibold text-gray-dark"
                        >
                            {t(key)}
                        </th>
                    );
                }
            });

    return (
        <div className="mt-8 flex flex-col">
            <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                    <table className="min-w-full divide-y divide-gray">
                        <thead className="bg-gray-light">
                        <tr>
                            {!data ? (
                                <th className="py-3.5 px-3 text-left text-sm font-semibold text-gray-dark">
                                    {t('common.label.no-data')}
                                </th>
                            ) : data.length === 0 ? (
                                <th className="py-3.5 px-3 text-center text-sm font-semibold text-gray-dark">
                                    {t('common.label.no-data')}
                                </th>
                            ) : (
                                renderHeader(columns)
                            )}
                            <th
                                scope="col"
                                className="py-3.5 px-3 text-left text-sm font-semibold text-gray-dark"
                            >
                                {' '}
                            </th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-light">
                        {data?.map((item: any, index) => (
                            <tr
                                key={item?.id}
                                onMouseEnter={() => setHover(index)}
                                onMouseLeave={() => setHover(null)}
                                className={'hover:bg-gray-lighterest'}
                            >
                                {renderItem(item, columns)}

                                <td className="relative whitespace-nowrap py-2 pl-3 pr-4 text-right text-sm font-medium flex space-x-2 justify-end">
                                    <button
                                        className={
                                            'hover:bg-gray p-2 rounded-md'
                                        }
                                        onClick={() =>
                                            handleEditAction(item)
                                        }
                                    >
                                        <PencilIcon
                                            className={classNames(
                                                'h-5 w-5 ',
                                                hover == index
                                                    ? 'text-gray-dark hover:text-gray-darker'
                                                    : 'text-transparent'
                                            )}
                                        />
                                    </button>
                                    <button
                                        className={
                                            'hover:bg-gray p-2 rounded-md'
                                        }
                                        onClick={() => handleDelete(item)}
                                    >
                                        <TrashIcon
                                            className={classNames(
                                                'h-5 w-5 ',
                                                hover == index
                                                    ? 'text-gray-dark hover:text-gray-darker'
                                                    : 'text-transparent'
                                            )}
                                        />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    {withPagination && (
                        <PaginationComponent
                            doPage={(page: number) => setPage(page)}
                            limit={limit}
                            maxRecords={maxRecords}
                            reset={refreshPagination}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};
