import React from 'react'
import SupplierStatsGrid from './SupplierStatsGrid';
import SupplierListTable from './SupplierListTable';
import SupplierListTableHeader from './SupplierListTableHeader';
import TablePagination from '../Purchasing/TablePagination';
import Table from 'daisyui/components/table';

function supplierList() {
  return (
    <div>
      {/* flex flex-row gap-12 border border-red-500 */}
      <SupplierStatsGrid/>
      <div className = "bg-white/80 space-y-5 dark:bg-slate-900/80 backdrop-blur-xl rounded-lg py-4 px-5 border border-slate-200/50 dark:border-slate-700/50">
        <SupplierListTableHeader/>
        <SupplierListTable/>

        <div class = "flex items-center justify-between mt-4">
          
          <TablePagination/>
        </div>
      </div>
      
    </div>
  )
}

export default supplierList
