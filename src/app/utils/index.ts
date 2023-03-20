export const noop = () => null;

export const classNames = (...classes: string[]) =>
    classes.filter(Boolean).join(' ');

export const getQueryString = (filters: any) => {
    return Object.keys(filters)
        .map((key) => `${key}=${filters[key] ? filters[key] : ''}`)
        .join('&');
};

export const estatusColor = (item: any) => {
    switch (item.estado) {
        case 'PENDIENTE':
            return '#FF000090';
        case 'ASIGNADO':
            return '#FF770090';
        case 'PROCESO':
            return '#FFFF0090';
        case 'FINALIZADO':
            return '#00D00090';
        case 'CERRADO':
            return '#2C2C2C90';
        default:
            return '#FF000090';
    }
};

export const estatusCardColor = (item: any) => {
    switch (item.estado) {
        case 'PENDIENTE':
            return 'bg-pendiente';
        case 'ASIGNADO':
            return 'bg-asignado';
        case 'PROCESO':
            return 'bg-proceso';
        case 'FINALIZADO':
            return 'bg-finalizado';
        case 'CERRADO':
            return 'bg-cerrado';
        default:
            return 'bg-pendiente';
    }
};

export const estatusTextColor = (item: any) => {
    switch (item.estado) {
        case 'PENDIENTE':
            return '#545454';
        case 'ASIGNADO':
            return '#2F7781';
        case 'PROCESO':
            return '#B9772B';
        case 'FINALIZADO':
            return '#2F8133';
        case 'CERRADO':
            return '#950F0F';
        default:
            return '#545454';
    }
};

export const estatusTextColorRendered = (item: any) => {
    switch (item.estado) {
        case 'PENDIENTE':
            return 'text-[#545454]';
        case 'ASIGNADO':
            return 'text-[#2F7781]';
        case 'PROCESO':
            return 'text-[#B9772B]';
        case 'FINALIZADO':
            return 'text-[#2F8133]';
        case 'CERRADO':
            return 'text-[#950F0F]';
        default:
            return 'text-[#545454]';
    }
};
