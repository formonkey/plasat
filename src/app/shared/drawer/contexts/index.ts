import { createContext } from 'react';

export const DrawerContext = createContext(
    {} as {
        open: (
            title: string,
            Component: any | null,
            hasClose?: boolean,
            size?: string
        ) => void;
        close: () => void;
    }
);
export const DrawerProvider = DrawerContext.Provider;
