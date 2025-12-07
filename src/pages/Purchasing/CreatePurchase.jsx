import React from 'react'
import PurchasedStatsGrid from './PurchasedStatsGrid';
import PurchasedOrdersTableHeader from './PurchasedOrdersTableHeader';
import PurchasedOrdersTable from './PurchasedOrdersTable';

function CreatePurchase() {
  return (
    <div>
      {/* Stats Grid */}
      <PurchasedStatsGrid/>

      <div className = "bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl py-2 px-5 border border-slate-200/50 dark:border-slate-700/50">
        {/* Filters Section */}
        <PurchasedOrdersTableHeader/>

        <PurchasedOrdersTable/>
      </div>
    </div>
  )
}

export default CreatePurchase;