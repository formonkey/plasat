import { useState } from 'react';
import { useDrawer } from '../../shared/drawer';
import { PageBody } from '../../elements/page-body';
import { ProvinciasForm } from './provincias-form';
import { TableComponent } from '../../elements/table-component/table.component';

export const Provincias = () => {
    const { open, close } = useDrawer();
    const [refresh, setRefresh] = useState<string | null>(null);

    const handleNewAction = () => {
        open('provincia.form.new-item', <ProvinciasForm close={handleClose} />);
    };

    const handleClose = () => {
        setRefresh(Date.now().toString());
        close();
    };

    return (
        <PageBody
            newAction={handleNewAction}
            title={'provincia.text.title'}
            infoText={'provincia.text.infoText'}
            newActionTitle={'provincia.button.new'}
        >
            <TableComponent
                path="provincias"
                refresh={refresh}
                Form={ProvinciasForm}
                formTitle={'provincia.form.edit-item'}
                limit={20}
                columns={["country","name"]}
            />
        </PageBody>
    );
};
