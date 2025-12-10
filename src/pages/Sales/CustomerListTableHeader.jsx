import React from 'react';
import { Plus } from 'lucide-react';

function CustomerListTableHeader() {
  return (
    <div class = "flex items-center justify-between">
        <h1 className="text-[#454545] dark:text-white text-xl font-bold">Customer List</h1>

        <button className="flex items-center space-x-2 py-2 px-4 bg-blue-500 text-white rounded-lg hover:shadow-lg transition-all">
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">Add Customer</span>
        </button>
    </div>
  )
}

export default CustomerListTableHeader;