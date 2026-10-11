import { NextResponse } from "next/server";
import { connectToMongoDB } from "@/utils/mongodb";

export async function GET() {
  try {
    const { db } = await connectToMongoDB();

    const sampleStudent = {
      username: "Farrukh",
      fatherName: "Abdul Rasheed",
      password:'farrukh123',
      activeCourses: ["CIT", "English"],
      courseProgress: ["beginning", "middle", "complete"],
      teacherRemarks: "remarks example good"
    };

    const result = await db.collection("studentdata").insertOne(sampleStudent);

    return NextResponse.json({ 
      message: "Data uploaded successfully!", 
      insertedId: result.insertedId 
    }, { status: 201 });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Failed to upload" }, { status: 500 });
  }
}