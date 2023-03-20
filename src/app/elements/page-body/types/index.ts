export type PageBodyTypes = {
    title: string;
    infoText?: string;
    filterAction?: () => void;
    filters?: any;
    newAction?: () => void;
    newActionTitle?: string;
    secondaryAction?: () => void;
    secondaryActionTitle?: string;
    exportAction?: () => void;
    exportStatus?: boolean;
    exportActionTitle?: string;
    children: JSX.Element;
};
