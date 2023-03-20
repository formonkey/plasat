export type FoldableCardTypes = {
    item: any;
    name?: string;
    forceOpen?: boolean;
    doEdit?: () => void;
    doItem?: (id: string) => void;
    children?: JSX.Element;
    doSave?: (e: any) => void;
    count?: number | null | undefined;
    doDelete?: (id: string | number) => void;
    Form?: React.FunctionComponent<{ item?: any }>;
    Detail?: any;
};
