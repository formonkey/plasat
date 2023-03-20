import { useState } from 'react';
import { useDrawer } from '../../shared/drawer';
import { PageBody } from '../../elements/page-body';
import { ModosPagoForm } from './modos-pago-form';
import { TableComponent } from '../../elements/table-component/table.component';

export const ModosPago = () => {
    const { open, close } = useDrawer();
    const [refresh, setRefresh] = useState<string | null>(null);

    const handleNewAction = () => {
        open('modos-pago.form.new-item', <ModosPagoForm close={handleClose} />);
    };

    const handleClose = () => {
        setRefresh(Date.now().toString());
        close();
    };

    return (
        <PageBody
            newAction={handleNewAction}
            title={'modos-pago.text.title'}
            infoText={'modos-pago.text.infoText'}
            newActionTitle={'modos-pago.button.new'}
        >
            <TableComponent
                path="modos-pago"
                refresh={refresh}
                Form={ModosPagoForm}
                formTitle={'modos-pago.form.edit-item'}
                columns={["name"]}
            />
        </PageBody>
    );
};
