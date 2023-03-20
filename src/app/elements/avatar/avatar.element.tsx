import React, { useEffect, useState } from 'react';

export const Avatar = ({
    name,
    size = 'md'
}: {
    name: string;
    size?: 'xl' | 'md' | 'sm';
}) => {
    const [names, setNames] = useState<string[]>([]);

    useEffect(() => {
        if (name) {
            const temp = name.split(' ');
            setNames([
                temp[0].charAt(0),
                temp[1] ? temp[1].charAt(0) : temp[0].charAt(1)
            ]);
        }
    }, [name]);

    return size === 'xl' ? (
        <span className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gray-500">
            <span className="text-4xl font-light leading-none text-white">
                {names.join('')}
            </span>
        </span>
    ) : size === 'md' ? (
        <span className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-gray-500">
            <span className="text-lg font-medium leading-none text-white">
                {names.join('')}
            </span>
        </span>
    ) : (
        <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-gray-500">
            <span className="font-medium leading-none text-white">
                {names.join('')}
            </span>
        </span>
    );
};
