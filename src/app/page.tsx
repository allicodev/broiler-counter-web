"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { ColumnDef } from "@tanstack/react-table";
import { LogOut, Settings } from "lucide-react";
import Cookie from "js-cookie";
import axios from "axios";
import dayjs from "dayjs";

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
import AnalyticalCard from "@/components/customs/analytical_card";
import { DataTable } from "@/components/tables/recent_data-tables";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Broiler } from "@/types";

import {
  Tooltip as STooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

ChartJS.register(
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  LinearScale,
  BarElement
);

export default function HomePage() {
  const { toast } = useToast();

  const [broilers, setBroiler] = useState<Broiler[]>([]);
  const [broilersRaw, setBroilerRaw] = useState<Broiler[]>([]);
  const [totals, setTotal] = useState({ total: 0, totalToday: 0 });
  const [openUpdate, setOpenUpdate] = useState(false);
  const [pins, setPins] = useState({
    pin: "",
    newPin: "",
    confirmPin: "",
  });

  const [isValidating, setIsValidating] = useState(false);

  const [error, setError] = useState({ isError: false, errorMsg: "" });
  const [error2, setError2] = useState({ isError: false, errorMsg: "" });

  const validatePinUpdate = async () => {
    setIsValidating(true);
    let { data } = await axios.get("/api/init", {
      params: {
        pin: pins.pin,
      },
    });

    if (data.code == 201) {
      setError({ isError: true, errorMsg: "Incorrect Pin" });
      setIsValidating(false);
      return;
    } else {
      setError({ isError: false, errorMsg: "" });
      setIsValidating(false);

      if (pins.newPin != pins.confirmPin) {
        setError2({ isError: true, errorMsg: "Pin don't match" });
        setIsValidating(false);
        return;
      }
    }

    let res = await axios.post("/api/init", {
      pin: pins.newPin,
    });

    if (res?.data?.success) {
      toast({
        title: "Successfully Updated",
      });
      setOpenUpdate(false);
      setPins({ pin: "", newPin: "", confirmPin: "" });
    }
  };

  const columns: ColumnDef<Broiler>[] = [
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ getValue }) => (
        <div className="text-center">
          {dayjs(getValue() as any).format("MMM DD, 'YY hh:mma")}
        </div>
      ),
    },

    {
      accessorKey: "count",
      header: "Broiler Count",
      cell: ({ getValue }) => (
        <div className="text-center">{getValue() as ReactNode}</div>
      ),
    },
  ];

  const getData = async () => {
    const { data } = await axios.get("/api/broiler-web");
    if (data?.success ?? false) return data?.data;
  };

  const getData2 = async () => {
    const { data } = await axios.get("/api/broiler");
    if (data?.success ?? false) return data?.data;
  };

  useEffect(() => {
    (async () => {
      let _ = new Array(12).fill(0);
      let __ = await getData();
      let _broilers = __.broilers;

      setTotal({
        total: __.total,
        totalToday: __.totalToday,
      });

      setBroilerRaw(await getData2());

      for (let i = 0; i < _broilers.length; i++) {
        _[_broilers[i].month - 1] = _broilers[i].count;
      }

      setBroiler(_);
    })();
  }, []);

  return (
    <TooltipProvider>
      <div className="flex flex-row justify-end gap-2 mt-10 mr-10">
        <Dialog open={openUpdate} onOpenChange={setOpenUpdate}>
          <STooltip>
            <DialogTrigger asChild>
              <TooltipTrigger asChild>
                <Button onClick={() => setOpenUpdate(true)}>
                  <Settings className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
            </DialogTrigger>
            <TooltipContent>
              <p>Update PIN</p>
            </TooltipContent>
            <DialogContent
              style={{
                width: 320,
              }}
            >
              <DialogTitle>Update Pin</DialogTitle>
              <div className="flex items-center gap-4">
                <p>Enter Old Pin</p>
                {error.isError && (
                  <span className="px-2 py-1 text-sm text-red-500">
                    *{error.errorMsg}
                  </span>
                )}
              </div>
              <InputOTP
                maxLength={6}
                value={pins.pin}
                disabled={isValidating}
                onChange={(e) => setPins({ ...pins, pin: e })}
                autoFocus
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              <div className="flex items-center gap-4">
                <p>Enter New Pin</p>
                {error2.isError && (
                  <span className="px-2 py-1 text-sm text-red-500">
                    *{error2.errorMsg}
                  </span>
                )}
              </div>
              <InputOTP
                maxLength={6}
                value={pins.newPin}
                disabled={isValidating}
                onChange={(e) => setPins({ ...pins, newPin: e })}
                autoFocus
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              <p>Enter Confirm Pin</p>
              <InputOTP
                maxLength={6}
                value={pins.confirmPin}
                disabled={isValidating}
                onChange={(e) => setPins({ ...pins, confirmPin: e })}
                autoFocus
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              <Button
                disabled={
                  Object.values(pins).filter(
                    (e) => e == "" || e == null || e.length < 6
                  ).length > 0
                }
                onClick={validatePinUpdate}
              >
                UPDATE
              </Button>
            </DialogContent>
          </STooltip>
        </Dialog>
        <Button
          onClick={() => {
            Cookie.remove("isLoggedIn");
            Cookie.remove("lastPin");
            toast({
              title: "Successfully Logout",
              description: "Redirecting....",
            });

            setTimeout(() => window.location.reload(), 1000);
          }}
        >
          {/* supposedly link is not needed here but for formality lets include this here*/}
          <LogOut className="w-4 h-4 mr-2" /> Logout
        </Button>
      </div>
      <div className="flex min-h-screen justify-evenly">
        <div className="flex flex-col w-2/3 gap-y-8">
          <div className="flex gap-x-8">
            <AnalyticalCard
              title="Total Broiler Counted"
              value={totals.total}
            />
            <AnalyticalCard
              title="Total Broiler Counted Today"
              value={totals.totalToday}
            />
          </div>
          <Bar
            data={{
              labels: jason.months,
              datasets: [
                {
                  label: "Broiler",
                  data: broilers,
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
        <DataTable columns={columns} data={broilersRaw} />
      </div>
    </TooltipProvider>
  );
}
