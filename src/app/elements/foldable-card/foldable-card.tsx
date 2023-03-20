import {Disclosure} from '@headlessui/react';
import {useTranslation} from 'react-i18next';

import {ChevronDownIcon, ChevronRightIcon, DotsHorizontalIcon, TrashIcon} from '@heroicons/react/outline';
import {Dropdown} from '../dropdown';
import {FoldableCardTypes} from './types';
import {useDrawer} from '../../shared/drawer';
import {Tree} from '../../../assets/icons/Tree';
import {useModal} from '../../shared/modals';
import {Button} from '../button';
import {classNames} from '../../utils';

export const FoldableCard = ({
                                 item,
                                 Form,
                                 count,
                                 Detail,
                                 doItem,
                                 doDelete,
                                 children,
                                 forceOpen = false,
                                 name = 'name',
                             }: FoldableCardTypes) => {
    const {t} = useTranslation();
    const {open: openDrawer} = useDrawer();
    const {open: openModal, close: closeModal} = useModal();

    console.log('item', item);

    const handleEdit = () => {
        if (Form) {
            openDrawer('team.form.edit-item', <Form item={item}/>);
        }
    };

    const handleDelete = (id: string | number) => {
        if (id && doDelete) {
            doDelete(id);

            setTimeout(() => {
                closeModal();
            }, 300);
        }
    };

    const openModalDelete = (id: string | number) => {
        openModal('error', {
            onAccept: () => handleDelete(id),
            title: t('foldable-card.modal.delete-title'),
            message: t('foldable-card.modal.delete-message')
        });
    };

    return (
        <div
            className="box-border flex flex-col items-start px-4 w-full bg-white rounded border border-gray-light mb-[12px]">

            <Disclosure>
                {({open}) => (
                    <>
                        <div className="flex justify-between w-full items-center">

                            <Disclosure.Button
                                className={classNames(
                                    'flex w-full py-[10px]',
                                    Detail ? 'h-[62px]' : 'h-[48px]'
                                )}
                            >
                                <div
                                    className={classNames(
                                        Detail ? 'mt-[10px]' : 'mt-[5px]'
                                    )}
                                >
                                    {open || forceOpen ? (
                                        <ChevronDownIcon className="w-4 h-4  text-gray-400"/>
                                    ) : (
                                        <ChevronRightIcon className="w-4 h-4 text-gray-400"/>
                                    )}
                                </div>

                                <div className="flex flex-col">
                                    <div
                                        className={classNames(
                                            'flex items-center space-x-[8px] ml-2',
                                            Detail ? '' : ''
                                        )}
                                    >

                                        <div
                                            className={"mt-[4px] font-bold text-black leading-6 text-[16px] "}>{
                                            item.equipo
                                                ? (item.equipo[name] + " (" + (item?.ubicacion || "-")  + ")")
                                                : item[name]
                                        }</div>

                                        {item.id && (
                                            <div className="flex items-center mt-[4px] space-x-[8px]">
                                                <div className="text-gray text-sm">
                                                    {count || 0}
                                                </div>

                                                <div className="text-gray">
                                                    <Tree/>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {Detail && (
                                        <div
                                            className="mt-[3px] mb-[16px] flex items-center space-x-[8px] ml-2 not-italic font-light text-xs leading-4 text-gray-darker">
                                            <Detail item={item}/>
                                        </div>
                                    )}
                                </div>
                            </Disclosure.Button>

                            <div className="">
                                {item.id ? (
                                    Form ? (
                                        <Dropdown
                                            items={
                                                doItem
                                                    ? [
                                                        {
                                                            label: t(
                                                                'common.label.show'
                                                            ),
                                                            action: () =>
                                                                doItem ? doItem(
                                                                    item.id
                                                                ) : null
                                                        },
                                                        {
                                                            label: t(
                                                                'common.label.edit'
                                                            ),
                                                            action: () =>
                                                                handleEdit()
                                                        },
                                                        {
                                                            label: t(
                                                                'common.label.delete'
                                                            ),
                                                            action: () =>
                                                                openModalDelete(
                                                                    item.id
                                                                )
                                                        }
                                                    ]
                                                    : [
                                                        {
                                                            label: t(
                                                                'common.label.edit'
                                                            ),
                                                            action: () =>
                                                                handleEdit()
                                                        },
                                                        {
                                                            label: t(
                                                                'common.label.delete'
                                                            ),
                                                            action: () =>
                                                                openModalDelete(
                                                                    item.id
                                                                )
                                                        }
                                                    ]
                                            }
                                        >
                                            <DotsHorizontalIcon
                                                className="h-5 w-5 z-0"
                                                aria-hidden="true"
                                            />
                                        </Dropdown>
                                    ) : doDelete ? (
                                        <Button
                                            icon={
                                                <TrashIcon className="h-4 w-4 text-danger"/>
                                            }
                                            variant="transparent"
                                            onClick={() =>
                                                openModalDelete(item.id)
                                            }
                                        />
                                    ) : null
                                ) : null}
                            </div>
                        </div>
                        {(open || forceOpen) && (
                            <div className="mt-[16px] w-full">{children}</div>
                        )}
                    </>
                )}
            </Disclosure>
        </div>
    );
};
