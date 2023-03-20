import React from 'react';

export type TableComponentTypes = {
    path: string;
    refresh: string | null;
    Form: React.FunctionComponent<{
        item: any;
        close: () => void;
        doDelete: (item: any) => void;
    }>;
    formTitle: string;
    columns?: string[] | undefined;
    limit?: number;
    withPagination?: boolean;
};
