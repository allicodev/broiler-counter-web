import dbConnect from "@/database/dbConnect";
import Broiler from "@/database/model/broiler";

export async function GET() {
  await dbConnect();
  let broilers = await Broiler.find().sort({ createdAt: -1 });
  return Response.json(
    { success: true, code: 200, data: broilers },
    { status: 200 }
  );
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

export async function OPTIONS() {
  return Response.json({}, { status: 200 });
}
