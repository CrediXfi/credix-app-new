"use client";
import cn from "@/lib/utils/cn";
import { useState } from "react";
import { GridViewIcon } from "../components/atom/icons/market/grid-view";
import { TableViewIcon } from "../components/atom/icons/market/table-view";
import { MarketGridView } from "./market-grid-view";
import { MarketTable } from "./market-table";
// import MarketTable from "./market-table"

export function ToggleView() {
  const [isGridView, setIsGridView] = useState(true);
  return (
    <>
      <div className="flex items-center justify-end gap-4 my-3">
        <GridViewIcon
          className={cn(
            "size-6 cursor-pointer transition-colors",
            isGridView ? "text-white" : "text-gray-500"
          )}
          onClick={() => setIsGridView(true)}
        />
        <TableViewIcon
          className={cn(
            "size-6 cursor-pointer transition-colors",
            !isGridView ? "text-white" : "text-gray-500"
          )}
          onClick={() => setIsGridView(false)}
        />
      </div>

      {isGridView ? <MarketGridView /> : <MarketTable />}
     
    </>
  );
}
