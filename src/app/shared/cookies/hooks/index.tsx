import { PREFIX } from '../../../constants';
import Cookies from 'js-cookie';

export const useCookies = () => {
    return {
        get: (key: string) => {
            const value = Cookies.get(`${PREFIX}${key}`);

            return value ? JSON.parse(value) : null;
        },

        remove: (key: string, domain: string) => Cookies.remove(`${PREFIX}${key}`, { domain: domain }),

        set: (key: string, value: any, domain: string) => {

            // console.log("SET COOKIE", key);
            // console.log("SET COOKIE", value);
            // console.log("SET COOKIE DOMAIN", domain);

            Cookies.set(`${PREFIX}${key}`, JSON.stringify(value), { domain: domain });
        }
    };
};
