import {useState} from 'react';

import {useDrawer} from '../../shared/drawer';
import {PageBody} from '../../elements/page-body';
import {TypeEquipmentBody} from './type-equipment-body';
import {TypeEquipmentForm} from "./type-equipment-form";

export const TypeEquipment = () => {
    const {open, close} = useDrawer();
    const [newData, setNewData] = useState<any>();

    // const handleNewAction = () => {
    //     setNewData(true);
    //
    //     setTimeout(() => {
    //         setNewData(false);
    //     }, 1000);
    // };

    const handleNewAction = () => {
        open(
            'tipo-equipo.form.new-item',
            <TypeEquipmentForm close={handleClose}/>
        );
    };

    const handleClose = () => {
        close();
        window.location.reload();
    };

    return (
        <PageBody
            newAction={handleNewAction}
            title={'type-equipment.common.title'}
            infoText={'type-equipment.common.add-new'}
            newActionTitle={'type-equipment.common.add-new'}
        >
            <TypeEquipmentBody newData={newData} close={handleClose}/>
        </PageBody>
    );
};
