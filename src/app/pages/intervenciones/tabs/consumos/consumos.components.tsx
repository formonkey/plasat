import {useParams} from 'react-router-dom';
import {PageBody} from "../../../../elements/page-body";
import {InterventionConsume} from '../../intervention-consume';

export const ConsumosComponent = () => {
    const {id} = useParams();

    return (
        <div className="flex h-full flex-col">
            <PageBody
                title={'intervention.tab-label.consume'}
            >

                <InterventionConsume item={id}/>

            </PageBody>
        </div>
    );
};
