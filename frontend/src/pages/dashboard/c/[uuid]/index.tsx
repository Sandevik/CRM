import Meetings from '../../../../components/Meetings';
import Navbar from './Navbar';

export default function index() {
  
  

  return (
    <div className='flex h-[calc(100dvh-3em)] p-4'>
      <main className="flex-grow">
        <Navbar />
        <div>
          Some statistics?
          Some info?  

          num of meetings today
        </div>

      </main>
      <Meetings />
    </div>
  )
}
