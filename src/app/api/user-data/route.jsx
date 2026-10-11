import { NextResponse } from "next/server";
import { connectToMongoDB } from "@/utils/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId || !ObjectId.isValid(userId)) {
      return NextResponse.json({ error: "Valid user ID is required" }, { status: 400 });
    }

    const { client } = await connectToMongoDB();

    const user = await client
      .db("centerdb")
      .collection("user")
      .findOne(
        { _id: new ObjectId(userId) },
        { projection: { password: 0 } } // everything except password
      );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ data: { ...user, _id: user._id.toString() } });
  } catch (error) {
    console.error("Fetch data error:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}