import React from 'react'
import RevenueChart from './RevenueChart';
import SalesChart from './SalesChart';


function ChartSection({salesTableData, revenueChartData}) {
  console.log("revenue chart data: ", revenueChartData);
  console.log("sales table data: ", salesTableData);
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div className="xl:col-span-2">
        <RevenueChart 
        revenueChartData={revenueChartData} />
      </div>
      <div className="space-y-6">
        <SalesChart 
        salesTableData={salesTableData} />
      </div>
    </div>
  )
}

export default ChartSection
