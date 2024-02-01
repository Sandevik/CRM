import Meetings from '../../../../components/Meetings';
import Navbar from './Navbar';

export default function index() {
  
  

  return (
    <div className='flex h-[calc(100dvh-3em)] p-4'>
      <main className="flex-grow">
        <Navbar />
        <div>
          Some statistics?
          <br />
          Some info?  
          <br />
          num of meetings today
          <br />
          things todo from different clients
          <br />
          wishlist for functions that customers want (votable) and status for wishlist votes
        </div>

      </main>
      <Meetings />
    </div>
  )
}
