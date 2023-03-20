import { useState } from 'react';
import { useDrawer } from '../../shared/drawer';
import { PageBody } from '../../elements/page-body';
import { EstadosForm } from './estados-form';
import { TableComponent } from '../../elements/table-component/table.component';

export const Estados = () => {
    const { open, close } = useDrawer();
    const [refresh, setRefresh] = useState<string | null>(null);

    const handleNewAction = () => {
        open('estado.form.new-item', <EstadosForm close={handleClose} />);
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
                path="estados"
                refresh={refresh}
                Form={EstadosForm}
                formTitle={'estado.form.edit-item'}
            />
        </PageBody>
    );
};
