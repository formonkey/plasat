import {useEffect, useState} from 'react';

import {toast} from 'react-toastify';
import {useTranslation} from 'react-i18next';
import {EyeIcon, PencilIcon, TrashIcon} from '@heroicons/react/outline';

import {classNames, noop} from '../../utils';
import {Button} from '../button';
import {useDrawer} from '../../shared/drawer';
import {AddTree} from '../../../assets/icons/AddTree';
import {useHttpClient} from '../../shared/http-client';
import {useModal} from '../../shared/modals';
import {PaginationComponent} from '../../shared/pagination';
import {renderTableItem} from '../table-item/table-item.element';

export const Table = ({
                          Form,
                          FormAdd,
                          path,
                          deletePath = noop(),
                          query = '',
                          onShow,
                          headers,
                          parent = {},
                          buttonLabel,
                          setCount = noop,
                          parentData,
                          isParentData,
                          limit = 20,
                          noAction = false,
                          withPagination = false,
                          callBeforeDrawerClosed = noop,
                          compressed = false,
                          onDelete = noop,
                          refresh
                      }: any) => {
    const {t} = useTranslation();
    const {api, state} = useHttpClient();
    const [hover, setHover] = useState<number | null>(null);
    const [data, setData] = useState<any[]>([]);
    const {open: openModal, close: closeModal} = useModal();
    const {open: openDrawer, close: closeDrawer} = useDrawer();

    const [page, setPage] = useState<number>(0);
    const [maxRecords, setMaxRecords] = useState<number>(0);
    const [refreshPagination, setRefreshPagination] = useState<string | null>(null);


    // console.log("* PARENT DATA *", parentData);

    const request = () => {
        if (path) {
            let endpoint = `${path}/?${query}${
                withPagination
                    ? `${query ? '&' : ''}limit=${limit}&offset=${page}`
                    : ''
            }`;

            Object.keys(parent).forEach((key: string) => {
                const regex = new RegExp(`:${key}`, 'g');

                endpoint = endpoint.replace(regex, parent[key]);
            });

            // console.log("TABLE ENDPOINT :: ", endpoint);

            api(endpoint, 'GET');
        }
    };

    const handleClose = () => {
        request();
        callBeforeDrawerClosed();

        setTimeout(() => {
            closeDrawer();
        }, 200);
    };

    const handleEditAction = (item: any) => {
        openDrawer(
            'common.form-title.edit-item',
            <Form item={item} close={handleClose}/>
        );
    };

    const handleNewOperationAction = () => {
        if (FormAdd) {
            openDrawer(
                'common.form-title.new-item',
                <FormAdd close={handleClose}/>
            );
        } else {
            openDrawer(
                'common.form-title.new-item',
                <Form close={handleClose}/>
            );
        }
    };

    const handleDelete = (item: any) => {
        openModal('error', {
            title: 'common.modal.delete',
            message: 'common.modal.validate-delete',
            onAccept: () => {
                api(`${deletePath ? deletePath : path}/${item.id}/`, 'DELETE');
                setData([
                    ...data.filter(
                        (element: { id: number }) => element.id !== item.id
                    )
                ]);

                setCount(data.length - 1);
                setPage(0);
                setRefreshPagination(Date.now().toString());
                setTimeout(() => {
                    closeModal();
                    setRefreshPagination(null);
                    onDelete(null)
                    callBeforeDrawerClosed();
                }, 500);
            }
        });
    };

    useEffect(() => {

        if (!isParentData && query) {
            request();
            if (typeof query !== "string" && Array.from(query.values()).length > 0 && query !== '') {
                setRefreshPagination(Date.now().toString());
            } else {
                setTimeout(() => {
                    setPage(0);
                    setRefreshPagination(Date.now().toString());
                }, 500);
            }
        } else {
            setRefreshPagination(null);
        }
    }, [query]);

    useEffect(() => {
        if (parentData && Object.keys(parentData).length > 0) {
            setData([...parentData]);
        }
    }, [parentData]);

    useEffect(() => {
        if (!isParentData) {
            request();
        } else if (parentData) {
            setData([...parentData]);
        }
    }, [refresh]);

    useEffect(() => {
        if (state.data && state.data.results) {
            setData(state.data.results);
            setCount(state.data.results.length);
            setMaxRecords(state.data.count);
        }

        if (state.error) {
            toast.error(state.error.detail);
        }
    }, [state]);

    useEffect(() => {
        if (!isParentData) {
            request();
        }
    }, [page]);

    return (
        <div className="flex flex-col mb-3 w-full">
            <div className="overflow-x-auto">
                <table className="w-full max-w-full">
                    <thead>
                    <tr className="bg-gray-200 rounded-[4px] h-[32px]">
                        {headers.map((header: any, index: number) => (
                            <th
                                key={index}
                                scope="col"
                                style={{width: header.width || 'auto'}}
                                className="py-3.5 pl-4 pr-3 text-left bg-transparent text-gray-darker sm:pl-6 not-italic font-light text-xs leading-6"
                            >
                                {t(header.label)}
                            </th>
                        ))}

                        {!noAction && (
                            <th
                                scope="col"
                                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                            >
                                {' '}
                            </th>
                        )}
                    </tr>
                    </thead>
                    {data.length ? (
                        <tbody className="divide-y divide-gray-200 bg-white">
                        {/*render totals*/}
                        <tr>
                            {headers.map((header: any, index: number) => (
                                <td
                                    key={index}
                                    className={
                                        'py-3.5 pl-4 pr-3 text-left font-bold text-xl'
                                    }
                                >
                                    {header.totalTitle
                                        ? t(header['totalTitle'])
                                        : header.total
                                            ? header['type'] === 'decimal'
                                                ? (
                                                    header.totalValue ||
                                                    data.reduce(
                                                        (
                                                            acc: number,
                                                            item: any
                                                        ) =>
                                                            acc +
                                                            item[header.key],
                                                        0
                                                    )
                                                ).toFixed(2) +
                                                ' ' +
                                                header['totalSuffix']
                                                : header['type'] === 'currency'
                                                    ? (
                                                        header.totalValue ||
                                                        data.reduce(
                                                            (
                                                                acc: number,
                                                                item: any
                                                            ) =>
                                                                acc +
                                                                item[header.key],
                                                            0
                                                        )
                                                    )
                                                        .toFixed(2)
                                                        .replace(
                                                            /\d(?=(\d{3})+\.)/g,
                                                            '$&,'
                                                        ) +
                                                    ` ${
                                                        (header as any)
                                                            ?.totalSuffix || '€'
                                                    }`
                                                    : (header.totalValue ||
                                                        data.reduce(
                                                            (
                                                                acc: number,
                                                                item: any
                                                            ) =>
                                                                acc +
                                                                item[header.key],
                                                            0
                                                        )) +
                                                    ' ' +
                                                    header['totalSuffix']
                                            : ''}
                                </td>
                            ))}
                        </tr>
                        {/*render totals*/}

                        {data.map((item, index) => (
                            <tr
                                key={index}
                                onMouseEnter={() => setHover(index)}
                                onMouseLeave={() => setHover(null)}
                                className="hover:bg-gray-lighterest"
                            >
                                {renderTableItem(
                                    item,
                                    headers,
                                    'py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6'
                                )}

                                {!noAction && (
                                    <td
                                        className={classNames(
                                            compressed ? 'py-1' : 'py-4',
                                            'relative whitespace-nowrap pl-3 pr-4 text-right text-sm font-medium sm:pr-6 z-10'
                                        )}
                                    >
                                        {
                                            <>
                                                {onShow && (
                                                    <button
                                                        className="p-2 rounded-md"
                                                        onClick={
                                                            hover === index
                                                                ? () =>
                                                                    onShow(
                                                                        item
                                                                    )
                                                                : noop
                                                        }
                                                    >
                                                        <EyeIcon
                                                            className={classNames(
                                                                'h-5 w-5 ',
                                                                hover ===
                                                                index
                                                                    ? 'text-gray-dark hover:text-gray-darker'
                                                                    : 'text-transparent'
                                                            )}
                                                        />
                                                    </button>
                                                )}
                                                <button
                                                    className="p-2 rounded-md"
                                                    onClick={
                                                        hover === index
                                                            ? () =>
                                                                handleEditAction(
                                                                    item
                                                                )
                                                            : noop
                                                    }
                                                >
                                                    <PencilIcon
                                                        className={classNames(
                                                            'h-5 w-5 ',
                                                            hover === index
                                                                ? 'text-gray-dark hover:text-gray-darker'
                                                                : 'text-transparent'
                                                        )}
                                                    />
                                                </button>
                                                <button
                                                    className="p-2 rounded-md"
                                                    onClick={
                                                        hover === index
                                                            ? () =>
                                                                handleDelete(
                                                                    item
                                                                )
                                                            : noop
                                                    }
                                                >
                                                    <TrashIcon
                                                        className={classNames(
                                                            'h-5 w-5 ',
                                                            hover === index
                                                                ? 'text-gray-dark hover:text-gray-darker'
                                                                : 'text-transparent'
                                                        )}
                                                    />
                                                </button>
                                            </>
                                        }
                                    </td>
                                )}
                            </tr>
                        ))}
                        </tbody>
                    ) : (
                        <tbody className="">
                        <tr>
                            <td
                                colSpan={headers.length + 1}
                                className="text-center pt-4"
                            >
                                    <span className="not-italic font-light text-sm leading-6 text-gray-darker">
                                        {t('common.message.no-data')}
                                    </span>
                            </td>
                        </tr>
                        </tbody>
                    )}
                </table>

                {withPagination && (
                    <PaginationComponent
                        doPage={(page: number) => setPage(page)}
                        limit={limit}
                        maxRecords={maxRecords}
                        reset={refreshPagination}
                    />
                )}

                {buttonLabel && (
                    <div className="mt-[8px]">
                        <Button
                            variant="secondary"
                            icon={<AddTree/>}
                            disabled={!parent?.id}
                            label={t(buttonLabel)}
                            onClick={handleNewOperationAction}
                        />
                    </div>
                )}
                {/*</div>*/}
            </div>
        </div>
    );
};
