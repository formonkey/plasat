import React, { useState, useEffect } from 'react';

import { ChartBar, ChartColumn, ChartSemiDonut } from '../../elements/charts';
import { useHttpClient } from '../../shared/http-client/hooks';
import { useTranslation } from 'react-i18next';

const colors = require('../../../tailwind.colors.json');

export const HomeBody = ({ filterDates }: any) => {
    const { t } = useTranslation();
    const { api, state } = useHttpClient();
    const [billingData, setBillingData] = useState();
    const [realEstimateData, setRealEstimateData] = useState();
    const [operatorRankingData, setOperatorRankingData] = useState();
    const [typeInterventionsData, setTypeInterventionsData] = useState();

    useEffect(() => {
        const search = new URLSearchParams(filterDates).toString();

        setTimeout(() => api(`/dashboard/cobros/?${search}`, 'GET'), 200);
        setTimeout(
            () => api(`/dashboard/estimadas_reales/?${search}`, 'GET'),
            400
        );
        setTimeout(
            () => api(`/dashboard/operarios_ranking/?${search}`, 'GET'),
            600
        );
        setTimeout(
            () => api(`/dashboard/tipos_intervenciones/?${search}`, 'GET'),
            800
        );
    }, [filterDates]);

    useEffect(() => {
        if (state.data && !state.isLoading) {
            if (state.path.includes('/cobros/')) {
                setBillingData({
                    categories: state.data.categories,
                    values: { data: state.data.data }
                } as any);
            } else if (state.path.includes('/estimadas_reales/')) {
                setRealEstimateData({
                    categories: state.data.labels,
                    values: { data: state.data.values }
                } as any);
            } else if (state.path.includes('/operarios_ranking/')) {
                setOperatorRankingData({
                    categories: state.data.categories,
                    values: {
                        data: state.data.data.map((value: string) => +value)
                    }
                } as any);
            } else if (state.path.includes('/tipos_intervenciones/')) {
                setTypeInterventionsData(
                    state.data.map((item: any, idx: number) => ({
                        name: item.label,
                        y: item.value,
                        color:
                            idx % 2
                                ? (colors as any).primary['DEFAULT']
                                : idx % 3
                                ? (colors as any).secondary['DEFAULT']
                                : (colors as any).tertiary['DEFAULT'],
                        dataLabels: {
                            enabled: true
                        }
                    }))
                );
            }
        }
    }, [state]);

    return (
        <div className="grid grid-cols-12 gap-5">
            <div className="border col col-span-4 shadow-xl border-gray-200 rounded-xl">
                <div className="border-b border-gray-200 px-4 py-5">
                    <h1 className="text-md">
                        {t('dashboard.chart.intervention-type')}
                    </h1>
                </div>
                <div>
                    <ChartSemiDonut data={typeInterventionsData} />
                </div>
            </div>

            <div className="border col col-span-4 shadow-xl border-gray-200 rounded-xl">
                <div className="border-b border-gray-200 px-4 py-5">
                    <h1 className="text-md">
                        {t('dashboard.chart.esitmated-real')}
                    </h1>
                </div>
                <div>
                    <ChartBar data={realEstimateData} />
                </div>
            </div>

            <div className="border col col-span-4 shadow-xl border-gray-200 rounded-xl">
                <div className="border-b border-gray-200 px-4 py-5">
                    <h1 className="text-md">{t('dashboard.chart.billing')}</h1>
                </div>
                <div>
                    <ChartColumn data={billingData} />
                </div>
            </div>

            <div className="col col-span-12 border shadow-xl border-gray-200 rounded-xl">
                <div className="border-b border-gray-200 px-4 py-5">
                    <h1 className="text-md">
                        {t('dashboard.chart.operator-ranking')}
                    </h1>
                </div>
                <div>
                    <ChartBar data={operatorRankingData} />
                </div>
            </div>
        </div>
    );
};
