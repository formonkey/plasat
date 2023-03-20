/* This example requires Tailwind CSS v2.0+ */
import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';

import { classNames } from '../../utils';

export const Dropdown = ({
    children,
    items = []
}: {
    children: JSX.Element;
    items: { label: string; action: () => void }[];
}) => {
    return (
        <Menu as="div" className="relative inline-block text-left">
            <div style={{zIndex: 100}}>
                <Menu.Button style={{zIndex: 100}}>{children}</Menu.Button>
            </div>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none" style={{zIndex: 200}}>
                    <div className="py-1">
                        {items.map((item, index) => (
                            <Menu.Item key={index}>
                                {({ active }) => (
                                    <span
                                        className={classNames(
                                            active
                                                ? 'bg-gray-100 text-gray-900'
                                                : 'text-gray-700',
                                            'block px-4 py-2 text-sm'
                                        )}
                                        onClick={item.action}
                                    >
                                        {item.label}
                                    </span>
                                )}
                            </Menu.Item>
                        ))}
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    );
};
