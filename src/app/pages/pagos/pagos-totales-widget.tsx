import {useTranslation} from "react-i18next";
import {useHttpClient} from "../../shared/http-client";
import {useEffect, useState} from "react";
import {toast} from "react-toastify";
import {CurrencyEuroIcon} from "@heroicons/react/outline";
import {NumericFormat} from "react-number-format";

export const PagosTotalesWidget = ({
                                       path,
                                       query,
                                       refresh,
                                   }: any) => {
    const {t} = useTranslation();
    const {api, state} = useHttpClient();
    const [data, setData] = useState<number>(0);

    const request = () => {
        if (path) {
            let endpoint = `${path}/?${query}&limit=999999999999`;
            api(endpoint, 'GET');
        }
    };


    useEffect(() => {
        if (query) {
            request();
        }
    }, [query]);

    useEffect(() => {
        request();
    }, []);

    useEffect(() => {
        console.log("REFRESCAME :: ");
        request();
    }, [refresh]);

    useEffect(() => {
        if (state.data && state.data.results) {
            setData(state.data.results.reduce((acc: any, item: any) => {
                return (acc + +item.importe)
            }, 0));
        }

        if (state.error) {
            toast.error(state.error.detail);
        }
    }, [state]);

    return (
        <div className="relative bg-white pt-5 px-4 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden mb-8">
            <dt>
                <div className="absolute bg-primary rounded-md p-3">
                    <CurrencyEuroIcon className="h-6 w-6 text-white" aria-hidden="true"/>
                </div>
                <p className="ml-16 text-sm font-medium text-gray-500 truncate">
                    {t("pagos.widget.pagos-totales")}
                </p>
            </dt>
            <dd className="ml-16 pb-6 flex items-baseline sm:pb-7">
                <p className="text-2xl font-semibold text-gray-900">
                    <NumericFormat
                        value={data.toFixed(2)}
                        valueIsNumericString={true}
                        thousandSeparator="."
                        decimalSeparator=","
                        allowedDecimalSeparators={['.', ',']}
                        displayType={"text"}
                        decimalScale={2}
                        suffix={'€'}
                    />
                </p>
            </dd>
        </div>
    )
}
