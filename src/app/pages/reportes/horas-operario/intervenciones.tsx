import {PageBody} from '../../../elements/page-body';
import {useDrawer} from '../../../shared/drawer';
import {useEffect, useState} from 'react';
import {IntervencionFilter} from "./intervencion-filter";
import {IntervencionesComponent} from "./intervenciones.component";
import {useHttpClient} from "../../../shared/http-client";
import {toast} from "react-toastify";
import {getQueryString} from "../../../utils";

export const HorasOperario = () => {
    const {open, close} = useDrawer();
    const {api, state} = useHttpClient();

    const [filters, setFilters] = useState<any>({});
    const [loading, setLoading] = useState<boolean>(false);

    const handleFilters = () => {
        open(
            'calendario.filter.title',
            <IntervencionFilter close={close} doFilter={doFilter} item={filters}/>
        );
    };

    const doFilter = (filters: any) => {
        close();
        if (Object.keys(filters).length === 0) {
            setFilters({});
        } else {
            setFilters((prev: any) => ({...prev, ...filters}));
        }
    };

    const handleExport = () => {
        setLoading(true);
        api(`/operarios/horas_export/?${getQueryString(
            filters
        )}`, "GET", null, false, true)
    }

    useEffect(() => {
        if (state.data) {
            if (state.path.includes('operarios')) {
                const url = window.URL.createObjectURL(new Blob([state.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `report_horas_operario_${Date.now()}.xlsx`);
                document.body.appendChild(link);
                link.click();
            }
            if (state.path.includes('horas_export')) {
                setLoading(false);
            }
        }

        if (state.error) {
            toast.error(state.error.detail);
        }
    }, [state]);

    return (
        <PageBody
            exportAction={handleExport}
            exportStatus={loading}
            exportActionTitle={'intervenciones.button.export'}
            title={'horas-operario.text.title'}
            infoText={'intervenciones.text.infoText'}
            filterAction={handleFilters}
        >
            <IntervencionesComponent
                filters={filters}
                doFilter={doFilter}
            />
        </PageBody>
    );
};
