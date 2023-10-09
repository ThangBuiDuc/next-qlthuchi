// import Skeleton from 'react-loading-skeleton'
// import 'react-loading-skeleton/dist/skeleton.css'

export default function Loading() {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <span className="loading loading-infinity w-[100px]"></span>
      </div>
    );
    // return <Skeleton count={5}/>
  }
  
  