import {useState} from 'react';
import {useDrawer} from '../../shared/drawer';
import {PageBody} from '../../elements/page-body';
import {PaisesForm} from './paises-form';
import {TableComponent} from '../../elements/table-component/table.component';
import {Table} from "../../elements/table";

export const Paises = () => {
    const {open, close} = useDrawer();
    const [refresh, setRefresh] = useState<string | null>(null);

    const handleNewAction = () => {
        open('pais.form.new-item', <PaisesForm close={handleClose}/>);
    };

    const handleClose = () => {
        setRefresh(Date.now().toString());
        close();
    };

    return (
        <PageBody
            newAction={handleNewAction}
            title={'pais.text.title'}
            infoText={'pais.text.infoText'}
            newActionTitle={'pais.button.new'}
        >
            <Table
                path="/paises"
                deletePath="/paises"
                Form={PaisesForm}
                withPagination
                refresh={refresh}
                headers={[
                    {
                        key: 'name',
                        label: 'pais.text.title',
                    },
                ]}
            />
        </PageBody>
    );
};
