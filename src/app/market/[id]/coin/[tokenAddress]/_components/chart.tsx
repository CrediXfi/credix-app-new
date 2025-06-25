'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import type { ApexOptions } from 'apexcharts';

/* 👇  загружаем компонент только на клиенте */
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

const BorrowRateChart: React.FC = () => {
  /* пример данных */
  const series = [
    {
      name: 'Borrow APR',
      data: [3.1, 3.4, 4.2, 4.9, 5.5, 7.1, 8.3],
    },
  ];

  const options: ApexOptions = {
    chart: {
      id: 'borrow-rate',
      toolbar: { show: false },
      zoom: { enabled: false },
      type: 'line',
    },
    stroke: { width: 2, curve: 'smooth' },
    xaxis: {
      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    yaxis: {
      labels: { formatter: (v) => `${v.toFixed(1)}%` },
    },
    theme: { mode: 'dark' },
  };

  return (
    <div className="w-full rounded border border-[#606060] p-4">
      <ReactApexChart
        options={options}
        series={series}
        type="line"
        height={300}
      />
    </div>
  );
};

export default BorrowRateChart;
