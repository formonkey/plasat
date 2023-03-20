import { useState } from 'react';
import { useDrawer } from '../../shared/drawer';
import { PageBody } from '../../elements/page-body';
import { ModoPagoForm } from './modo-pago-form';
import { TableComponent } from '../../elements/table-component/table.component';

export const ModoPago = () => {
    const { open, close } = useDrawer();
    const [refresh, setRefresh] = useState<string | null>(null);

    const handleNewAction = () => {
        open('estado.form.new-item', <ModoPagoForm close={handleClose} />);
    };

    const handleClose = () => {
        setRefresh(Date.now().toString());
        close();
    };

    return (
        <PageBody
            newAction={handleNewAction}
            title={'estado.text.title'}
            infoText={'estado.text.infoText'}
            newActionTitle={'estado.button.new'}
        >
            <TableComponent
                path="modos-pago"
                refresh={refresh}
                Form={ModoPagoForm}
                formTitle={'estado.form.edit-item'}
            />
        </PageBody>
    );
};
