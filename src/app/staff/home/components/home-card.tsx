import React from 'react';

import { classNames, noop } from '../../../utils';

export const HomeCard = ({ children, action, onAction = noop }: any) => (
    <div className={classNames(
        'w-full border border-gray-300 rounded-md bg-white h-auto',
        action ? 'p-0' : 'p-4'
    )}>
        <div className={classNames(action ? 'p-4' : 'p-0')}>
            {children}
        </div>

        {action && (
            <div
                onClick={onAction}
                className="border-t border-gray-300 w-full p-4 cursor-pointer text-[#2C62B4] text-[16px] leading-[24px] font-regular"
            >
                {action}
            </div>
        )}
    </div>
)
