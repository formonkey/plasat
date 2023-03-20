import {AgendaComponent} from './agenda.component';
import {useTranslation} from "react-i18next";
import {Avatar} from "../../elements/avatar";
import {StoreKeys} from "../../shared/store";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useCookies} from "../../shared/cookies";

export const Agenda = ({ onEdit, setSelectedDate, selectedDate, data }: any) => {
    const {get: getCookie} = useCookies();
    const {t} = useTranslation();
    const navigate = useNavigate();
    const [profile, setProfile] = useState<any>({});

    const handleEdit = (event: any) => {
        onEdit(event);
    };

    useEffect(() => {
        if (getCookie(StoreKeys.Token)) {
            setProfile(getCookie(StoreKeys.Profile));
        }
    }, []);

    return (
        <main className="flex flex-col h-screen pt-8">
            <div className={"flex justify-between px-4"}>
                <h1 className="text-4xl bold text-gray-900">
                    {t('agenda.text.title')}
                </h1>
                <div className={"cursor-pointer"} onClick={() => navigate("perfil")}>
                    <Avatar name={profile.name || profile.email}/>
                </div>
            </div>
            <AgendaComponent selectedDate={selectedDate} data={data} onEdit={handleEdit} setSelectedDate={setSelectedDate}/>
        </main>
    );
};
