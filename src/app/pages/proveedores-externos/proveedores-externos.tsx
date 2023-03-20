import {useState} from 'react';
import {useDrawer} from '../../shared/drawer';
import {PageBody} from '../../elements/page-body';
import {ProveedoresExternosForm} from './proveedores-externos-form';
import {TableComponent} from '../../elements/table-component/table.component';
import {Table} from "../../elements/table";

export const ProveedoresExternos = () => {
    const {open, close} = useDrawer();
    const [refresh, setRefresh] = useState<string | null>(null);

    const handleNewAction = () => {
        open(
            'proveedores.form.new-item',
            <ProveedoresExternosForm close={handleClose}/>
        );
    };

    const handleClose = () => {
        setRefresh(Date.now().toString());
        close();
    };

    return (
        <PageBody
            newAction={handleNewAction}
            title={'proveedores.text.title'}
            infoText={'proveedores.text.infoText'}
            newActionTitle={'proveedores.button.new'}
        >
            <Table
                path="/proveedores-externo"
                refresh={refresh}
                callBeforeDrawerClosed={handleClose}
                Form={ProveedoresExternosForm}
                withPagination
                headers={[
                        {
                        key: 'name',
                        label: 'common.label.name',
                    },
                    {
                        key: 'province',
                        label: 'common.label.province',
                    },
                    {
                        key: 'city',
                        label: 'common.label.city',
                    },
                ]}
            />
        </PageBody>
    );
};
