import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { ObjectId } from "mongodb";
import { connectToMongoDB } from "@/utils/mongodb";

// One cache entry per user
const getUserById = (userId) =>
  unstable_cache(
    async () => {
      const { client } = await connectToMongoDB();
      const user = await client
        .db("centerdb")
        .collection("user")
        .findOne(
          { _id: new ObjectId(userId) },
          { projection: { password: 0 } }
        );

      if (!user) return null;
      return { ...user, _id: user._id.toString() };
    },
    ["user-data", userId],                         // cache key
    { revalidate: 300, tags: [`user-${userId}`] }  // 5 min TTL + tag for manual clearing
  )();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId || !ObjectId.isValid(userId)) {
      return NextResponse.json({ error: "Valid user ID is required" }, { status: 400 });
    }

    const user = await getUserById(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { data: user },
      { headers: { "Cache-Control": "private, max-age=60, stale-while-revalidate=300" } }
    );
  } catch (error) {
    console.error("Fetch data error:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}