import { useContext } from 'react';

import { ModalContext } from '../contexts/index';

export const useModal = () => {
    const context = useContext(ModalContext);

    if (!context) {
        throw new Error('Use modal context instead of modal provider');
    }

    return context;
};
