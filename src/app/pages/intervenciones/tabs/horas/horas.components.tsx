import {useParams} from 'react-router-dom';
import {PageBody} from "../../../../elements/page-body";
import { InterventionHours } from '../../intervention-hours';

export const HorasComponent = () => {
    const {id} = useParams();

    return (
        <div className="flex h-full flex-col">
            <PageBody
                title={'intervention.tab-label.hours'}
            >

                <InterventionHours item={id}/>

            </PageBody>
        </div>
    );
};
