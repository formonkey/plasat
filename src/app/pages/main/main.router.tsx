import {Navigate, Route} from 'react-router-dom';

import {Main} from './main';
import {MenuContainer} from '../../shared/layouts';
import {Home} from '../home';
import {TypeEquipment} from '../type-equipment';
import {Equipos} from '../equipos/equipo';
import {CategoriasOperarios} from '../categorias-operario/categorias-operario';
import {Paises} from '../paises/paises';
import {Provincias} from '../provincias/provincias';
import {Ciudades} from '../ciudades/ciudades';
import {Periodicidades} from '../periodicidades/periodicidades';
import {Estados} from '../estados/estados';
import {TiposIntervencion} from '../tipos-intervencion/tipos-intervencion';
import {Usuarios} from '../usuarios/usuarios';
import {Operarios} from '../operarios/operarios';
import {ClientBill, ClientInstallations, ClientInterventions, Clients, ClientsDetail} from '../clients';
import {ProveedoresExternos} from '../proveedores-externos/proveedores-externos';
import {Calendario} from '../calendario/calendario';
import {Tickets} from '../tickets/tickets';
import {Intervenciones} from '../intervenciones/intervenciones';
import {IntervencionesDetail} from '../intervenciones/intervenciones-detail';
import {Pagos} from '../pagos/pagos';
import {HorasOperario} from '../reportes/horas-operario/intervenciones';
import {Configuracion} from '../configuracion/configuracion';
import {InterventionsHours} from '../reportes/interventions-hours';
import {ModosPago} from '../modos-pago/modos-pago';
import {MaterialesComponent} from '../intervenciones/tabs/materiales/materiales.components';
import {TareasComponent} from '../intervenciones/tabs/tareas/tareas.components';
import {ConsumosComponent} from '../intervenciones/tabs/consumos/consumos.components';
import {HorasComponent} from '../intervenciones/tabs/horas/horas.components';
import {ImagenesComponent} from '../intervenciones/tabs/imagenes/imagenes.components';
import {TicketsComponent} from '../intervenciones/tabs/tickets/tickets.components';
import {FirmasComponent} from '../intervenciones/tabs/firmas/firmas.components';
import {IntervencionesList} from "../intervenciones-list/intervenciones";


export const MainRouter = () => (
    <Route element={<MenuContainer/>}>
        <Route path="/" element={<Main/>}>
            <Route index element={<Home/>}/>
            <Route path="tipo-equipo" element={<TypeEquipment/>}/>
            <Route path="equipos" element={<Equipos/>}/>
            <Route
                path="categorias-operario"
                element={<CategoriasOperarios/>}
            />
            <Route path="countries" element={<Paises/>}/>
            <Route path="provinces" element={<Provincias/>}/>
            <Route path="cities" element={<Ciudades/>}/>
            <Route path="periodicidades" element={<Periodicidades/>}/>
            <Route path="estados-intervencion" element={<Estados/>}/>
            <Route path="tipos-intervencion" element={<TiposIntervencion/>}/>
            <Route path="usuarios" element={<Usuarios/>}/>
            <Route path="operarios" element={<Operarios/>}/>
            <Route path="configuracion" element={<Configuracion/>}/>
            <Route path="cobros" element={<Pagos/>}/>
            <Route
                path="proveedores-externos"
                element={<ProveedoresExternos/>}
            />
            <Route path="intervenciones-list" element={<IntervencionesList />}/>
            <Route path="calendario" element={<Calendario/>}/>
            <Route path="intervenciones">
                <Route index element={<Intervenciones/>}/>
                <Route path=":id" element={<IntervencionesDetail/>}>
                    <Route path="tareas" element={<TareasComponent/>}/>
                    <Route path="consumos" element={<ConsumosComponent/>}/>
                    <Route
                        path="materiales"
                        element={<MaterialesComponent/>}
                    />
                    <Route path="horas" element={<HorasComponent/>}/>
                    <Route path="imagenes" element={<ImagenesComponent/>}/>
                    <Route path="tickets" element={<TicketsComponent/>}/>
                    <Route path="firmas" element={<FirmasComponent/>}/>
                    <Route path="*" element={<TareasComponent/>}/>
                </Route>
            </Route>
            <Route path="tickets" element={<Tickets/>}/>
            <Route path="clients">
                <Route index element={<Clients/>}/>
                <Route path=":id" element={<ClientsDetail/>}>
                    <Route
                        path="installations"
                        element={<ClientInstallations/>}
                    />

                    <Route
                        path="interventions"
                        element={<ClientInterventions/>}
                    />

                    <Route path="bills" element={<ClientBill/>}/>

                    <Route
                        path=""
                        element={<Navigate to="installations" replace/>}
                    />
                </Route>
            </Route>
            <Route path="reporte-horas-operario" element={<HorasOperario/>}/>
            <Route
                path="reporte-horas-intervencion"
                element={<InterventionsHours/>}
            />
            <Route path="modos-pago" element={<ModosPago/>}/>

            <Route path="*" element={<Home/>}/>
        </Route>
    </Route>
);
