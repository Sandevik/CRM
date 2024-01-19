import Meetings from '../../../../components/Meetings';
import Navbar from './Navbar';

export default function index() {
  
  

  return (
    <div className='flex h-[calc(100dvh-3em)]'>
      <main className="flex-grow">
        <Navbar />
      </main>
      <Meetings />
    </div>
  )
}
