import React from 'react';
import { PageBodyTypes } from './types';
import { PageHeader } from '../page-header';

export const PageBody = ({
    title,
    infoText,
    filterAction,
    filters,
    newAction,
    newActionTitle,
    secondaryAction,
    secondaryActionTitle,
    exportAction,
    exportStatus,
    exportActionTitle,
    children,
}: PageBodyTypes) => {
    return (
        <main className="flex-1">
            <div className="py-6">
                <PageHeader
                    title={title}
                    filterAction={filterAction}
                    filters={filters}
                    infoText={infoText}
                    newAction={newAction}
                    newActionTitle={newActionTitle}
                    secondaryAction={secondaryAction}
                    secondaryActionTitle={secondaryActionTitle}
                    exportAction={exportAction}
                    exportStatus={exportStatus}
                    exportActionTitle={exportActionTitle}
                />
                <div className="mx-auto px-4 sm:px-6 md:px-8 mt-[32px]">
                    <div className="py-4">{children}</div>
                </div>
            </div>
        </main>
    );
};
