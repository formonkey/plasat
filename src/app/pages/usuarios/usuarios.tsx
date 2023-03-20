import { useState } from 'react';
import { useDrawer } from '../../shared/drawer';
import { PageBody } from '../../elements/page-body';
import { UsuariosForm } from './usuarios-form';
import { TableComponent } from '../../elements/table-component/table.component';

export const Usuarios = () => {
    const { open, close } = useDrawer();
    const [refresh, setRefresh] = useState<string | null>(null);

    const handleNewAction = () => {
        open('usuarios.form.new-item', <UsuariosForm close={handleClose} />);
    };

    const handleClose = () => {
        setRefresh(Date.now().toString());
        close();
    };

    return (
        <PageBody
            newAction={handleNewAction}
            title={'usuarios.text.title'}
            infoText={'usuarios.text.infoText'}
            newActionTitle={'usuarios.button.new'}
        >
            <TableComponent
                path="users"
                refresh={refresh}
                Form={UsuariosForm}
                formTitle={'usuarios.form.edit-item'}
                columns={['first_name', 'last_name', 'rol', 'email']}
            />
        </PageBody>
    );
};
