import React, { useRef } from 'react';

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useTranslation } from 'react-i18next';

export const ChartSemiDonut = ({
    data,
    ...props
}: {
    data: any;
    props?: HighchartsReact.Props;
}) => {
    const { t } = useTranslation();
    const chartComponentRef = useRef<HighchartsReact.RefObject>(null);

    return data?.length ? (
        <HighchartsReact
            highcharts={Highcharts}
            options={{
                title: {
                    text: ''
                },
                plotOptions: {
                    pie: {
                        dataLabels: {
                            enabled: true,
                            distance: -50,
                            style: {
                                fontWeight: 'bold',
                                color: 'white'
                            }
                        },
                        startAngle: -90,
                        endAngle: 90,
                        center: ['50%', '75%'],
                        size: '110%'
                    }
                },
                series: [
                    {
                        data,
                        name: '',
                        type: 'pie',
                        innerSize: '50%'
                    }
                ]
            }}
            ref={chartComponentRef}
            {...props}
        />
    ) : (
        <div className="flex justify-center flex-col space-y-4 p-10 w-full text-center items-center align-center text-gray-400 uppercase">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6"
                />
            </svg>

            <span className="w-full text-center">
                {t('common.label.no-data')}
            </span>
        </div>
    );
};
