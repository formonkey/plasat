import { useState } from 'react';
import { useDrawer } from '../../shared/drawer';
import { PageBody } from '../../elements/page-body';
import { PeriodicidadesForm } from './periodicidades-form';
import { TableComponent } from '../../elements/table-component/table.component';

export const Periodicidades = () => {
    const { open, close } = useDrawer();
    const [refresh, setRefresh] = useState<string | null>(null);

    const handleNewAction = () => {
        open(
            'periodicidad.form.new-item',
            <PeriodicidadesForm close={handleClose} />
        );
    };

    const handleClose = () => {
        setRefresh(Date.now().toString());
        close();
    };

    return (
        <PageBody
            newAction={handleNewAction}
            title={'periodicidad.text.title'}
            infoText={'periodicidad.text.infoText'}
            newActionTitle={'periodicidad.button.new'}
        >
            <TableComponent
                path="periodicidades"
                refresh={refresh}
                Form={PeriodicidadesForm}
                formTitle={'periodicidad.form.edit-item'}
                columns={["name", "numero_meses"]}
            />
        </PageBody>
    );
};
