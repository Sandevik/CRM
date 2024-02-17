import Meetings from '../../../../components/Meetings';
import Navbar from './Navbar';

export default function index() {
  
  

  return (
    <div className='flex h-[calc(100dvh-3em)] p-2'>
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
          <br />
          A box to put in suggestions and a view of all suggestions this client has proposed / All suggestions and ability to upvote all suggestions exept for ones own
          <br />
          Suggestions:
          <br />
          Title, text, upvotes / likes, visible (if the user wants a suggestion to be visible to other customers), status (if it is being added, is added, not added..), added_date
          

        </div>

      </main>
      <Meetings />
    </div>
  )
}
