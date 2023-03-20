import {useEffect, useState} from 'react';
import {toast} from 'react-toastify';
import {useTranslation} from 'react-i18next';
import {useHttpClient} from '../../shared/http-client';
import {StoreKeys, useStore} from "../../shared/store";


export const Products = () => {
        const {t} = useTranslation();
        const {api, state} = useHttpClient();
        const {get} = useStore();

        const [cliente, setCliente] = useState<any | null>(null);
        const [productos, setProductos] = useState<any[] | null>(null);

        useEffect(() => {
            const user = get(StoreKeys.User);
            if (user) {
                setCliente(get(StoreKeys.User))
                api('/plannsat/productos/', 'GET');
            } else {
                api('/plannsat/productos/', 'GET');
                // navigate('/registro');
            }
        }, []);


        const getProducto = (producto: any) => {
            // console.log('cliente', cliente);
            // console.log('producto', producto.id);
            api(`/plannsat/clientes/${cliente.tenant.id}/`, 'PATCH', {
                producto: producto.id,
                name: cliente.tenant.name,
                schema_name: cliente.tenant.schema_name
            });
            api(`/plannsat/productos/${producto.id}/create_subscription/`, 'POST', {
                customer: cliente.tenant.stripe_id,
                name: cliente.tenant.name,
                schema_name: cliente.tenant.schema_name,
                email: cliente.tenant.email,
            });
        }

        useEffect(() => {
                if (state.data) {
                    if (state.path.includes('plannsat/productos')) {
                        if ("results" in state.data) {
                            console.log('state.data', state.data.results);
                            setProductos(state.data.results)
                        } else {
                            window.location.href = state.data.url
                        }
                    }
                }

                if (state.error) {
                    toast.error(state.error.detail);
                }
            }, [state]
        )
        ;

        return (
            <div className="min-h-full flex flex-col justify-center py-12 px-2 sm:px-6 lg:px-8 bg-[#ebefff] w-full">
                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
                    <div className="space-y-8">
                        <div className="sm:mx-auto sm:w-full sm:max-w-md">
                            <img
                                className="h-32"
                                src="/logo.svg"
                                alt="Workflow"
                            />
                        </div>

                        <div className="sm:w-full">
                            <h3
                                className={
                                    'text-logo font-bold mb-2 text-2xl'
                                }
                            >
                                {t('productos.user.title')}
                            </h3>
                        </div>

                        <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-2">
                            {productos?.map((producto: any, index: number) => (
                                <div key={index}
                                     className="flex flex-col justify-between p-[24px] shadow-md rounded-2xl bg-white">
                                    <div className={"text-logo font-bold text-[24px]"}>{producto.nombre}</div>
                                    <div
                                        className={"text-[#5c7cff] font-normal text-[18px] line-through"}>{(producto.precio * 2).toFixed(2)}</div>
                                    <div className={"text-logo font-bold text-[40px]"}>{producto.precio}€</div>
                                    <div className={"text-logo font-normal text-[12px] -mt-3"}>/mes</div>
                                    <div className={"text-logo font-semibold text-[16px] pt-8"}>{producto.descripcion}</div>
                                    <div
                                        className={"font-bold text-[16px] bg-logo rounded-full flex justify-center items-center mt-4 cursor-pointer"}
                                        onClick={() => getProducto(producto)}
                                    >
                                        <div className={"py-2 px-4 text-white"}>Probar gratis</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <label className="block text-sm font-normal text-gray-700">
                            {t('productos.user.description')}
                        </label>

                    </div>
                </div>
            </div>
        );
    }
;
