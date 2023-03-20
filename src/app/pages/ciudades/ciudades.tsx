import { useState } from 'react';
import { useDrawer } from '../../shared/drawer';
import { PageBody } from '../../elements/page-body';
import { CiudadesForm } from './ciudades-form';
import { TableComponent } from '../../elements/table-component/table.component';

export const Ciudades = () => {
    const { open, close } = useDrawer();
    const [refresh, setRefresh] = useState<string | null>(null);

    const handleNewAction = () => {
        open('ciudad.form.new-item', <CiudadesForm close={handleClose} />);
    };

    const handleClose = () => {
        setRefresh(Date.now().toString());
        close();
    };

    return (
        <PageBody
            newAction={handleNewAction}
            title={'ciudad.text.title'}
            infoText={'ciudad.text.infoText'}
            newActionTitle={'ciudad.button.new'}
        >
            <TableComponent
                path="ciudades"
                refresh={refresh}
                Form={CiudadesForm}
                formTitle={'ciudad.form.edit-item'}
                columns={["province.country", "province","name"]}
            />
        </PageBody>
    );
};
