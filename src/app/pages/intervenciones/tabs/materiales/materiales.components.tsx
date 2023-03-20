import {useParams} from 'react-router-dom';
import {MaterialesIntervencionEditForm} from "../../materiales-intervencion-edit-form";
import {Table} from "../../../../elements/table";
import {PageBody} from "../../../../elements/page-body";
import {useDrawer} from "../../../../shared/drawer";
import {useState} from "react";

export const MaterialesComponent = () => {
    const {id} = useParams();
    const {open, close} = useDrawer();
    const [refresh, setRefresh] = useState<string | null>(null);


    const handleNewAction = () => {
        open(
            'intervenciones.drawer.add-materiales',
            <MaterialesIntervencionEditForm
                item={{intervencion: id}}
                close={handleClose}
            />
        );
    };

    const handleClose = () => {
        setRefresh(Date.now().toString());
        close();
    };

    return (
        <div className="flex h-full flex-col">
            <PageBody
                newAction={handleNewAction}
                title={'intervenciones.tabs.materiales'}
                newActionTitle={'intervenciones.drawer.add-materiales'}
            >

                <Table
                    path="/materiales-intervencion"
                    deletePath="/materiales-intervencion"
                    query={`intervencion=${id}`}
                    Form={MaterialesIntervencionEditForm}
                    withPagination
                    refresh={refresh}
                    headers={[
                        {
                            key: 'fecha_pago',
                            label: 'common.label.fecha_pago'
                        },
                        {
                            key: 'name',
                            label: 'common.label.name'
                        },
                        {
                            key: 'importe',
                            label: 'common.label.importe',
                            type: 'currency',
                        },
                        {
                            key: 'modo_pago',
                            label: 'common.label.modo_pago'
                        },
                        {
                            key: 'proveedor',
                            label: 'common.label.proveedor'
                        },
                        {
                            key: 'operario',
                            label: 'common.label.operario'
                        }

                    ]}
                />
            </PageBody>
        </div>
    );
};
