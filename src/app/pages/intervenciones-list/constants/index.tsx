export type EstadosTypes = {
    id: number,
    value: string,
    label: string
};

export const ESTADOS: EstadosTypes[]  = [
    { id: 1, value: 'PENDIENTE', label: 'Pendiente' },
    { id: 2, value: 'ASIGNADO', label: 'Asignado' },
    { id: 3, value: 'PROCESO', label: 'En proceso' },
    { id: 4, value: 'FINALIZADO', label: 'Finalizado' },
    { id: 5, value: 'CERRADO', label: 'Cerrado' },
]
