import React, { useContext } from 'react'
import Text from './Text'
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs'
import Input from './Input'
import text from '@/utils/text'
import { AuthContext } from '@/context/AuthContext'
import Link from 'next/link'
import { CurrentCrmContext } from '@/context/CurrentCrmContext'

export default function AdditionalEmployeeDetails({employee, expand, setExpand, edit, setEmployee}: {employee: Employee, expand: boolean, setExpand: React.Dispatch<React.SetStateAction<boolean>>, edit: boolean, setEmployee: React.Dispatch<React.SetStateAction<Employee>>}) {
  const {data} = useContext(AuthContext);
  const {crm} = useContext(CurrentCrmContext);
  return (
    <div>
        <div className="flex gap-4">
          <Link href={`/dashboard/c/${crm?.crmUuid}/employees`} className="flex gap-1 items-center text-lg bg-accent-color hover:bg-greenish transition-colors pr-2 text-black rounded-md font-semibold"><BsChevronLeft /> <div className='-translate-y-[1px]'><Text text={{eng: "Employees", swe: "Anställda"}} /></div> </Link>
          <button onClick={() => setExpand(!expand)} className="flex gap-2 items-center text-accent-color"><BsChevronRight className={expand ? "rotate-90" : "rotate-0" + " transition-transform"}/><Text text={expand ? {eng: "View Less", swe: "Visa Mindre"}:{eng: "View More", swe: "Visa Mer"}}/></button>
        </div>
        
        <div className={`${expand ? "h-26 pointer-events-auto opacity-100": "h-0 pointer-events-none opacity-0"} transition-all p-4 grid grid-cols-3`}>
          
          <div>
            <div className="grid grid-cols-2">
              <div className="flex flex-col mr-4 gap-0.5 mb-1">
                <div className="text-sm"><Text text={{eng: "Address", swe: "Adress"}} /></div>
                {edit ? <Input className='bg-background-dark border border-[#8D86C9] border-opacity-50 text-gray-200 w-full mr-2 placeholder:text-gray-500' placeholder={text({swe:"Adress", eng: "Address"}, data)} value={employee?.address || ""} onChange={(e) => setEmployee({...employee, address: e.target.value})}/> : employee.address ? employee.address : <span className={`${!employee?.address || employee.address === "" && "italic"} text-md`}>{employee.address === "" ? employee?.address : <Text text={{eng:"No address was found", swe: "Ingen adress hittades"}} />}</span>}
              </div>
              <div className="flex flex-col mr-4 gap-0.5 mb-1  justify-center">
                <div className="text-sm"><Text text={{eng: "Zip Code", swe: "Postkod"}} /></div>
                {edit ? <Input className='bg-background-dark border border-[#8D86C9] border-opacity-50 text-gray-200 w-full mr-2 placeholder:text-gray-500' placeholder={text({swe:"Postkod", eng: "Zip Code"}, data)} value={employee?.zipCode || ""} onChange={(e) => setEmployee({...employee, zipCode: e.target.value})}/> : employee.zipCode ? employee.zipCode : <span className={`${!employee?.zipCode || employee.zipCode === "" && "italic"} text-md`}>{employee.zipCode === "" ? employee?.zipCode : <Text text={{eng:"No zip code was found", swe: "Ingen postkod hittades"}} />}</span>}
              </div>
            </div>
            <div className="grid grid-cols-2">
              <div className="flex flex-col mr-4 gap-0.5 mb-1">
                <div className="text-sm"><Text text={{eng: "Country", swe: "Land"}} /></div>
                {edit ? <Input className='bg-background-dark border border-[#8D86C9] border-opacity-50 text-gray-200 w-full mr-2 placeholder:text-gray-500' placeholder={text({swe:"Land", eng: "Country"}, data)} value={employee?.country || ""} onChange={(e) => setEmployee({...employee, country: e.target.value})}/> : employee.country ? employee.country : <span className={`${!employee?.country || employee.country === "" && "italic"} text-md`}>{employee.country === "" ? employee?.country : <Text text={{eng:"No country was found", swe: "Inget land hittades"}} />}</span>}
              </div>
              <div className="flex flex-col mr-4 gap-0.5 mb-1  justify-center">
                <div className="text-sm"><Text text={{eng: "City", swe: "Stad"}} /></div>
                {edit ? <Input className='bg-background-dark border border-[#8D86C9] border-opacity-50 text-gray-200 w-full mr-2 placeholder:text-gray-500' placeholder={text({swe:"Stad", eng: "City"}, data)} value={employee?.city || ""} onChange={(e) => setEmployee({...employee, city: e.target.value})}/> : employee.city ? employee.city : <span className={`${!employee?.city || employee.city === "" && "italic"} text-md`}>{employee.city === "" ? employee?.city : <Text text={{eng:"No city was found", swe: "Ingen stad hittades"}} />}</span>}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2">
            <div className="flex flex-col mr-4 gap-0.5 mb-1 ">
              <div className="flex flex-col mr-4 gap-0.5 mb-1">
                <div className="text-sm"><Text text={{eng: "Social Security Number", swe: "Personnummer"}} /></div>
                {edit ? <Input className='bg-background-dark border border-[#8D86C9] border-opacity-50 text-gray-200 w-full mr-2 placeholder:text-gray-500' placeholder={text({swe:"Personnummer", eng: "Social Security Number"}, data)} value={employee?.ssn || ""} onChange={(e) => setEmployee({...employee, ssn: e.target.value})}/> : employee.ssn ? employee.ssn : <span className={`${!employee?.ssn || employee.ssn === "" && "italic"} text-md`}>{employee.ssn === "" ? employee?.ssn : <Text text={{eng:"No social security number was found", swe: "Inget personnummer hittades"}} />}</span>}
              </div>
              <div className="flex flex-col mr-4 gap-0.5 mb-1  justify-center">
                <div className="text-sm"><Text text={{eng: "Date Of Birth", swe: "Födelsedatum"}} /></div>
                {edit ? <Input type="date" className='bg-background-dark border border-[#8D86C9] border-opacity-50 text-gray-200 w-full mr-2 placeholder:text-gray-500' placeholder={text({swe:"Födelsedatum", eng: "Date Of Birth"}, data)} value={employee?.dateOfBirth || ""} onChange={(e) => setEmployee({...employee, dateOfBirth: e.target.value})}/> : employee.dateOfBirth ? employee.dateOfBirth : <span className={`${!employee?.dateOfBirth || employee.dateOfBirth === "" && "italic"} text-md`}>{employee.dateOfBirth === "" ? employee?.dateOfBirth : <Text text={{eng:"No date of birth was found", swe: "Inget födelsedatum hittades"}} />}</span>}
              </div>
            </div>
            <div className="flex flex-col mr-4 gap-0.5 mb-1">
              <div className="text-sm"><Text text={{eng: "Access", swe: "Behörigheter"}} /></div>

                <div className="flex flex-col mr-4 gap-0.5 mb-1">
                  <span className={`${employee?.canReportTime === null && employee.canReportTime && "italic"} text-md`}>{employee?.canReportTime !== null && employee?.canReportTime ? <Text text={{eng:"Can report time", swe: "Kan rapportera tid"}} /> : <Text text={{eng:"Cannot report time", swe: "Kan inte rapportera tid"}} />}</span>
                  <span className={`${employee?.isAdmin === null && employee.isAdmin && "italic"} text-md`}>{employee?.isAdmin !== null && employee?.isAdmin ? <Text text={{eng:"Administrator", swe: "Administratör"}} /> : ""}</span>
                </div>

            </div>
          </div>
          
          <div>
            <div className="grid grid-cols-2">
              <div className="flex flex-col mr-4 gap-0.5 mb-1">
                <div className="flex flex-col mr-4 gap-0.5 mb-1">
                <div className="text-sm"><Text text={{eng: "Driving License Class", swe: "Körkortsklass"}} /></div>
                  {edit ? <Input className='bg-background-dark border border-[#8D86C9] border-opacity-50 text-gray-200 w-full mr-2 placeholder:text-gray-500' placeholder={text({swe:"Körkortsklass", eng: "Driving License Class"}, data)} value={employee?.drivingLicenseClass || ""} onChange={(e) => setEmployee({...employee, drivingLicenseClass: e.target.value})}/> : employee.drivingLicenseClass ? employee.drivingLicenseClass : <span className={`${!employee?.drivingLicenseClass || employee.drivingLicenseClass === "" && "italic"} text-md`}>{employee.drivingLicenseClass === "" ? employee?.drivingLicenseClass : <Text text={{eng:"No driving license class was found", swe: "Ingen körkortsklass hittades"}} />}</span>}

                </div>
                <div className="flex flex-col mr-4 gap-0.5 mb-1  justify-center">
                  <div className="text-sm"><Text text={{eng: "Period Of Validity", swe: "Validitetsperiod"}} /></div>
                  {edit ? <Input className='bg-background-dark border border-[#8D86C9] border-opacity-50 text-gray-200 w-full mr-2 placeholder:text-gray-500' placeholder={text({swe:"Validitetsperiod", eng: "Period Of Validity"}, data)} value={employee?.periodOfValidity || ""} onChange={(e) => setEmployee({...employee, periodOfValidity: e.target.value})}/> : employee.periodOfValidity ? employee.periodOfValidity : <span className={`${!employee?.periodOfValidity || employee.periodOfValidity === "" && "italic"} text-md`}>{employee.periodOfValidity === "" ? employee?.periodOfValidity : <Text text={{eng:"No period of validity was found", swe: "Ingen validitetsperiod hittades"}} />}</span>}
                </div>
              </div>
            
              <div className="flex flex-col mr-4 gap-0.5 mb-1 ">
              <div className="flex flex-col mr-4 gap-0.5 mb-1">
                <div className="text-sm"><Text text={{eng: "Added", swe: "Tillagd"}} /></div>
                <span>{new Date(employee?.added || "").toLocaleDateString() + " " + new Date(employee?.added || "").toLocaleTimeString() || ""}</span>
              </div>
              <div className="flex flex-col mr-4 gap-0.5 mb-1  justify-center">
                <div className="text-sm"><Text text={{eng: "Updated", swe: "Uppdaterad"}} /></div> 
                <span>{new Date(employee?.updated || "").toLocaleDateString() + " " + new Date(employee?.updated || "").toLocaleTimeString() || ""}</span>
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}
