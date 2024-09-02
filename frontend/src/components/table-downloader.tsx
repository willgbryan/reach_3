import React from 'react';
import * as XLSX from 'xlsx';

interface TableDownloaderProps {
  tableId: string;
}

const TableDownloader: React.FC<TableDownloaderProps> = ({ tableId }) => {
  const downloadTable = () => {
    const table = document.getElementById(tableId) as HTMLTableElement;
    if (!table) {
      console.error(`Table with id ${tableId} not found`);
      return;
    }

    const ws = XLSX.utils.table_to_sheet(table);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Table Data');

    XLSX.writeFile(wb, `table_${tableId}.xlsx`);
  };

  return (
    <button
      onClick={downloadTable}
      className="p-1 rounded transition-colors hover:bg-gray-200 dark:hover:bg-stone-900"
      title="Download as Excel"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="icon icon-tabler icon-tabler-file-download"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M14 3v4a1 1 0 0 0 1 1h4" />
        <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
        <path d="M12 17v-6" />
        <path d="M9.5 14.5l2.5 2.5l2.5 -2.5" />
      </svg>
    </button>
  );
};

export default TableDownloader;