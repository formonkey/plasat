import { PencilIcon, SaveIcon, TrashIcon } from '@heroicons/react/outline';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import SpinIcon from '../../common/SpinIcon';
import useDeleteModal from '../../components/useDeleteModal';
import { apiAuth } from '../../logic/api';

export default function EntityList() {
    const { t } = useTranslation();
    const { entity } = useParams();
    const [item, setItem] = React.useState(null);

    const getData = () => {
        const res = apiAuth.get(`/${entity}/?limit=9999`);
        return res;
    };

    const createData = () => {
        const res = apiAuth.post(`/${entity}/`, item);
        return res;
    };

    const updateData = () => {
        const res = apiAuth.patch(`/${entity}/${item.id}/`, {
            name: item.name
        });
        return res;
    };

    const deleteData = (id) => {
        const res = apiAuth.delete(`/${entity}/${id}/`);
        return res;
    };

    const { isLoading, isError, error, data } = useQuery(entity, getData);

    const queryClient = useQueryClient();

    const createMutation = useMutation(createData, {
        onSuccess: () => {
            queryClient.invalidateQueries(entity);
        }
    });

    const updateMutation = useMutation(updateData, {
        onSuccess: () => {
            queryClient.invalidateQueries(entity);
        }
    });

    const deleteMutation = useMutation(deleteData, {
        onSuccess: () => {
            queryClient.invalidateQueries(entity);
        }
    });

    const { Modal, openModal } = useDeleteModal((id) =>
        deleteMutation.mutate(id)
    );

    const saveItem = () => {
        if (item.name !== '') {
            if (item.id) {
                updateMutation.mutate();
            } else {
                createMutation.mutate();
            }
        }
        setItem(null);
    };

    if (isLoading) {
        return <SpinIcon />;
    }

    if (isError) {
        toast.error(error.message);
        // return <SpinIcon />;
    }

    return (
        <>
            <div className="container mx-auto max-w-xl mt-4">
                <h1 className="font-bold text-xl uppercase">{t(entity)}</h1>

                <div className="flex space-x-3 items-center my-4">
                    <input
                        className="flex-1"
                        type="text"
                        value={item?.name || ''}
                        onChange={(e) =>
                            setItem((prev) => ({
                                ...prev,
                                name: e.target.value
                            }))
                        }
                    />
                    <div onClick={saveItem}>
                        <SaveIcon className="h-5 w-5 text-blue-700" />
                    </div>
                </div>

                {data?.data.results.map((dato) => {
                    return (
                        <div
                            key={dato.id}
                            className="p-3 border-xl shadow-md flex"
                        >
                            <div className="flex-1">{dato.name}</div>
                            <div className="flex justify-between items-center space-x-3">
                                <div onClick={() => setItem(dato)}>
                                    <PencilIcon className="h-5 w-5 text-blue-700" />
                                </div>
                                <div onClick={() => openModal(dato.id)}>
                                    <TrashIcon className="h-5 w-5 text-blue-700" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            <Modal mensaje="borrar" />
        </>
    );
}

