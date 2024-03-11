import Button from '@/components/Button';
import { CurrentCrmContext } from '@/context/CurrentCrmContext';
import request from '@/utils/request';
import React, { useContext, useEffect, useState } from 'react'
import CalendarPart from './CalendarPart';
import Text from '@/components/Text';

export interface MeetingWithDay {
    meetings: Meeting[],
    day: number,
}

export default function Calendar() {
    const {crm} = useContext(CurrentCrmContext);
    const [currentDate] = useState<Date>(new Date());
    const [activeDate, setActiveDate] = useState<Date>(new Date());
    const [meetingsWithDays, setMeetingsWithDays] = useState<MeetingWithDay[]>([]);

    const numDaysThisMonth = (y: number, m: number) => new Date(y, m, 0).getDate();

    const nextMonth = () => {
        setActiveDate(new Date(activeDate.getMonth() == 11 ? activeDate.getFullYear() + 1 : activeDate.getFullYear(), activeDate.getMonth() === 11 ? 0 : activeDate.getMonth() + 1))
    }
    const prevMonth = () => {
        setActiveDate(new Date(activeDate.getMonth() == 0 ? activeDate.getFullYear() - 1 : activeDate.getFullYear(), activeDate.getMonth() === 0 ? 11 : activeDate.getMonth() - 1))
    }

    const getMeetings = async () => {
        if(crm?.crmUuid) {
            const res = await request<{day: number, meeting: Meeting}[]>(`/meetings?crmUuid=${crm?.crmUuid}&year=${activeDate.getFullYear()}&month=${activeDate.getMonth()+1}`, {}, "GET")
            if (res.code === 200 && res.data) {
                const finalArr: MeetingWithDay[] = []
                const skipable: number[] = []
                for(let i = 0; i < res.data.length; i++){
                    if (!skipable?.includes(res.data[i].day)) skipable.push(res.data[i].day);
                    const day = finalArr.find(d => d.day === (res?.data && res?.data[i].day));
                    if (day){
                        day.meetings.push(res.data[i].meeting);
                    }else{
                        finalArr.push({day: res.data[i].day, meetings: [res.data[i].meeting]});
                    }
                }
                for(let i = 1; i < numDaysThisMonth(activeDate.getFullYear(), activeDate.getMonth() + 1); i++){
                    if (skipable.includes(i)) continue;
                    finalArr.push({day: i, meetings: []});
                }
                setMeetingsWithDays(finalArr.sort((a,b) => (a.day - b.day)))
            }
        }
    }

    useEffect(()=>{
        getMeetings();
    },[activeDate, crm])


  return (
    <div className='max-w-[1440px] m-auto p-4 flex flex-col gap-4'>

        <div className="flex justify-center items-center gap-4">
            <Button onClick={() => prevMonth()}><Text text={{eng: "Previous", swe: "Föregående"}} /></Button>
            {activeDate.getFullYear()} {matchMonth(activeDate.getMonth() + 1) }
            <Button onClick={() => nextMonth()}><Text text={{eng: "Next", swe: "Nästa"}} /></Button>
        </div>

        <ul className="grid grid-cols-auto-fill md:grid-cols-calendar gap-2 ">
            {meetingsWithDays.map((meetingWithDay) => (
                <CalendarPart key={meetingWithDay.day} meetingWithDay={meetingWithDay} currentDate={currentDate} activeDate={activeDate} />
            ))}
        </ul>
    </div>
  )
}




const matchMonth = (num: number): React.JSX.Element | "" => {
    switch (num) {
        case 1:
            return <Text text={{eng: "January", swe: "Januari"}} />;
        case 2:
            return <Text text={{eng: "February", swe: "Februari"}} />;
        case 3:
            return <Text text={{eng: "March", swe: "Mars"}} />;
        case 4:
            return <Text text={{eng: "April", swe: "April"}} />;
        case 5:
            return <Text text={{eng: "May", swe: "Maj"}} />;
        case 6:
            return <Text text={{eng: "June", swe: "Juni"}} />;
        case 7: 
            return <Text text={{eng: "July", swe: "Juli"}} />;
        case 8:
            return <Text text={{eng: "August", swe: "Augusti"}} />;
        case 9: 
            return <Text text={{eng: "September", swe: "September"}} />;
        case 10:
            return <Text text={{eng: "October", swe: "Oktober"}} />;
        case 11:
            return <Text text={{eng: "November", swe: "November"}} />;
        case 12:
            return <Text text={{eng: "December", swe: "December"}} />;
        default: 
            return "";
    }
}