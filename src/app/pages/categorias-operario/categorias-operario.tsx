import {useState} from 'react';
import {useDrawer} from '../../shared/drawer';
import {PageBody} from '../../elements/page-body';
import {CategoriasOperarioForm} from './categorias-operario-form';
import {Table} from "../../elements/table";

export const CategoriasOperarios = () => {
    const {open, close} = useDrawer();
    const [refresh, setRefresh] = useState<string | null>(null);

    const handleNewAction = () => {
        open(
            'categorias-operario.form.new-item',
            <CategoriasOperarioForm close={handleClose}/>
        );
    };

    const handleClose = () => {
        setRefresh(Date.now().toString());
        close();
    };

    return (
        <PageBody
            newAction={handleNewAction}
            title={'categorias-operario.text.title'}
            infoText={'categorias-operario.text.infoText'}
            newActionTitle={'categorias-operario.button.new'}
        >
            <Table
                path="/categorias-operario"
                refresh={refresh}
                callBeforeDrawerClosed={handleClose}
                Form={CategoriasOperarioForm}
                withPagination
                headers={[
                    {
                        key: 'name',
                        label: 'clients.table.name'
                    },
                    {
                        key: 'precio_hora',
                        label: 'clients.table.precio_hora',
                        type: 'currency'
                    },
                ]}
            />
        </PageBody>
    );
};
