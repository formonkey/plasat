import { Route } from 'react-router-dom';

import { Main } from './main';
import { MenuOperariosContainer } from '../../shared/layouts';
import {Home} from "../home";
import {Perfil} from "../perfil";

export const MainRouter = () => (
    <Route element={<MenuOperariosContainer />}>
        <Route path="/" element={<Main />}>
            <Route index element={<Home />} />
            <Route path="perfil" element={<Perfil />} />

            <Route path="*" element={<Home />} />
        </Route>
    </Route>
);
