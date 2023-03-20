import { Outlet } from 'react-router-dom';

import { Drawer } from '../../shared/drawer';

export const Main = () => (
    <Drawer>
        <Outlet />
    </Drawer>
);
