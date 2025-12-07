import React from 'react'
import SupplierStatsGrid from './SupplierStatsGrid';
import SupplierListTable from './SupplierListTable';
import SupplierListTableHeader from './SupplierListTableHeader';

function supplierList() {
  return (
    <div>
      {/* flex flex-row gap-12 border border-red-500 */}
      <SupplierStatsGrid/>
      <div className = "bg-white/80 space-y-3 dark:bg-slate-900/80 backdrop-blur-xl rounded-lg py-4 px-5 border border-slate-200/50 dark:border-slate-700/50">
        <SupplierListTableHeader/>
        <SupplierListTable/>
      </div>
      
    </div>
  )
}

export default supplierList
