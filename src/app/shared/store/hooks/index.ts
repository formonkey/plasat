import { PREFIX } from '../../../constants';

export const useStore = () => {
    return {
        get: (key: string) => {
            const value = localStorage.getItem(`${PREFIX}${key}`);

            return value ? JSON.parse(value) : null;
        },
        del: (key: string) => localStorage.removeItem(`${PREFIX}${key}`),
        remove: () => localStorage.clear(),
        set: (key: string, value: any) =>
            localStorage.setItem(`${PREFIX}${key}`, JSON.stringify(value))
    };
};
