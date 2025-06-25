"use client";

import React from "react";

interface SummaryCardProps {
  title: string;
  amount: string;
}

export function SummaryCard({ title, amount }: SummaryCardProps) {
  return (
    <div className="rounded-[4px] border border-[#855ECA] bg-white/10 backdrop-blur-[25px] py-2 px-[14px]">
      <h5 className="text-white text-xs font-light opacity-75">{title}</h5>
      <h6 className="text-white text-lg font-semibold mt-1">
        <span className="text-[#606060]">$</span>
        {amount}
      </h6>
    </div>
  );
}
