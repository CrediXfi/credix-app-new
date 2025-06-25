"use client";

import { ArrowUpDownIcon } from "@/app/components/atom/icons/market/arrow-up-down";
import cn from "@/lib/utils/cn";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from "@tanstack/react-table";
import React from "react";

interface LeaderboardEntry {
  rank: number;
  userWallet: string;
  supplyPoints: number;
  borrowPoints: number;
  totalPoints: number;
}

const leaderboardData: LeaderboardEntry[] = [
  {
    rank: 1,
    userWallet: "0xcd43...daa2",
    supplyPoints: 669_834,
    borrowPoints: 0,
    totalPoints: 669_834,
  },
  {
    rank: 2,
    userWallet: "0x524f...932f",
    supplyPoints: 163_133,
    borrowPoints: 273_578,
    totalPoints: 436_711,
  },
  {
    rank: 3,
    userWallet: "0xc2cf...0f2f",
    supplyPoints: 19_755,
    borrowPoints: 278_949,
    totalPoints: 298_704,
  },
  {
    rank: 4,
    userWallet: "0xdc2f...7f55",
    supplyPoints: 292_889,
    borrowPoints: 0,
    totalPoints: 292_889,
  },
  {
    rank: 5,
    userWallet: "0x09d0...0866",
    supplyPoints: 254_417,
    borrowPoints: 38_181,
    totalPoints: 292_599,
  },
  {
    rank: 6,
    userWallet: "0x8d4c...76c2",
    supplyPoints: 14_816,
    borrowPoints: 221_012,
    totalPoints: 235_828,
  },
  {
    rank: 7,
    userWallet: "0x2888...d895",
    supplyPoints: 841,
    borrowPoints: 230_152,
    totalPoints: 230_993,
  },
  {
    rank: 8,
    userWallet: "0xe07b...9410",
    supplyPoints: 5_547,
    borrowPoints: 179_752,
    totalPoints: 185_299,
  },
];

export function CxTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const columns: ColumnDef<LeaderboardEntry>[] = [
    {
      accessorKey: "rank",
      header: "Rank",
      enableSorting: false,
    },
    {
      accessorKey: "userWallet",
      header: "User",
      enableSorting: false,
    },
    {
      accessorKey: "supplyPoints",
      header: "Supply Points",
      cell: ({ getValue }) => (
        <span className="text-white text-sm font-semibold leading-6">
          {Number(getValue()).toLocaleString()}
        </span>
      ),
    },
    {
      accessorKey: "borrowPoints",
      header: "Borrow Points",
      cell: ({ getValue }) => (
        <span className="text-white text-sm font-semibold leading-6">
          {Number(getValue()).toLocaleString()}
        </span>
      ),
    },
    {
      accessorKey: "totalPoints",
      header: "Total Points",
      cell: ({ getValue }) => (
        <span className="text-white text-sm font-semibold leading-6">
          {Number(getValue()).toLocaleString()}
        </span>
      ),
    },
  ];

  const table = useReactTable({
    data: leaderboardData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="mb-10">
      <div className="overflow-x-auto border border-white/30 rounded-[4px]">
        <table className="min-w-full text-white">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="bg-[#0D0416] border-b border-white/30"
              >
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className="px-3 py-1.5 text-white opacity-75 text-base font-normal leading-6 text-left whitespace-nowrap"
                  >
                    <div
                      className={cn(
                        "flex items-center gap-1",
                        header.column.getCanSort() && "cursor-pointer"
                      )}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getCanSort() && (
                        <ArrowUpDownIcon
                          className="w-4 h-4 text-white opacity-50"
                          aria-hidden="true"
                        />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row, index) => (
              <tr
                key={row.id + index}
                className="text-sm font-normal leading-6 text-white border-b border-gray-700"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-3 py-5">
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
