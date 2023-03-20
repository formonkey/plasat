import {useParams} from 'react-router-dom';
import {ImagenesIntervencionEditForm} from "../../imagenes-intervencion-edit-form";
import {Table} from "../../../../elements/table";
import {PageBody} from "../../../../elements/page-body";
import {useDrawer} from "../../../../shared/drawer";
import {useState} from "react";

export const ImagenesComponent = () => {
    const {id} = useParams();
    const {open, close} = useDrawer();
    const [refresh, setRefresh] = useState<string | null>(null);


    const handleNewAction = () => {
        open(
            'intervenciones.drawer.add-imagenes',
            <ImagenesIntervencionEditForm
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
                title={'intervenciones.tabs.imagenes'}
                newActionTitle={'intervenciones.drawer.add-imagenes'}
            >

                <Table
                    path="/imagenes"
                    deletePath="/imagenes"
                    query={`intervencion=${id}`}
                    Form={ImagenesIntervencionEditForm}
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
                            key: 'imagen',
                            label: 'type-equipment.table.imagenes-imagen'
                        }

                    ]}
                />
            </PageBody>
        </div>
    );
};
