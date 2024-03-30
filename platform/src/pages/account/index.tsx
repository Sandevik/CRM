import SignOutBtn from '@/components/SignOutBtn'
import Text from '@/components/Text';
import { AuthContext } from '@/context/AuthContext';
import request from '@/utils/request';
import React, { useContext, useEffect, useState } from 'react'

export default function Index() {
  const {data} = useContext(AuthContext);
  const [language, setLanguage] = useState<string>("eng");

  useEffect(()=>{
    setLanguage(data?.user?.preferredLanguage || "eng");
  },[data])

  const updateLanguage = async () => {
    if (data?.user && data?.user.uuid) {
        const res = await request("/users/update-language", {userUuid: data.user.uuid, language})
        if (res.code === 200) {
          alert(res.message);
        }
    }
  }

  useEffect(()=>{
    updateLanguage();
  },[language])


  return (
    <main className="p-2">
        <SignOutBtn />
        <div className="flex flex-col gap-2 w-32">
          <label htmlFor="language"><Text text={{swe: "Språk", eng: "Language"}} /></label>
          <select name="language" value={language} onChange={(e) => setLanguage(e.target.value)} className="bg-background-light rounded-md">
            <option value="eng">English</option>
            <option value="swe">Svenska</option>
          </select>
        </div>
    </main>
  )
}
