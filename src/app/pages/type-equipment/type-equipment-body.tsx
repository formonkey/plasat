import {useEffect, useState} from 'react';

import {toast} from 'react-toastify';

import {useHttpClient} from '../../shared/http-client';
import {Table} from '../../elements/table';
import {FoldableCard} from '../../elements/foldable-card';
import {useTranslation} from 'react-i18next';
import {TypeEquipmentOperationForm} from './type-equipment-operation-form';
import {TypeEquipmentForm} from "./type-equipment-form";

export const TypeEquipmentBody = ({
                                      newData,
                                      path = '/tipos-equipo',
                                      close,
                                  }: {
    path?: string;
    newData?: boolean;
    close: () => void;
}) => {
    const {t} = useTranslation();
    const {api, state} = useHttpClient();
    const [data, setData] = useState<any[]>([]);
    const [count, setCount] = useState<{ [key: string]: number }>({});

    const handleSave = (id: number, item: any) => {
        if (id) {
            api(`${path}${id}/`, 'PATCH', item);
        } else {
            api(`${path}`, 'POST', item);
        }
    };

    const handleDelete = (id: number | string) => {
        // setData([...data.filter((item: { id: number }) => item.id !== id)]);

        setTimeout(() => {
            api(`${path}/${id}/`, 'DELETE');
        }, 300);
    };

    useEffect(() => {
        api(`${path}/?limit=999999`, 'GET');
    }, []);

    useEffect(() => {

        if (newData) {
            setData([...data, {}]);
        }
    }, [newData]);

    useEffect(() => {
        if (!state.isLoading) {
            if (state.data) {
                if (state.path.includes(path)) {
                    if (state.data.results) {
                        setData(state.data.results);
                    } else {
                        const temp = data.filter(
                            (item: { id: number }) => item.id
                        );
                        api(`${path}/?limit=999999`, 'GET');
                        // setData(
                        //     [...temp, state.data].sort(
                        //         (a, b) => a.name - b.name
                        //     )
                        // );
                    }
                }
            }

            if (state.error) {
                console.log(state.error.detail.detail)
                toast.error(t(state.error.detail.detail));
            }
        }
    }, [state]);

    return (
        <div>
            {data?.length ? (
                data.map((item: any, index) => {
                    return (
                        <FoldableCard
                            key={index}
                            item={item}
                            count={item["operaciones_count"]}
                            doDelete={handleDelete}
                            forceOpen={data.length === 1}
                            doSave={(e) => handleSave(item.id, e)}
                            Form={() => (
                                <TypeEquipmentForm
                                    item={item}
                                    close={close}
                                />
                            )}
                        >
                            <Table
                                parent={item}
                                path="/operaciones"
                                deletePath="/operaciones"
                                query="limit=999999&tipo_equipo=:id"
                                setCount={(num: any) =>
                                    setCount({...count, [index]: num})
                                }
                                Form={(props: any) => (
                                    <TypeEquipmentOperationForm
                                        id={item.id}
                                        {...props}
                                    />
                                )}
                                buttonLabel="type-equipment.table.add-task"
                                headers={[
                                    {
                                        key: 'name',
                                        label: 'type-equipment.table.operation-name'
                                    },
                                    {
                                        key: 'orden',
                                        label: 'type-equipment.table.operation-order'
                                    },
                                    {
                                        key: 'por_defecto',
                                        label: 'type-equipment.table.operation-default'
                                    }
                                ]}
                            />
                        </FoldableCard>
                    );
                })
            ) : (
                <div className="flex justify-center text-center">
                    <span className="not-italic font-light text-xl leading-6 text-gray-darker">
                        {t('common.message.no-data')}
                    </span>
                </div>
            )}
        </div>
    );
};
