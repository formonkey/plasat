import React, { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { noop } from '../../../utils';
import { HOME_OPERATION_SELECTED } from '../constants';
import { FoldableCard } from '../../../elements/foldable-card';
import { Table } from '../../../elements/table';
import { HomeOperationForm } from './home-operation-form';


export const HomeOperations = ({ data, setOperations, refresh }: any) => {
    const { t } = useTranslation();
    const [ selected, setSelected ] = useState<any>({});

    useEffect(() => {
        setSelected(() => HOME_OPERATION_SELECTED(t, noop, {}, noop));
    }, [])

    return (
        <div className="w-full h-screen pb-8 bg-[#FAFAFA]">
            <div className="flex items-center justify-center bg-white py-8 shadow-sm border-b border-gray-300">
                <div className="absolute inset-y-0 left-[23px] h-6 top-8 text-gray-400 cursor-pointer" onClick={() => setOperations([])}>
                    <div className="relative">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                </div>
                <span className="text-[20px] leading-[24px] font-regular">
                    {t('home-staff.operations.title')}
                </span>
            </div>

            <div className="px-[23px] h-full overflow-y-auto space-y-8 px-[23px] pt-8 pb-40">
                {selected?.headers && data?.length ? (
                    data.map((item: any, index: number) => {
                        return (
                            <FoldableCard
                                key={index}
                                item={item.equipo_instalacion}
                                forceOpen={data.length === 1}
                                count={item.operaciones_equipo.length}
                            >
                                <Table
                                    isParentData
                                    parent={data}
                                    callBeforeDrawerClosed={refresh}
                                    parentData={item.operaciones_equipo}
                                    query={selected.query}
                                    Form={HomeOperationForm}
                                    buttonLabel={t(
                                        'common.label.add-new'
                                    )}
                                    headers={selected.headers}
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
        </div>
    )
}
