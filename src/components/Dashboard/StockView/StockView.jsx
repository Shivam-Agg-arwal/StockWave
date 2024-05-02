import React from 'react'
import { useParams } from 'react-router-dom'
import StockTitle from './StockTitle';
import StockGraph from './StockGraph';
import StockDetails from './StockDetails';
import StockIndices from './StockIndices';

const StockView = () => {
    const {symbol}=useParams();

  return (
    <div className='flex flex-row gap-2 w-full'>
        {/* Left Side */}
        <div className=' flex flex-col'>
            <StockTitle/>
            <StockGraph/>
        </div>
        {/* Right Side */}
        <div className=''>
            <StockDetails/>
            <StockIndices/>
        </div>
    </div>
  )
}

export default StockView