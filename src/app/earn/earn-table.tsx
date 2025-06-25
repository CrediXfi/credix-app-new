"use client";

import React from "react";
import { RightAngleIcon } from "@/app/components/atom/icons/market/right-angle";
import cn from "@/lib/utils/cn";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpDownIcon } from "../components/atom/icons/market/arrow-up-down";
import { SelectBox } from "../components/select";
import { useMarkets } from "@/lib/hooks/use-markets";

interface TableRow {
  underlyingAsset: string;
  symbol: string;
  icon: string;
  suppliedUsd: number;
  supplyApy: number;
  borrowed: number;
  borrowApy: number;
}

export function EarnTable() {
  const { data: reserves = [], isLoading, error } = useMarkets();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [selectedAsset, setSelectedAsset] = React.useState<string | null>(null);

  // Подготовим данные для таблицы: теперь suppliedUsd = availableLiquidity * underlyingPrice
  const tableData = React.useMemo<TableRow[]>(() =>
    reserves.map((r) => {
      const suppliedUsd = r.availableLiquidity * r.underlyingPrice;
      return {
        underlyingAsset: r.underlyingAsset,
        symbol: r.symbol,
        icon: `/tokens/${r.symbol.toLowerCase()}.svg`,
        suppliedUsd,
        supplyApy: r.supplyApy,
        borrowed: r.totalPrincipalStableDebt + r.totalScaledVariableDebt,
        borrowApy: r.borrowApy,
      };
    }), [reserves]
  );

  const columns = React.useMemo<ColumnDef<TableRow>[]>(() => [
    {
      id: "assets",
      accessorKey: "symbol",
      header: "Assets",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 w-[130px] md:w-full">
          <Image
            src={row.original.icon}
            alt={row.original.symbol}
            width={24}
            height={24}
            className="h-6 w-6 object-contain"
          />
          <span className="text-white">{row.original.symbol}</span>
          <RightAngleIcon className="size-6 opacity-70" />
        </div>
      ),
    },
    {
      id: "chain",
      header: "Chain",
      cell: () => (
        <Image
          src="/tokens/ws.svg"
          alt="Sonic"
          width={24}
          height={24}
          className="h-6 w-6 object-contain"
        />
      ),
    },
    {
      id: "marketName",
      header: "Market Name",
      cell: () => <p className="text-white text-sm">Credix Main</p>,
    },
    {
      accessorKey: "suppliedUsd",
      header: "Supplied",
      cell: ({ getValue }) => {
        const usd = getValue<number>();
        return (
          <span className="text-white text-sm">
            ${usd.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </span>
        );
      },
    },
    {
      accessorKey: "supplyApy",
      header: "Supply APY",
      cell: ({ getValue }) => (
        <span className="text-white text-sm">{getValue<number>().toFixed(2)}%</span>
      ),
      sortingFn: (a, b, id) => a.getValue<number>(id) - b.getValue<number>(id),
    },
    {
      id: "borrowed",
      accessorFn: (row) => row.borrowed,
      header: "Borrowed",
      cell: ({ getValue }) => (
        <span className="text-white text-sm">
          ${getValue<number>().toLocaleString(undefined, { maximumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      accessorKey: "borrowApy",
      header: "Borrow APY",
      cell: ({ getValue }) => (
        <span className="text-white text-sm">{getValue<number>().toFixed(2)}%</span>
      ),
    },
    {
      id: "actions",
      header: () => null,
      cell: ({ row }) => (
        <Link
          href={`/market/1/coin/${row.original.underlyingAsset}`}
          className="bg-[#8748FF] text-white px-2.5 py-1 rounded-sm"
        >
          Details
        </Link>
      ),
    },
  ], []);

  const table = useReactTable<TableRow>({
    data: tableData.filter((r) => !selectedAsset || r.symbol === selectedAsset),
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (isLoading) return <p>Loading reserves…</p>;
  if (error) return <p className="text-red-500">Failed to load reserves: {error.message}</p>;
  if (!reserves.length) return <p>No reserves available</p>;

  return (
    <div>
      <div className="md:flex justify-between mb-4">
        <div className="flex gap-2">
          {/* <SelectBox
            options={reserves.map((r) => ({ name: r.symbol }))}
            placeholder="Select Asset"
            value={selectedAsset}
            onChange={setSelectedAsset}
          /> */}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedAsset(null)}
            className="bg-[#0D0416] text-white px-4 py-2 text-xs rounded border border-white/10"
          >
            Reset
          </button>
          <button
            onClick={() => {}}
            className="bg-[#8748FF] text-white px-4 py-2 text-xs rounded"
          >
            Apply Filter
          </button>
        </div>
      </div>

      <div className="overflow-x-auto border border-white/10 rounded">
        <table className="min-w-full text-white">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} className="bg-[#0D0416]">
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className="px-3 py-1.5 text-left text-base font-normal opacity-75"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-1">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() && (
                        <ArrowUpDownIcon className="size-3 text-gray-400" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b border-gray-700 hover:bg-white/5">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-3 py-5 text-sm">
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
