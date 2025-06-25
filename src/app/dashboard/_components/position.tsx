"use client";

import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef,
  SortingState,
} from "@tanstack/react-table";
import { DashboardPosition } from "@/lib/hooks/use-user-dashboard";
import cn from "@/lib/utils/cn";

interface Props {
  data: DashboardPosition[];
}

export function PositionTable({ data }: Props) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  // Formatters
  const fmtUsd = (v: number) => `$${v.toFixed(2)}`;
  const fmtPct = (v: number) => `${v.toFixed(2)}%`;

  const columns = React.useMemo<ColumnDef<DashboardPosition>[]>(
    () => [
      {
        accessorKey: "poolName",
        header: "Pool",
        cell: info => <span>{info.getValue<string>()}</span>,
      },
      {
        accessorKey: "yourDeposit",
        header: "Your Deposit",
        cell: info => {
          const v = info.getValue<number>() ?? 0;
          return <span>{fmtUsd(v)}</span>;
        },
      },
      {
        accessorKey: "yourDebt",
        header: "Your Debt",
        cell: info => {
          const v = info.getValue<number>() ?? 0;
          return v > 0 ? <span>{fmtUsd(v)}</span> : <span>–</span>;
        },
      },
      {
        accessorKey: "healthFactor",
        header: "Health Factor",
        cell: info => {
          const v = info.getValue<number>() ?? 0;
          return v === Infinity ? <span>∞</span> : <span>{v.toFixed(2)}</span>;
        },
      },
      {
        accessorKey: "netSupplyApy",
        header: "Net APY",
        cell: info => {
          const v = info.getValue<number>() ?? 0;
          return <span>{fmtPct(v)}</span>;
        },
      },
      {
        accessorKey: "netBorrowApy",
        header: "Net Borrow APY",
        cell: info => {
          const v = info.getValue<number>() ?? 0;
          return v > 0 ? <span>{fmtPct(v)}</span> : <span>–</span>;
        },
      },
      {
        accessorKey: "netWorth",
        header: "Net Worth",
        cell: info => {
          const v = info.getValue<number>() ?? 0;
          return <span>{fmtUsd(v)}</span>;
        },
      },
      {
        accessorKey: "totalInterestPaid",
        header: "Total Interest Paid",
        cell: info => {
          const v = info.getValue<number>() ?? 0;
          return <span>{fmtUsd(v)}</span>;
        },
      },
      {
        accessorKey: "totalInterestEarn",
        header: "Total Interest Earn",
        cell: info => {
          const v = info.getValue<number>() ?? 0;
          return <span>{fmtUsd(v)}</span>;
        },
      },
      {
        accessorKey: "netInterest",
        header: "Net Interest",
        cell: info => {
          const v = info.getValue<number>() ?? 0;
          return <span>{fmtUsd(v)}</span>;
        },
      },
      {
        accessorKey: "borrowPowerUsed",
        header: "Borrow Power Used",
        cell: info => {
          const v = info.getValue<number>() ?? 0;
          return <span>{fmtPct(v)}</span>;
        },
      },
      {
        accessorKey: "rewards",
        header: "Rewards",
        cell: info => {
          const v = info.getValue<number>() ?? 0;
          return <span>{fmtUsd(v)}</span>;
        },
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <button
            onClick={() => window.location.href = "/market/1"}
            className="px-3 py-1 bg-white/10 rounded hover:bg-white/20"
          >
            View Details
          </button>
        ),
        meta: { sticky: "right" },
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="overflow-x-auto relative">
      <table className="min-w-[900px] text-white">
        <thead className="bg-[#1E0F3E]">
          {table.getHeaderGroups().map(hg => (
            <tr key={hg.id}>
              {hg.headers.map(header => {
                const isSticky = header.column.id === "actions";
                return (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className={cn(
                      "px-4 py-2 text-left text-sm whitespace-nowrap cursor-pointer",
                      isSticky && "sticky right-0 bg-[#1E0F3E] z-10"
                    )}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id} className="border-t border-white/20">
              {row.getVisibleCells().map(cell => {
                const isSticky = cell.column.id === "actions";
                return (
                  <td
                    key={cell.id}
                    className={cn(
                      "px-4 py-3 text-sm whitespace-nowrap",
                      isSticky && "sticky right-0 bg-[#1B0D37] z-10"
                    )}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
