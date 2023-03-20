import {useParams} from 'react-router-dom';
import {FirmasIntervencionEditForm} from "../../firmas-intervencion-edit-form";
import {Table} from "../../../../elements/table";
import {PageBody} from "../../../../elements/page-body";
import {useDrawer} from "../../../../shared/drawer";
import {useState} from "react";

export const FirmasComponent = () => {
    const {id} = useParams();
    const {open, close} = useDrawer();
    const [refresh, setRefresh] = useState<string | null>(null);


    const handleNewAction = () => {
        open(
            'intervenciones.drawer.add-firmas',
            <FirmasIntervencionEditForm
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
                title={'intervenciones.tabs.firmas'}
                // newAction={handleNewAction}
                // newActionTitle={'intervenciones.drawer.add-firmas'}
            >

                <Table
                    path="/firmas"
                    deletePath="/firmas"
                    query={`intervencion=${id}`}
                    Form={FirmasIntervencionEditForm}
                    withPagination
                    refresh={refresh}
                    headers={[
                        {
                            key: 'fecha',
                            label: 'Fecha',
                            type: 'date'
                        },
                        {
                            key: 'name',
                            label: 'Nombre'
                        },
                        {
                            key: 'imagen',
                            label: 'Firma',
                            type: 'image'
                        }

                    ]}
                />
            </PageBody>
        </div>
    );
};
