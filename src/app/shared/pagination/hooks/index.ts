import { useEffect, useState } from 'react';

export const usePagination = () => {
    const [page, setPage] = useState<number>(0);
    const [maxRecords, setMaxRecords] = useState<number>(0);
    const [limit, setLimit] = useState<number>(0);

    useEffect(() => {}, [page, maxRecords, limit]);

    return {
        page,
        maxRecords,
        limit,
        next: () =>
            Math.ceil(maxRecords / limit) - 1 ? setPage(page + limit) : null,
        prev: () => (page !== 0 ? setPage(page - limit) : setPage(page)),
        first: () => setPage(0),
        last: () => {
            setPage(Math.floor(maxRecords / limit) * limit);
        },
        setMaxRecords: (count: number) => setMaxRecords(count),
        setLimit: (count: number) => setLimit(count)
    };
};
