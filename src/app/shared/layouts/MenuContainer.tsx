import React, {useEffect, useState} from 'react';
import {Slide, ToastContainer} from 'react-toastify';
import {Link, Outlet} from 'react-router-dom';
import {LogoutIcon} from '@heroicons/react/outline';
import {classNames} from '../../utils';
import {MENU_NAVIGATION_LINKS} from './constants';
import {StoreKeys} from '../store';
import {useTranslation} from 'react-i18next';
import {Avatar} from '../../elements/avatar';
import {useCookies} from "../cookies";
import {useGlobalStore} from "../../stores/global";

export const MenuContainer = () => {
    const {t} = useTranslation();
    const {remove, get} = useCookies();
    const [path, setPath] = useState<string>('');
    const [profile, setProfile] = useState<any>({});
    // const [configuration, setConfiguration] = useState<any>({});

    const configuration = useGlobalStore((state: any) => state.configuration);
    const updateConfiguration = useGlobalStore((state: any) => state.updateConfiguration);

    const handelLogout = () => {
        remove(StoreKeys.Token, `.${process.env.REACT_APP_DOMAIN}`);
        remove(StoreKeys.Profile, `.${process.env.REACT_APP_DOMAIN}`);
        remove(StoreKeys.Configuration, `.${process.env.REACT_APP_DOMAIN}`);
        window.location.assign(`${process.env.REACT_APP_PROTOCOL}${process.env.REACT_APP_DOMAIN}${process.env.REACT_APP_PORT}/`);
    };

    useEffect(() => {
        if (get(StoreKeys.Token)) {
            console.log('get(StoreKeys.Profile)', get(StoreKeys.Profile));
            setProfile(get(StoreKeys.Profile));
            updateConfiguration(get(StoreKeys.Configuration));
        }
    }, []);


    return (
        <>
            <div className="flex flex-row h-full">
                <div className="fixed inset-y-0">
                    <div className="relative flex flex-col w-72 h-screen bg-primary">
                        <div className="flex-1 h-0  overflow-y-auto">
                            <div className="flex items-center">
                                <div
                                    className={
                                        'text-4xl font-bold bg-logo text-white'
                                    }
                                >
                                    <img
                                        className=" h-32"
                                        src="/menu-logo.svg"
                                        alt="Workflow"
                                    />
                                </div>
                            </div>
                            <nav className="mt-5">
                                {MENU_NAVIGATION_LINKS(configuration?.is_gas).map((item) =>
                                    !item.children ? (
                                        <div
                                            key={item.name}
                                        >
                                            {item.roles && item.roles.find(i => i === profile.rol) ? (
                                                <Link
                                                    onClick={() => setPath(item.href as string)}
                                                    to={item.href as string}
                                                    className={classNames(
                                                        (window.location.pathname ===
                                                            item.href || path === item.href)
                                                            ? 'bg-white text-gray-900 border-l-4 border-secondary'
                                                            : 'text-white hover:bg-white hover:text-gray-900 hover:border-l-4 hover:border-secondary',
                                                        'group flex items-center px-5 py-2 text-base font-thin'
                                                    )}
                                                >
                                                    {t(item.name)}{' '}
                                                </Link>
                                            ) : null}
                                        </div>
                                    ) : (
                                        <div
                                            key={item.name}
                                        >
                                            {
                                                item.roles && item.roles.find(i => i === profile.rol) ? (
                                                    <div className="pt-2"
                                                         key={item.name}
                                                    >
                                            <span
                                                className="text-tertiary mt-5 group uppercase flex items-center px-5 py-2 text-base font-medium rounded-md"
                                            >
                                                {t(item.name)}
                                            </span>
                                                        {item.children?.map((subItem) => (
                                                            <Link
                                                                key={subItem.name}
                                                                onClick={() => setPath(subItem.href as string)}
                                                                to={subItem.href as string}
                                                                className={classNames(
                                                                    (window.location
                                                                            .pathname ===
                                                                        subItem.href || path === subItem.href)
                                                                        ? 'bg-white text-gray-900 border-l-4 border-secondary'
                                                                        : 'text-white hover:bg-white hover:text-gray-900 hover:border-l-4 hover:border-secondary',
                                                                    'group flex items-center px-5 py-2 text-base font-thin'
                                                                )}
                                                            >
                                                                {t(subItem.name)}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                ) : null
                                            }
                                        </div>
                                    )
                                )}
                            </nav>
                        </div>
                        <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                            <div className="flex-shrink-0 group block">
                                <div className="flex items-center">
                                    {profile && (
                                        <>
                                            <Avatar
                                                name={
                                                    profile.name ||
                                                    profile.email
                                                }
                                            />
                                            <div className="ml-3">
                                                <p className="text-base font-thin text-gray-200">
                                                    {profile.name ||
                                                        profile.email}
                                                </p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex-shrink-0 text-white flex  p-4 ">
                            <button
                                onClick={handelLogout}
                                className="flex space-x-1 items-center flex-shrink-0 group block "
                            >
                                <LogoutIcon className="h-5 w-5 mx-2"/>
                                <span>{t('common.button.logout')}</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex ml-72 flex-col flex-1">
                    <Outlet/>
                </div>
            </div>

            <ToastContainer
                position="top-center"
                hideProgressBar
                autoClose={2000}
                transition={Slide}
                closeOnClick
            />
        </>
    );
};
