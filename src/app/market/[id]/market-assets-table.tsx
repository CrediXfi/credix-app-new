"use client";

import React from "react";
import Image from "next/image";
import cn from "@/lib/utils/cn";
import { useMarkets } from "@/lib/hooks/use-markets";
import { useParams, useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { ArrowUpDownIcon } from "@/app/components/atom/icons/market/arrow-up-down";
import { RightAngleIcon } from "@/app/components/atom/icons/market/right-angle";
import { TickIcon } from "@/app/components/atom/icons/market/tick";
import { ToolTipIcon } from "@/app/components/atom/icons/market/tooltip";
import { SupplyModal } from "@/app/components/modals/SupplyModal";
import { BorrowModal } from "@/app/components/modals/BorrowModal";

const fmtUsd = (n: number) => {
  const abs = Math.abs(n);
  if (abs >= 1e9) return `$${(n / 1e9).toFixed(2)}Bn`;
  if (abs >= 1e6) return `$${(n / 1e6).toFixed(2)}Mn`;
  if (abs >= 1e3) return `$${(n / 1e3).toFixed(2)}K`;
  return `$${n.toFixed(2)}`;
};
const fmtPct = (n: number) => `${n.toFixed(2)}%`;

interface MarketRow {
  id: string;
  address: string;
  icon: string;
  symbol: string;
  availableLiquidity: number;
  supply?: string;
  supplyAPY?: string;
  borrowedAmount: number;
  borrowed: string;
  borrowAPY?: string;
  score?: string;
  collateral?: boolean;
  decimals: number;
}

export function MarketAssetsTable() {
  const { data } = useMarkets();
  const { id: marketId } = useParams<{ id: string }>();
  const router = useRouter();
  const { address } = useAccount();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [modal, setModal] = React.useState<{
    type: "supply" | "borrow" | null;
    address: string | null;
  }>({ type: null, address: null });

  const tableData = React.useMemo<MarketRow[]>(() => {
    if (!data?.length) return [];
    return data.map((r, idx) => {
      const avail = Number(r.availableLiquidity);
      const price = r.underlyingPrice;
      const suppliedUsd = avail * price; // TODO: Getting the actual value in USD (for the table and not the heading)

      const totalBorrow = (r.totalPrincipalStableDebt + r.totalScaledVariableDebt) * price;
      return {
        id: String(idx + 1),
        address: r.underlyingAsset.toLowerCase(),
        icon: `/tokens/${r.symbol.toLowerCase()}.svg`,
        symbol: r.symbol,
        availableLiquidity: avail,
        supply: fmtUsd(suppliedUsd),
        supplyAPY: fmtPct(r.supplyApy),
        borrowedAmount: totalBorrow,
        borrowed: fmtUsd(totalBorrow),
        borrowAPY: fmtPct(r.borrowApy),
        score: r.isolationMode ? undefined : "1",
        collateral: !r.isolationMode,
        decimals: r.decimals,
      };
    });
  }, [data]);

  const columns = React.useMemo<ColumnDef<MarketRow>[]>(() => [
    {
      id: "assets",
      accessorKey: "symbol",
      header: "Assets",
      size: 540,
      enableSorting: false,
      cell: ({ row }) => (
        <div
          onClick={() =>
            router.push(`/market/${marketId}/coin/${row.original.address}`)
          }
          className="cursor-pointer flex items-center justify-between gap-3 md:gap-2 mr-10 md:mr-0 w-[130px] md:w-full"
        >
          <div className="flex items-center gap-2">
            <Image
              src={row.original.icon}
              alt={row.original.symbol}
              width={24}
              height={24}
              className="h-6 w-6 object-contain"
            />
            <div className="grid items-center">
              <span className="text-white text-base">
                {row.original.symbol}
              </span>
              <span className="text-white text-xs font-extralight opacity-70">
                {row.original.symbol}
              </span>
            </div>
          </div>
          <RightAngleIcon className="size-6 opacity-70 md:mr-10" />
        </div>
      ),
    },
    {
      accessorKey: "supply",
      header: "Supplied",
      cell: ({ row, getValue }) => {
        const supply = getValue() as string;
        const score = row.original.score;
        const parts =
          supply?.match(/^([^0-9.,]*)?([\d.,]+)?([^0-9.,]*)?$/) ?? [];
        const enabled = row.original.availableLiquidity > 0;
        return (
          <div className="flex items-center gap-2">
            {score && (
              <div className="relative inline-block bg-transparent rounded px-2 border border-[#524461] text-white text-xs font-normal leading-6 -ml-[43px]">
                <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-green-500 rounded-full" />
                {score}%
              </div>
            )}
            <div className="grid gap-1">
              <span className="text-sm font-semibold leading-6 text-white">
                {supply ? (
                  <>
                    {parts[1] && (
                      <span className="text-[#606060] opacity-75">
                        {/* TODO: Dollar symbol */}
                        {parts[1]}
                      </span>
                    )}
                    {/* TODO: The dollar equivalent of supplied assets */}
                    {parts[2]}
                    {parts[3] && (
                      <span className="text-[#606060] opacity-75">
                        {parts[3]}
                      </span>
                    )}
                  </>
                ) : (
                  "—"
                )}
              </span>
              <button
                disabled={!enabled}
                onClick={(e) => {
                  e.stopPropagation();
                  setModal({ type: "supply", address: row.original.address });
                }}
                className={cn(
                  "text-xs text-white px-2.5 py-1.5 rounded",
                  enabled
                    ? "bg-[#8748FF] hover:opacity-80"
                    : "bg-gray-600 opacity-50 cursor-not-allowed"
                )}
              >
                Supply
              </button>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "supplyAPY",
      header: "Supply APY",
      cell: ({ getValue }) => {
        const value = getValue() as string;
        const parts = value?.match(/^([\d.,]+)?(%?)$/) ?? [];
        return (
          <span className="text-white text-sm font-semibold leading-6">
            {parts[1]}
            {parts[2] && (
              <span className="text-[#606060] opacity-75">{parts[2]}</span>
            )}
          </span>
        );
      },
    },
    {
      accessorKey: "borrowed",
      header: "Borrowed",
      cell: ({ row }) => {
        const amount = row.original.borrowedAmount || 0;
        const formatted = fmtUsd(amount);
        const parts =
          formatted.match(/^([^0-9.,]*)?([\d.,]+)?([^0-9.,]*)?$/) ?? [];
        const enabled = row.original.availableLiquidity > 0;
        return (
          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold leading-6 text-white">
              {parts[1] && (
                <span className="text-[#606060] opacity-75">{parts[1]}</span>
              )}
              {parts[2] || "—"}
              {parts[3] && (
                <span className="text-[#606060] opacity-75">{parts[3]}</span>
              )}
            </p>
            <button
              disabled={!enabled}
              onClick={(e) => {
                e.stopPropagation();
                setModal({ type: "borrow", address: row.original.address });
              }}
              className={cn(
                "text-xs text-white px-2.5 py-1.5 rounded w-16",
                enabled
                  ? "bg-[#8748FF] hover:opacity-80"
                  : "bg-gray-600 opacity-50 cursor-not-allowed"
              )}
            >
              Borrow
            </button>
          </div>
        );
      },
    },
    {
      accessorKey: "borrowAPY",
      header: "Borrow APY",
      cell: ({ getValue }) => {
        const value = getValue() as string;
        const parts = value?.match(/^([\d.,]+)?(%?)$/) ?? [];
        return (
          <p className="text-sm font-semibold leading-6 text-white">
            {parts[1]}
            {parts[2] && (
              <span className="text-[#606060] opacity-75">{parts[2]}</span>
            )}
          </p>
        );
      },
    },
  ], [marketId, router]);

  const table = useReactTable({
    data: tableData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between my-2.5">
        <span className="flex items-center gap-1">
          <h6 className="text-white text-base font-normal leading-6 opacity-75">
            Market Asset
          </h6>
          <button title="Assets Availabe in the market">
            <ToolTipIcon className="size-[18px] text-white opacity-75 cursor-pointer" />
          </button>
        </span>
        <button className="text-white text-xs font-normal leading-6 bg-[#2B292D] py-1.5 px-3 rounded opacity-75 hover:opacity-100">
          Edit Table
        </button>
      </div>

      {/* Mobile View */}
      <div className="md:hidden mb-5 space-y-3">
        {tableData.map((market) => {
          /* …mobile layout… */
          return <div key={market.id}>{/* … */}</div>;
        })}
      </div>

      {/* Desktop / Tablet View */}
      <div className="hidden md:block overflow-x-auto border border-white/30 rounded-[4px]">
        <table className="min-w-full text-white">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} className="bg-[#0D0416] border-b border-white/30">
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className="px-3 py-1.5 text-white opacity-75 text-base font-normal leading-6 text-left whitespace-nowrap"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-1">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
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
            {table.getRowModel().rows.map((row, idx) => (
              <tr
                key={row.id + idx}
                className="text-sm font-normal leading-6 text-white/55 border-b border-gray-700"
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className={cn(
                      "px-3 py-5",
                      cell.column.id === "totalBorrow" && "border-r border-white/30"
                    )}
                  >
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Supply Modal */}
      {modal.address && (
        <SupplyModal
          open={modal.type === "supply"}
          onClose={() => setModal({ type: null, address: null })}
          tokenAddress={modal.address}
          decimals={
            tableData.find((r) => r.address === modal.address)?.decimals ??
            0
          }
          symbol={
            tableData.find((r) => r.address === modal.address)?.symbol ??
            ""
          }
        />
      )}

      {/* Borrow Modal */}
      {modal.address && (
        <BorrowModal
          open={modal.type === "borrow"}
          onClose={() => setModal({ type: null, address: null })}
          tokenAddress={modal.address}
          decimals={
            tableData.find((r) => r.address === modal.address)?.decimals ??
            0
          }
          symbol={
            tableData.find((r) => r.address === modal.address)?.symbol ??
            ""
          }
        />
      )}
    </div>
  );
}
