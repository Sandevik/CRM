import TaskList from '@/components/TaskList';
import Meetings from '../../../../components/Meetings';
import Navbar from '../../../../components/Navbar';
import { useContext, useEffect, useState } from 'react';
import { CurrentCrmContext } from '@/context/CurrentCrmContext';
import request from '@/utils/request';
import Text from '@/components/Text';
import Button from '@/components/Button';
import { AuthContext } from '@/context/AuthContext';
import Screen from '@/components/Screen';

export default function Index() {
  const {crm} = useContext(CurrentCrmContext);
  const {data} = useContext(AuthContext);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [focusedTask, setFocusedTask] = useState<Task | null>(null);
  const [companyDetails, setCompanyDetails] = useState<Company | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(()=>{
    (async () => {
      await fetchTasks();
      await fetchCompanyDetails();
      setLoading(false);
    })();
  },[crm])

  const fetchTasks = async () => {
    if (crm?.crmUuid) {
      let res = await request<Task[]>(`/tasks/by-crm?crmUuid=${crm?.crmUuid}`, {}, "GET");
      if (res.code === 200 && res.data) {
        setTasks(res.data);
      }
    }
  }

  const fetchCompanyDetails = async () => {
    if (crm?.crmUuid) {
      let res = await request<Company>(`/companies?crmUuid=${crm?.crmUuid}`, {}, "GET");
      if (res.code === 200 && res.data) {
        setCompanyDetails(res.data);
      }
    }
  }

  return (
    <Screen>
      <main className="flex-grow">
        <div className="p-2">

          <div>
            Hej {data?.user?.firstName}!
          </div>

          <div>
            {!companyDetails 
            ? "Du verkar inte ha några företagsdetaljer än"
            : "Du har företagsdetaljer"
              }
          </div>
        
          <div className="flex flex-col gap-2 my-2">
            <h3><Text text={{swe: "Uppgifter", eng: "Tasks"}} /></h3>
            <TaskList loading={loading} showCustomers={true} tasks={tasks} refetchTasks={fetchTasks} focusTask={setFocusedTask}/>
          </div>
          <br />
          Some statistics?
          <br />
          Some info?  
          <br />
          num of meetings today
          <br />
          things todo from different customers
          <br />
          wishlist for functions that customers want (votable) and status for wishlist votes
          <br />
          A box to put in suggestions and a view of all suggestions this customer has proposed / All suggestions and ability to upvote all suggestions exept for ones own
          <br />
          Suggestions:
          <br />
          Title, text, upvotes / likes, visible (if the user wants a suggestion to be visible to other customers), status (if it is being added, is added, not added..), added_date
          <Button>Ooga</Button>
      </div>
      </main>
    </Screen>
  )
}
