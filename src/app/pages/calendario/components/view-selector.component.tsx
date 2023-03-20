import { Calendar } from '../../../../assets/icons/Calendar';
import { Tree } from '../../../../assets/icons/Tree';
import { classNames } from '../../../utils';
import { useLocation, useNavigate } from 'react-router-dom';

export const ViewSelectorComponent = ({ selected }: { selected: string }) => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <div className="flex items-center rounded-md shadow-sm md:items-stretch">
            <button
                onClick={() => navigate(`/calendario?selected=${selected}`)}
                type="button"
                className={classNames(
                    'flex items-center justify-center rounded-l-md border border-r-0 border-gray-300 bg-gray-light py-2 pl-3 pr-4 text-gray-400 hover:text-gray-500 focus:relative md:w-12 md:px-2 md:hover:bg-gray-50',
                    location.pathname === '/calendario'
                        ? 'text-black'
                        : 'text-gray-400'
                )}
            >
                <span className="sr-only">Previous month</span>
                <Calendar
                    color={
                        location.pathname === '/calendario'
                            ? '#000000'
                            : '#6b7280'
                    }
                />
            </button>
            <button
                onClick={() => navigate(`/intervenciones?selected=${selected}`)}
                type="button"
                className={classNames(
                    'flex items-center justify-center rounded-r-md border border-gray-300 bg-gray-light py-2 pl-4 pr-3 text-gray-400 hover:text-gray-500 focus:relative md:w-12 md:px-2 md:hover:bg-gray-50',
                    location.pathname === '/intervenciones'
                        ? 'text-black'
                        : 'text-gray-400'
                )}
            >
                <span className="sr-only">Next month</span>
                <Tree
                    color={
                        location.pathname === '/intervenciones'
                            ? '#000000'
                            : '#6b7280'
                    }
                />
            </button>
        </div>
    );
};
