import React from 'react';
import { LocationMarkerIcon } from '@heroicons/react/outline';
import { EquiposIntervencionForm } from '../../../pages/intervenciones/equipos-intervencion-form';
import { EquiposIntervencionEditForm } from '../../../pages/intervenciones/equipos-intervencion-edit-form';
import { classNames, estatusCardColor } from '../../../utils';

export const HOME_OPERATION_SELECTED: any = (t: any, openDrawer: any, params: any, onHandleClose: any) => ({
    key: 'tareas',
    path: '/equipos-intervencion/',
    childrenPath: 'operaciones-equipo/',
    query: 'equipo_intervencion=:id',
    type: 'foldable',
    label: 'intervenciones.tabs.tareas',
    detail: ({ item }: any) => (
        <div className="flex space-x-[8px]">
            <LocationMarkerIcon className="h-3 w-3 mt-[1.2px]" />
            <span>
                        {item?.equipo?.tipo_equipo?.name ||
                            t('common.label.not-direction')}{' '}
                    </span>
            <span>{item?.operario?.name}</span>
            <span>
                        {item?.horas_estimadas
                            ? `${item.horas_estimadas} h.`
                            : ''}
                    </span>
        </div>
    ),
    onAddNew: (props: any) =>
        openDrawer(
            'intervenciones.drawer.add-equipo',
            <EquiposIntervencionForm
                {...props}
                {...params}
                close={onHandleClose}
            />,
            false
        ),
    onEdit: (props: any) =>
        openDrawer(
            'intervenciones.drawer.edit-equipo',
            <EquiposIntervencionEditForm
                {...props}
                {...params}
                close={onHandleClose}
            />
        ),
    headers: [
        {
            key: 'operacion',
            label: 'common.label.name',
        },
        {
            key: 'horas_estimadas',
            label: 'common.label.horas_estimadas'
        },
        {
            key: 'horas_reales',
            label: 'common.label.horas_reales'
        },
        {
            key: 'precio_hora',
            label: 'common.label.precio_hora'
        },
        {
            key: 'operario',
            label: 'common.label.operario'
        }
    ]
});

const OPERATION_STATUS = {
    1: {
        LABEL: 'home-staff.intervention-status.pending',
        BG: 'bg-gray-400',
    },
    2: {
        LABEL: 'home-staff.intervention-status.progress',
        BG: 'bg-green-400',
    },
    3: {
        LABEL: 'home-staff.intervention-status.stopped',
        BG: 'bg-yellow-400',
    },
    4: {
        LABEL: 'home-staff.intervention-status.finished',
        BG: 'bg-primary',
    }
}

export const HomeStaffOperationStatus = ({ t, status, hasLabel }: any) => (
    <>
        {
            hasLabel && (
                <span className="text-gray-500 text-sm">{t('home-staff.header.status')}</span>
            )
        }
        <div className="flex items-center space-x-2 mt-2">
                            <span className={classNames(
                                'w-3 h-3 rounded-full',
                                (OPERATION_STATUS as any)?.[status]?.BG
                            )}></span>
            <span className="text-gray-900 text-sm">{t((OPERATION_STATUS as any)?.[status]?.LABEL)}</span>
        </div>
    </>
)

export const retrieveOperationRunsGetHoursDiff = (data: any) => {
    const temporal = [].concat
        .apply([], data?.equipos_intervencion?.map((e: any) => e.operaciones_equipo))
        .map((item: any) => {
            item.status = item.is_done ? 4 :
                item.operacionrun.length === 0 ? 0 :
                    item.operacionrun[item.operacionrun.length - 1].fin ? 2 :
                        1;

            return item;
        });

        const runs = [].concat.apply([], temporal?.map((e) => e.operacionrun));

        if (runs.length) {

            const resultEnd: any = runs.sort((a, b) =>
                Number(new Date(a['fin'])) - Number(new Date(b['fin']))
            ).reverse()[0];

            const resultInit: any = runs.sort((a, b) =>
                Number(new Date(a['inicio'])) - Number(new Date(b['inicio']))
            )[0];

            return getHoursDiff(resultInit.inicio, resultEnd.fin);
        } else {
            return '(00:00:00)';
        }
}

export const getHoursDiff = (startDate: any, endDate: any) => {
    if (startDate) {
        startDate = new Date(startDate);
        endDate = endDate ? new Date(endDate) : new Date();

        const parsed = (time: number) => time < 10 ? `0${time}` : time;

        let seconds = Math.floor((endDate - (startDate))/1000);
        let minutes = Math.floor(seconds/60);
        let hours = Math.floor(minutes/60);

        const days = Math.floor(hours/24);
        const hours2 = hours-(days*24);

        minutes = minutes-(days*24*60)-(hours2*60);
        seconds = seconds-(days*24*60*60)-(hours2*60*60)-(minutes*60);

        return days ?
            `(${parsed(hours)}:${parsed(minutes)}:${parsed(seconds)})` :
            `(${parsed(hours)}:${parsed(minutes)}:${parsed(seconds)})`;
    } else {
        return '(00:00:00)';
    }
}

export const toDataUrl = (url: string, callback: (e: any) => void) => {
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
        var reader = new FileReader();
        reader.onloadend = function() {
            callback(reader.result);
        }
        reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
}

export const dataURLtoFile = (dataurl: string, filename: string) => {
    const arr = dataurl.split(',');

    if (arr && arr.length) {
        const mime = arr[0].match(/:(.*?);/)?.[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    }
}
