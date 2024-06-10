"use client";

import React, { ReactNode } from "react";
import { Bar } from "react-chartjs-2";
import { ColumnDef } from "@tanstack/react-table";
import { LogOut } from "lucide-react";
import Cookie from "js-cookie";

import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

import jason from "@/assets/json/constant.json";
import dayjs from "dayjs";
import AnalyticalCard from "@/components/customs/analytical_card";
import { DataTable } from "@/components/tables/recent_data-tables";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

ChartJS.register(
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  LinearScale,
  BarElement
);

type RecentCount = {
  createdAt: string;
  count: number;
};

const mockData: RecentCount[] = new Array(50).fill(0).map((e, i) => ({
  createdAt: dayjs(new Date()).format("MMMM DD, YYYY hh:mma"),
  count: i + 1,
}));

export default function HomePage() {
  const { toast } = useToast();

  const columns: ColumnDef<RecentCount>[] = [
    {
      accessorKey: "createdAt",
      header: "Date",
    },

    {
      accessorKey: "count",
      header: "Broiler Count",
      cell: ({ getValue }) => (
        <div className="text-center">{getValue() as ReactNode}</div>
      ),
    },
  ];

  return (
    <>
      <Button
        className="absolute top-10 right-10"
        onClick={() => {
          Cookie.remove("isLoggedIn");
          Cookie.remove("lastPin");
          toast({
            title: "Successfully Logout",
            description: "Redirecting....",
          });

          setTimeout(() => window.location.reload(), 2000);
        }}
      >
        {/* supposedly link is not needed here but for formality lets include this here*/}
        <LogOut className="w-4 h-4 mr-2" /> Logout
      </Button>
      <div className="flex min-h-screen p-16 justify-evenly">
        <div className="flex flex-col w-2/3 gap-y-8">
          <div className="flex gap-x-8">
            <AnalyticalCard title="Total Broiler Counted" value={1200000} />
            <AnalyticalCard title="Total Broiler Counted Today" value={1350} />
          </div>
          <Bar
            data={{
              labels: jason.months,
              datasets: [
                {
                  label: "Broiler",
                  data: Array(12)
                    .fill(null)
                    .map(() => Math.floor(Math.random() * 100)),
                  backgroundColor: "teal",
                  type: "bar",
                },
              ],
            }}
            options={{
              responsive: true,
              hover: {
                mode: "point",
              },
              // interaction: {
              //   mode: "index",
              //   intersect: false,
              // },
              animations: {
                y: {
                  easing: "easeInOutElastic",
                },
              },
              plugins: {
                legend: {
                  position: "top",
                },
                title: {
                  display: true,
                  position: "bottom",
                  text: "Broiler Count in the Year 2024",
                  font: {
                    size: 32,
                  },
                },
              },
              scales: {
                y: {
                  min: 0,
                  max: 100,
                  stacked: false,
                  title: {
                    display: true,
                    text: "Number of Broiler",
                  },
                  ticks: {
                    stepSize: 5,
                  },
                },
                x: {
                  title: {
                    display: true,
                    text: "Date / Time",
                  },
                  grid: {
                    display: false,
                  },
                },
              },
              onHover: function (event, chartElement) {},
            }}
            plugins={[
              {
                id: "intersectDataVerticalLine",
                beforeDraw: (chart) => {
                  if (chart.getActiveElements().length) {
                    const activePoint = chart.getActiveElements()[0];
                    const chartArea = chart.chartArea;
                    const ctx = chart.ctx;
                    ctx.save();
                    // grey vertical hover line - full chart height
                    ctx.beginPath();
                    ctx.moveTo(activePoint.element.x, chartArea.top);
                    ctx.lineTo(activePoint.element.x, chartArea.bottom);
                    ctx.lineWidth = 2;
                    ctx.strokeStyle = "rgba(0,0,0, 0.1)";
                    ctx.stroke();
                    ctx.restore();

                    // colored vertical hover line - ['data point' to chart bottom] - only for charts 1 dataset
                    if (chart.data.datasets.length === 1) {
                      ctx.beginPath();
                      ctx.moveTo(activePoint.element.x, activePoint.element.y);
                      ctx.lineTo(activePoint.element.x, chartArea.bottom);
                      ctx.lineWidth = 2;
                      ctx.stroke();
                      ctx.restore();
                    }
                  }
                },
              },
            ]}
          />
        </div>
        <DataTable columns={columns} data={mockData} />
      </div>
    </>
  );
}
