import dbConnect from "@/database/dbConnect";
import Broiler from "@/database/model/broiler";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

import { type NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  await dbConnect();

  const searchParams = req.nextUrl.searchParams;
  let year = searchParams.get("year");

  if (!year) year = new Date().getFullYear().toString();

  const totalBroiler = (await Broiler.find().select("count")).reduce(
    (p, n) => p + n.count,
    0
  );

  const totalBroilerToday = (
    await Broiler.find({
      $and: [
        {
          createdAt: {
            $gte: dayjs().tz("Asia/Manila").startOf("day").toDate(),
          },
        },
        {
          createdAt: {
            $lte: dayjs().tz("Asia/Manila").endOf("day").toDate(),
          },
        },
      ],
    }).select("count")
  ).reduce((p, n) => p + n.count, 0);

  return await Broiler.aggregate([
    {
      $match: {
        $expr: {
          $eq: [{ $year: "$createdAt" }, parseInt(year)],
        },
      },
    },
    {
      $group: {
        _id: {
          month: { $month: "$createdAt" },
        },
        count: { $sum: "$count" },
      },
    },
    {
      $project: {
        _id: 0,
        month: "$_id.month",
        count: 1,
      },
    },
  ])
    .then((result) => {
      return Response.json(
        {
          success: true,
          code: 200,
          data: {
            broilers: result,
            total: totalBroiler,
            totalToday: totalBroilerToday,
          },
        },
        { status: 200 }
      );
    })
    .catch((err) => {
      console.error(err);
    });
}

export async function POST(req: Request) {
  await dbConnect();
  let body = await req.json();
  const count = body?.broiler ?? 0;
  await Broiler.create({ count });

  return Response.json(
    { success: true, code: 200, message: "Sent Successfully" },
    { status: 200 }
  );
}
