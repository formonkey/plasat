import { useContext } from 'react';

import { DrawerContext } from '../contexts';

export const useDrawer = (): {
    open: (
        title: string,
        Component: any | null,
        hasClose?: boolean,
        size?: string
    ) => void;
    close: () => void;
} => {
    const context = useContext(DrawerContext);

    if (!context) {
        throw new Error('Use drawer must be used within a Drawer Provider');
    }

    return context;
};
