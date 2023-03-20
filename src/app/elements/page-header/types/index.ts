export type PageHeaderTypes = {
    title: string;
    filterAction?: () => void;
    filters?: any;
    infoText?: string | null;
    hasInfo?: boolean | null;
    newAction?: () => void;
    newActionTitle?: string | null;
    secondaryAction?: () => void;
    secondaryActionTitle?: string | null;
    exportAction?: () => void;
    exportStatus?: boolean;
    exportActionTitle?: string | null;
};
