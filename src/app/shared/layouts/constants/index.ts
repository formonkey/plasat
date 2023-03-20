import {CalendarIcon, CurrencyEuroIcon, HomeIcon, UserIcon, UsersIcon} from '@heroicons/react/outline';
import {MenuNavigationItem, Roles} from '../types';

export const MENU_NAVIGATION_LINKS: (tipo: string) => MenuNavigationItem[] = (tipo: string) => ([
    {
        name: 'Dashboard',
        href: '/',
        icon: HomeIcon,
        current: false,
        roles: [Roles.SuperAdmin, Roles.User],
    },
    {
        name: 'Calendario',
        href: '/calendario',
        icon: CalendarIcon,
        current: false,
        roles: [Roles.SuperAdmin, Roles.User],
    },
    {
        name: 'Reportes',
        roles: [Roles.SuperAdmin, Roles.User],
        children: [
            {
                name: 'Intervenciones',
                href: '/intervenciones-list',
                icon: CalendarIcon,
                current: false,
                roles: [Roles.SuperAdmin, Roles.User],
            },
            {
                name: 'Horas por operario',
                href: '/reporte-horas-operario',
                icon: HomeIcon,
                current: false
            },
            {
                name: 'Horas por intervencion',
                href: '/reporte-horas-intervencion',
                icon: HomeIcon,
                current: false
            },
            {
                name: 'Cobros',
                href: '/cobros',
                icon: CurrencyEuroIcon
            }
        ]
    },
    {
        name: 'Administración',
        roles: [Roles.SuperAdmin],
        icon: UsersIcon,
        current: false,
        children: [
            {
                name: 'Configuracion',
                href: '/configuracion',
                icon: HomeIcon,
                current: false
            },
            {
                name: 'Paises',
                href: '/countries',
                icon: HomeIcon,
                current: false
            },
            {
                name: 'Provincias',
                href: '/provinces',
                icon: HomeIcon,
                current: false
            },
            {
                name: 'Ciudades',
                href: '/cities',
                icon: HomeIcon,
                current: false
            },
            {
                name: 'Tipos de intervencion',
                href: '/tipos-intervencion',
                icon: HomeIcon,
                current: false
            },
            {
                name: 'Modos de Pago',
                href: '/modos-pago',
                icon: HomeIcon,
                current: false
            },
            {
                name: 'Periodicidades',
                href: '/periodicidades',
                icon: HomeIcon,
                current: false
            },
            {
                name: tipo ? 'Tipos de equipo' : 'Tipos de servicio',
                href: '/tipo-equipo',
                icon: UsersIcon,
                current: false,
                roles: [Roles.SuperAdmin, Roles.User],
            },
            {
                name: tipo ? 'Equipos' : 'Servicios',
                href: '/equipos',
                icon: HomeIcon,
                current: false,
                roles: [Roles.SuperAdmin, Roles.User],
            },
            {
                name: 'Clientes',
                href: '/clients',
                icon: UserIcon,
                roles: [Roles.SuperAdmin, Roles.User],
            },

            {
                name: 'Categorias operarios',
                href: '/categorias-operario',
                icon: HomeIcon,
                current: false
            },
            {
                name: 'Proveedores externos',
                href: '/proveedores-externos',
                icon: HomeIcon,
                current: false
            },
            {
                name: 'Operarios',
                href: '/operarios',
                icon: HomeIcon,
                current: false
            },
            {
                name: 'Usuarios',
                href: '/usuarios',
                icon: HomeIcon,
                current: false
            }
        ]
    }
]);

export const MENU_OPERARIOS_NAVIGATION_LINKS: MenuNavigationItem[] = [
    {name: 'Home', href: '/', icon: HomeIcon, current: false}
];
