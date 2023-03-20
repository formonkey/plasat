export type TipoEquipoTypes = {
    title: string;
    newAction: () => void;
    newActionTitle: string;
};

export type TableComponentTypes = {
    path: string;
    parent?: any;
    doDelete?: () => void;
    buttonLabel: string;
    headers: { key: string; label: string; width?: string }[];
};
