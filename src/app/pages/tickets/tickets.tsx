import { useState } from 'react';
import { useDrawer } from '../../shared/drawer';
import { PageBody } from '../../elements/page-body';
import { TicketsForm } from './tickets-form';
import { TableComponent } from '../../elements/table-component/table.component';

export const Tickets = () => {
    const { open, close } = useDrawer();
    const [refresh, setRefresh] = useState<string | null>(null);

    const handleNewAction = () => {
        open('ticket.form.new-item', <TicketsForm close={handleClose} />);
    };

    const handleClose = () => {
        setRefresh(Date.now().toString());
        close();
    };

    return (
        <PageBody
            newAction={handleNewAction}
            title={'ticket.text.title'}
            infoText={'ticket.text.infoText'}
            newActionTitle={'ticket.button.new'}
        >
            <TableComponent
                path="tickets"
                refresh={refresh}
                Form={TicketsForm}
                formTitle={'ticket.form.edit-item'}
            />
        </PageBody>
    );
};
