// import React from 'react';

// // Define the structure for a column
// export interface ColumnDef<T> {
//   header: string; // Text for the table header
//   cell: (item: T) => React.ReactNode; // Function to render the cell content
//   headerClassName?: string; // Optional custom class for the header <th>
//   cellClassName?: string;   // Optional custom class for the data <td>
//   textAlign?: 'left' | 'center' | 'right'; // To easily set text alignment
// }

// // Props for the reusable table component
// interface ReusableTableProps<T> {
//   fetchData: (query: string, currentPage: number) => Promise<T[]>; // Function to fetch data
//   query: string; // Search query
//   currentPage: number; // Current page number
//   columns: ColumnDef<T>[]; // Array of column definitions
//   noDataMessage: string; // Message when no data is found
//   idAccessor: (item: T) => string | number; // Function to get a unique ID from an item for the row key
//   itemType?: T; // Optional: helps with type inference if needed, but often not required
// }

// const ReusableTable = async <T extends { id?: string | number }>({ // Ensure T has at least an id for a default idAccessor
//   fetchData,
//   query,
//   currentPage,
//   columns,
//   noDataMessage,
//   idAccessor,
// }: ReusableTableProps<T>) => {
//   const items = await fetchData(query, currentPage);

//   const defaultHeaderClasses = "px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-nowrap";
//   const defaultCellClasses = "px-6 py-4 whitespace-nowrap"; // Base classes for cells

//   return (
//     <div className="mt-6 overflow-x-auto rounded-md border border-gray-200 shadow-xs">
//       <table className="min-w-full divide-y divide-gray-200 bg-white">
//         <thead className="bg-gray-50">
//           <tr>
//             {columns.map((col) => (
//               <th
//                 key={col.header} // Using header as key, ensure headers are unique
//                 scope="col"
//                 className={`${defaultHeaderClasses} ${col.textAlign === 'center' ? 'text-center' : 'text-left'} ${col.headerClassName || ''}`}
//               >
//                 {col.header}
//               </th>
//             ))}
//           </tr>
//         </thead>
//         <tbody className="divide-y divide-gray-200 bg-white">
//           {items && items.length > 0 ? (
//             items.map((item) => (
//               <tr key={idAccessor(item)} className="hover:bg-gray-100/50">
//                 {columns.map((col) => (
//                   <td key={col.header} /* Using header as key for consistency, ensure cell content is stable */
//                       className={`${defaultCellClasses} ${col.textAlign === 'center' ? 'text-center' : ''} ${col.cellClassName || ''}`}>
//                     {col.cell(item)}
//                   </td>
//                 ))}
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td
//                 colSpan={columns.length} // Dynamic colspan
//                 className="px-6 py-12 text-center text-sm text-gray-500"
//               >
//                 {noDataMessage}
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default ReusableTable;
