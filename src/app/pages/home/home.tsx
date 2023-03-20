import { Outlet } from 'react-router-dom';

import { Drawer } from '../../shared/drawer';
import { PageBody } from '../../elements/page-body';
import { HomeBody } from './home-body';
import { DateRangePicker } from '../../elements/date-range-picker';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const Home = () => {
    const { t } = useTranslation();
    const [filterDates, setFilterDates] = useState({});

    const handleDates = (dates: any) => {
        if (dates) {
            const start = dayjs(dates[0]);
            const end = dates[1]
                ? dayjs(dates[1])
                : dayjs(dates[0]).add(1, 'day');
            if (dates[1]) {
                setFilterDates({
                    start_date: `${start.format('YYYY-MM-DD')}`,
                    end_date: `${end.format('YYYY-MM-DD')}`
                });
            }
        } else {
            setFilterDates({});
        }
    };

    return (
        <PageBody title={''} infoText={''}>
            <>
                <header className="-mt-[60px] relative flex flex-col space-y-4 flex-none mb-6 justify-start space-x-4 py-4">
                    <span className="text-[25px] font-bold">
                        {t('dashboard.home.title')}
                    </span>
                    <div className="flex items-center">
                        <DateRangePicker doChange={handleDates} />
                    </div>
                </header>

                <HomeBody filterDates={filterDates} />
            </>
        </PageBody>
    );
};
