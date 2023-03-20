import {useEffect, useState} from 'react';
import {toast} from 'react-toastify';
import {InformationCircleIcon} from '@heroicons/react/solid';
import {useTranslation} from 'react-i18next';
import {useHttpClient} from '../../shared/http-client';
import {ComboBoxes} from '../../elements/combo-boxes';
import {useDrawer} from '../../shared/drawer';
import {EquipoForm} from '../equipos/equipo-form';
import {classNames} from '../../utils';
import {FormFooter} from '../../elements/form-footer';

export const ClientsInstallationsEquipmentForm = ({
                                                      id,
                                                      item,
                                                      close,
                                                      refresh,
                                                      ...props
                                                  }: any) => {
    const {t} = useTranslation();
    const {api, state} = useHttpClient();
    const [selected, setSelected] = useState<any[]>([]);
    const [selectAll, setSelectAll] = useState<boolean>(false);
    const {open: openDrawer, close: closeDrawer} = useDrawer();
    const [equipments, setEquipments] = useState<any | null>([]);
    const [installedEquipments, setInstalledEquipments] = useState<any>([]);
    const [installEquipments, setInstallEquipments] = useState<any>([]);

    const onSubmit = async () => {

        const equipos = installEquipments.map((e: any) => ({
            equipo: e.id,
            instalacion: item.id
        }))
        console.log("install equipments :: ", equipos)
        api(`/equipos-instalacion/`, 'POST', equipos);
    };

    const onAddEquipment = ({equipment}: any) => {
        if (equipment) {
            let i = 0;
            let equipos = installEquipments.map((e: any) => {
                return {...e, index: i++}
            })
            equipos = [...equipos, {...equipment, index: i}];
            setInstallEquipments(equipos);
        }
    };

    const comboBoxClose = (data: any) => () => {
        closeDrawer();

        setTimeout(() => {
            openDrawer(
                'add-equipment-to-installations',
                <ClientsInstallationsEquipmentForm
                    close={close}
                    id={id}
                    item={data}
                />
            );
        }, 700);
    };

    const createNewEquipment = () => {
        closeDrawer();

        item.equipos = installEquipments;

        setTimeout(() => {
            openDrawer(
                'common.label.add-new',
                <EquipoForm close={comboBoxClose(item)}/>,
                false
            );
        }, 700);
    };

    const onRemoveSelected = () => {
        setInstallEquipments(
            installEquipments.filter(
                (equipment: any) =>
                    !selected.find((e: any) => e.index === equipment.index)
            )
        );

        setSelected([]);
        setSelectAll(false);
    };

    useEffect(() => {
        // hemos de añadir un indice para permitir el borrado de los equipo que pueden estar "duplicados"
        if (item) {
            let i = 0;
            const equipos = item.equipos.map((e: any) => {
                return {...e, index: i++}
            })
            setInstalledEquipments(equipos);
        }
    }, [item, refresh]);

    useEffect(() => {
        api(`/equipos/?cliente=${id}&limit=9999`, 'GET');
    }, []);

    useEffect(() => {
        if (selectAll) {
            setSelected(installEquipments);
        } else {
            setSelected([]);
        }
    }, [selectAll]);

    useEffect(() => {
        if (state.data) {
            if (state.path.includes('equipos/?cliente')) {
                setEquipments(state.data.results);
            } else {
                close();
            }
        }

        if (state.error) {
            toast.error(state.error.detail);
        }
    }, [state]);

    const handleSelectAll = (item: any) => {
        setSelectAll(!selectAll)
    }

    return (
        <>
            <div className="rounded-md bg-blue-50 p-4 mb-[24px]">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <InformationCircleIcon/>
                    </div>
                    <div className="ml-3 flex-1 md:flex md:justify-between">
                        <p className="text-sm text-blue-700">
                            {t('client.equipment-form.combo-description')}
                        </p>
                    </div>
                </div>
            </div>

            <div className="w-full flex justify-start mt-8 mb-2">
                {t("client.equipment-form.installed")}
            </div>

            <table className="w-full table-fixed divide-y divide-gray-300 ">
                <thead className="bg-gray-50">
                <tr>
                    <th
                        scope="col"
                        className="relative w-12 px-6 sm:w-16 sm:px-8"
                    >
                    </th>
                    <th
                        scope="col"
                        className="min-w-[12rem] py-3.5 pr-3 text-left text-sm font-semibold text-gray-900"
                    >
                        {t("common.label.name")}
                    </th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-gray-50">
                {installedEquipments.map((iequipment: any, index: number) => (
                    <tr key={index}>
                        <td className="relative w-12 px-6 sm:w-16 sm:px-8">
                            <span className="absolute inset-y-0 left-0 w-0.5 "></span>
                        </td>
                        <td className="whitespace-nowrap py-4 pr-3 text-sm font-medium text-gray-900">
                            {iequipment.name}
                        </td>
                    </tr>
                ))}
                </tbody>

            </table>


            <div className="w-full flex justify-start mt-8 mb-2">
                {t("client.equipment-form.to-install")}
            </div>

            <ComboBoxes
                items={equipments}
                label={t('client.equipment-form.combo-label')}
                name="equipment"
                onChange={onAddEquipment}
                onCreate={createNewEquipment}
            />

            <table className="w-full table-fixed divide-y divide-gray-300 ">
                <thead className="bg-gray-50">
                <tr>
                    <th
                        scope="col"
                        className="relative w-12 px-6 sm:w-16 sm:px-8"
                    >
                        <input
                            type="checkbox"
                            onChange={handleSelectAll}
                            className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary-dark sm:left-6"
                        />
                    </th>
                    <th
                        scope="col"
                        className="min-w-[12rem] py-3.5 pr-3 text-left text-sm font-semibold text-gray-900"
                    >
                        {t("common.label.name")}
                    </th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-gray-50">
                {installEquipments.map((iequipment: any, index: number) => (
                    <tr key={index}>
                        <td className="relative w-12 px-6 sm:w-16 sm:px-8">
                            <span className="absolute inset-y-0 left-0 w-0.5 "></span>

                            <input
                                type="checkbox"
                                checked={
                                    // selectAll &&
                                    selected.find(
                                        (e: any) => e.index === iequipment.index
                                    )
                                }
                                onChange={() => {
                                    const element = selected.find(
                                        (e: any) => e.index === iequipment.index
                                    );

                                    if (element) {
                                        setSelected(
                                            [...selected].filter(
                                                (e: any) =>
                                                    e.index !== iequipment.index
                                            )
                                        );
                                    } else {
                                        setSelected([
                                            ...selected,
                                            iequipment
                                        ]);
                                    }
                                }}
                                className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary-dark sm:left-6"
                            />
                        </td>
                        <td className="whitespace-nowrap py-4 pr-3 text-sm font-medium text-gray-900">
                            {iequipment.name}
                        </td>
                    </tr>
                ))}
                </tbody>

            </table>


            <div className="w-full flex justify-end mt-8 mb-2">
                <button
                    type="button"
                    onClick={onRemoveSelected}
                    className={classNames(
                        'inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark',
                        selected.length
                            ? 'opacity-1 cursor-pointer'
                            : 'opacity-50 cursor-not-allowed'
                    )}
                >
                    Borrar elementos seleccionados
                </button>
            </div>

            <div className={"pb-24"}></div>

            <FormFooter
                item={item}
                close={closeDrawer}
                doSubmit={onSubmit}
            />
        </>
    );
};
