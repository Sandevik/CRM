import React from 'react'
import Text from './Text'
import { BsChevronRight } from 'react-icons/bs'

export default function AdditionalEmployeeDetails({employee, expand, setExpand}: {employee: Employee | null, expand: boolean, setExpand: React.Dispatch<React.SetStateAction<boolean>>}) {
  return (
    <div>
        <button onClick={() => setExpand(!expand)} className="flex gap-2 items-center text-accent-color"><BsChevronRight className={expand ? "rotate-90" : "rotate-0" + " transition-transform"}/><Text text={expand ? {eng: "View Less", swe: "Visa Mindre"}:{eng: "View More", swe: "Visa Mer"}}/></button>
        <div className={`${expand ? "h-26 pointer-events-auto opacity-100": "h-0 pointer-events-none opacity-0"} transition-all p-4 grid grid-cols-3`}>
          
          <div>
            <div className="grid grid-cols-2">
              <div className="flex flex-col">
                <div className="text-sm"><Text text={{eng: "Address", swe: "Adress"}} /></div>
                <span className={`${!employee?.address && "italic"} text-md`}>{employee?.address || <Text text={{eng:"No address was found", swe: "Ingen address hittades"}} />}</span>
              </div>
              <div className="flex flex-col mt-2">
                <div className="text-sm"><Text text={{eng: "Zip Code", swe: "Postkod"}} /></div>
                <span className={`${!employee?.zipCode && "italic"} text-md`}>{employee?.zipCode || <Text text={{eng:"No zip code was found", swe: "Ingen postkod hittades"}} />}</span>
              </div>
            </div>
            <div className="grid grid-cols-2">
              <div className="flex flex-col">
                <div className="text-sm"><Text text={{eng: "Country", swe: "Land"}} /></div>
                <span className={`${!employee?.country && "italic"} text-md`}>{employee?.country || <Text text={{eng:"No country was found", swe: "Inget land hittades"}} />}</span>
              </div>
              <div className="flex flex-col mt-2">
                <div className="text-sm"><Text text={{eng: "City", swe: "Stad"}} /></div>
                <span className={`${!employee?.city && "italic"} text-md`}>{employee?.city || <Text text={{eng:"No city was found", swe: "Ingen stad hittades"}} />}</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2">
            <div className="flex flex-col ">
              <div className="flex flex-col">
                <div className="text-sm"><Text text={{eng: "Social Security Number", swe: "Personnummer"}} /></div>
                <span className={`${!employee?.ssn && "italic"} text-md`}>{employee?.ssn || <Text text={{eng:"No social security number was found", swe: "Inget personnummer hittades"}} />}</span>
              </div>
              <div className="flex flex-col mt-2">
                <div className="text-sm"><Text text={{eng: "Date Of Birth", swe: "Födelsedatum"}} /></div>
                <span className={`${!employee?.dateOfBirth && "italic"} text-md`}>{employee?.dateOfBirth || <Text text={{eng:"No date of birth was found", swe: "Inget födelsedagsdatum hittades"}} />}</span>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="text-sm"><Text text={{eng: "Access", swe: "Behörigheter"}} /></div>

                <div className="flex flex-col">
                  <span className={`${employee?.canReportTime === null && employee.canReportTime && "italic"} text-md`}>{employee?.canReportTime !== null && employee?.canReportTime ? <Text text={{eng:"Can report time", swe: "Kan rapportera tid"}} /> : <Text text={{eng:"Cannot report time", swe: "Kan inte rapportera tid"}} />}</span>
                  <span className={`${employee?.isAdmin === null && employee.isAdmin && "italic"} text-md`}>{employee?.isAdmin !== null && employee?.isAdmin ? <Text text={{eng:"Administrator", swe: "Administratör"}} /> : ""}</span>
                </div>

            </div>
          </div>
          
          <div>
            <div className="grid grid-cols-2">
              <div className="flex flex-col">
                <div className="flex flex-col">
                <div className="text-sm"><Text text={{eng: "Driving License Class", swe: "Körkortsklass"}} /></div>
                  <span className={`${!employee?.drivingLicenseClass && "italic"} text-md`}>{employee?.drivingLicenseClass || <Text text={{eng:"No driving license class was found", swe: "Ingen körkortsklass hittades"}} />}</span>
                </div>
                <div className="flex flex-col mt-2">
                  <div className="text-sm"><Text text={{eng: "Period Of Validity", swe: "Validitetsperiod"}} /></div>
                  <span className={`${!employee?.periodOfValidity && "italic"} text-md`}>{employee?.periodOfValidity || <Text text={{eng:"No period of validity was found", swe: "Ingen valitetsperiod hittades"}} />}</span>
                </div>
              </div>
            
              <div className="flex flex-col ">
              <div className="flex flex-col">
                <div className="text-sm"><Text text={{eng: "Added", swe: "Tillagd"}} /></div>
                <span>{new Date(employee?.added || "").toLocaleDateString() + " " + new Date(employee?.added || "").toLocaleTimeString() || ""}</span>
              </div>
              <div className="flex flex-col mt-2">
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
