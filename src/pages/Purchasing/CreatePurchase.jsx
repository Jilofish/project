import React from 'react'
import PurchasedStatsGrid from './PurchasedStatsGrid';
import PurchasedOrdersTableHeader from './PurchasedOrdersTableHeader';
import PurchasedOrdersTable from './PurchasedOrdersTable';
import RowLimiter from '../../components/filter/RowLimiter';
import TablePagination from '../../components/pagination/TablePagination';

function CreatePurchase() {
  const iconProps = {
    className: 'w-4 h-4 text-slate-500 dark:text-slate-500',
  };

    // --- DATA FOR ALL FILTERS ---
  const RowOptions = ['5', '15', '20'];
  const HandleRowLimitChange = (newValue) => {
    console.log('Row limiter value changed:', newValue);
  };
  
  return (
    <div>
      {/* Stats Grid */}
      <PurchasedStatsGrid/>

      <div className = "bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl py-2 px-5 border border-slate-200/50 dark:border-slate-700/50">
        {/* Filters Section */}
        <PurchasedOrdersTableHeader/>

        <PurchasedOrdersTable/>

        <div class = "flex items-center justify-between mb-3">
          <RowLimiter
            options={RowOptions}
            initialValue={RowOptions[0]}
            onSelect={HandleRowLimitChange}
            iconProps={iconProps}
          />
          <TablePagination/>
        </div>
      </div>
    </div>
  )
}

export default CreatePurchase;