import React from 'react'

function TablePagination() {
  return (
    <div>
        <ul className="flex -space-x-px text-sm">
            <li className = "">
                <a href="#" className="flex items-center justify-center text-slate-600 rounded-l-md box-border border border-slate-300/90 bg-white-300/30 dark:bg-gray-600/20 dark:text-slate-100/90 dark:border-slate-600/90 hover:bg-slate-300/50 dark:hover:bg-slate-300/20 dark:hover:text-white font-medium rounded-s-base text-sm w-9 h-9 focus:outline-none">
                    <span className="sr-only">Previous</span>
                    <svg className="w-4 h-4 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m15 19-7-7 7-7"/></svg>
                </a>
            </li>
            <li>
                <a href="#" className="flex items-center justify-center text-slate-600 box-border border border-slate-300/90 bg-white-300/30 dark:bg-gray-600/20 dark:text-slate-100/90 dark:border-slate-600/90 hover:bg-slate-300/50 dark:hover:bg-slate-300/20 dark:hover:text-white font-medium text-sm w-9 h-9 focus:outline-none">1</a>
            </li>
            <li>
                <a href="#" className="flex items-center justify-center text-slate-600 box-border border border-slate-300/90 bg-white-300/30 dark:bg-gray-600/20 dark:text-slate-100/90 dark:border-slate-600/90 hover:bg-slate-300/50 dark:hover:bg-slate-300/20 dark:hover:text-white font-medium text-sm w-9 h-9 focus:outline-none">2</a>
            </li>
            <li>
                <a href="#" className="flex items-center justify-center text-slate-600 box-border border border-slate-300/90 bg-white-300/30 dark:bg-gray-600/20 dark:text-slate-100/90 dark:border-slate-600/90 hover:bg-slate-300/50 dark:hover:bg-slate-300/20 dark:hover:text-white font-medium text-sm w-9 h-9 focus:outline-none">3</a>
            </li>
            <li>
                <a href="#" className="flex items-center justify-center text-slate-600 box-border border border-slate-300/90 bg-white-300/30 dark:bg-gray-600/20 dark:text-slate-100/90 dark:border-slate-600/90 hover:bg-slate-300/50 dark:hover:bg-slate-300/20 dark:hover:text-white font-medium text-sm w-9 h-9 focus:outline-none">4</a>
            </li>
            <li>
                <a href="#" className="flex items-center justify-center text-slate-600 box-border border border-slate-300/90 bg-white-300/30 dark:bg-gray-600/20 dark:text-slate-100/90 dark:border-slate-600/90 hover:bg-slate-300/50 dark:hover:bg-slate-300/20 dark:hover:text-white font-medium text-sm w-9 h-9 focus:outline-none">5</a>
            </li>
            <li>
                <a href="#" className="flex items-center justify-center text-slate-600 rounded-r-md box-border border border-slate-300/90 bg-white-300/30 dark:bg-gray-600/20 dark:text-slate-100/90 dark:border-slate-600/90 hover:bg-slate-300/50 dark:hover:bg-slate-300/20 dark:hover:text-white font-medium rounded-e-base text-sm w-9 h-9 focus:outline-none">
                    <span className="sr-only">Next</span>
                    <svg className="w-4 h-4 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7"/></svg>
                </a>
            </li>
        </ul>
    </div>
  )
}

export default TablePagination;