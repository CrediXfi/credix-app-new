"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import cn from "@/lib/utils/cn";
import { useMarkets } from "@/lib/hooks/use-markets";

/* компакт: 1_234_567 → "$1.23Bn / $456.7M / $8.9K" */
function formatUsdCompact(n: number): string {
  const abs = Math.abs(n);
  if (abs >= 1e9) return `$${(n / 1e9).toFixed(1)}Bn`;
  if (abs >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (abs >= 1e3) return `$${(n / 1e3).toFixed(2)}K`;
  return `$${n.toFixed(2)}`;
}

type TableRow = {
  id: string;
  chainIcon: string;
  marketName: string;
  marketSize: string;
  totalAvailable: string;
  totalBorrow: string;
};

const demoMarkets: TableRow[] = [
  {
    id: "1",
    chainIcon: "/loop.png",
    marketName: "Credix Core",
    marketSize: "$1.2Bn",
    totalAvailable: "$510.25M",
    totalBorrow: "$320.89M",
  },
];

export function MarketTable() {
  const { data, isLoading, error } = useMarkets();

  const tableData = React.useMemo<TableRow[]>(() => {
    if (!data?.length) return demoMarkets;

    const totals = data.reduce(
      (acc, r) => {
        acc.available += r.availableLiquidity;
        acc.borrow += r.totalPrincipalStableDebt + r.totalScaledVariableDebt;
        return acc;
      },
      { available: 0, borrow: 0 }
    );

    const marketSize = totals.available + totals.borrow;

    return [
      {
        ...demoMarkets[0], // «визитка»/иконка/имя остаются
        marketSize:     formatUsdCompact(marketSize),
        totalAvailable: formatUsdCompact(totals.available),
        totalBorrow:    formatUsdCompact(totals.borrow),
      },
    ];
  }, [data]);

  const [sorting, setSorting] = React.useState<SortingState>([]);

  const columns = React.useMemo<ColumnDef<TableRow>[]>(
    () => [
      {
        accessorKey: "chainIcon",
        header: "Chain",
        enableSorting: false,
        cell: ({ row }) => (
          <Image
            src={row.original.chainIcon}
            alt="Chain"
            width={24}
            height={24}
            className="h-6 w-6 object-contain"
          />
        ),
      },
      { accessorKey: "marketName",    header: "Market Name" },
      { accessorKey: "marketSize",    header: "Market Size" },
      { accessorKey: "totalAvailable", header: "Total Available" },
      { accessorKey: "totalBorrow",    header: "Total Borrow" },
      {
        id: "actions",
        header: "Action",
        enableSorting: false,
        size: 350,
        cell: ({ row }) => (
          <Link
            href={`/market/${row.original.id}`}
            className="bg-[#8748FF] hover:bg-purple-700 text-white text-sm px-2.5 py-[2px] rounded-sm transition min-w-28 inline-block text-center"
          >
            View Market
          </Link>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: tableData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (error)     return <p className="text-red-500">Ошибка: {error.message}</p>;
  if (isLoading) return <p>Загружается…</p>;

  return (
    <div>
      <div className="overflow-x-auto border border-white/30 rounded-[4px]">
        <table className="min-w-full text-white">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} className="bg-[#0D0416] border-b border-white/30">
                {hg.headers.map((h) => (
                  <th
                    key={h.id}
                    colSpan={h.colSpan}
                    className={cn(
                      "px-3 py-1.5 text-white opacity-75 text-base font-normal leading-6 text-left whitespace-nowrap",
                      h.id === "actions" && "border-l border-white/30"
                    )}
                    onClick={h.column.getToggleSortingHandler()}
                  >
                    {flexRender(h.column.columnDef.header, h.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="text-sm font-normal leading-6 text-white border-b border-gray-700"
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className={cn(
                      "px-3 py-5",
                      cell.column.id === "totalBorrow" &&
                        "border-r border-white/30"
                    )}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
