import {useParams} from 'react-router-dom';
import {TicketsIntervencionEditForm} from "../../tickets-intervencion-edit-form";
import {Table} from "../../../../elements/table";
import {PageBody} from "../../../../elements/page-body";
import {useDrawer} from "../../../../shared/drawer";
import {useState} from "react";

export const TicketsComponent = () => {
    const {id} = useParams();
    const {open, close} = useDrawer();
    const [refresh, setRefresh] = useState<string | null>(null);


    const handleNewAction = () => {
        open(
            'intervenciones.drawer.add-tickets',
            <TicketsIntervencionEditForm
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
                title={'intervenciones.tabs.tickets'}
                newActionTitle={'intervenciones.drawer.add-tickets'}
            >

                <Table
                    path="/tickets"
                    deletePath="/tickets"
                    query={`intervencion=${id}`}
                    Form={TicketsIntervencionEditForm}
                    withPagination
                    refresh={refresh}
                    headers={[
                        {
                            key: 'fecha',
                            label: 'type-equipment.table.imagenes-fecha'
                        },
                        {
                            key: 'name',
                            label: 'type-equipment.table.imagenes-name'
                        },
                        {
                            key: 'importe',
                            label: 'type-equipment.table.imagenes-importe'
                        },
                        {
                            key: 'imagen',
                            label: 'type-equipment.table.imagenes-imagen'
                        }

                    ]}
                />
            </PageBody>
        </div>
    );
};
