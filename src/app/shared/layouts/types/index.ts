import React from 'react';

export type MenuNavigationItem = {
    name: string;
    href?: string;
    icon?: (props: React.ComponentProps<'svg'>) => JSX.Element;
    current?: boolean;
    children?: any[];
    roles?: string[];
};

export enum Roles {
    SuperAdmin = 'superadmin',
    User = 'usuario',
}
