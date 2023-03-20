import {useState} from 'react';
import {useDrawer} from '../../shared/drawer';
import {PageBody} from '../../elements/page-body';
import {TiposIntervencionForm} from './tipos-intervencion-form';
import {TableComponent} from '../../elements/table-component/table.component';
import { Table } from '../../elements/table';

export const TiposIntervencion = () => {
    const {open, close} = useDrawer();
    const [refresh, setRefresh] = useState<string | null>(null);

    const handleNewAction = () => {
        open(
            'tipos-intervencion.form.new-item',
            <TiposIntervencionForm close={handleClose}/>
        );
    };

    const handleClose = () => {
        setRefresh(Date.now().toString());
        close();
    };

    return (
        <PageBody
            newAction={handleNewAction}
            title={'tipos-intervencion.text.title'}
            infoText={'tipos-intervencion.text.infoText'}
            newActionTitle={'tipos-intervencion.button.new'}
        >
            <Table
                path="/tipos-intervencion"
                refresh={refresh}
                callBeforeDrawerClosed={handleClose}
                onDelete={handleClose}
                Form={TiposIntervencionForm}
                withPagination
                headers={[
                    {
                        key: 'name',
                        label: 'common.form-label.name'
                    },
                    {
                        key: 'is_preventivo',
                        label: 'is_preventivo',
                    },
                    {
                        key: 'color',
                        label: 'color',
                        type: 'color'
                    },
                ]}
            />
        </PageBody>
    );
};
