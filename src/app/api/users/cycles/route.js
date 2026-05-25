import mongoose from "mongoose";
import { cyclelog } from "../../../../database/userSchema"
import { NextResponse } from "next/server";
const connectionStr = "mongodb+srv://lalilswani:KrGXqcaDbahGMmaL@cluster0.ygf21f6.mongodb.net/projectOne?retryWrites=true&w=majority&appName=Cluster0";



async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(connectionStr);
  }
}

export async function POST(request) {
  try {
    const payload = await request.json();

    if (!payload.deviceid || !payload.Startdate || !payload.enddate) {
      return NextResponse.json(
        { success: false, message: "Send all required data" },
        { status: 400 }
      );
    }

    await connectDB();

    const result = await cyclelog.findOneAndUpdate(
      { deviceid: payload.deviceid },
      {
        $set: {
          Startdate: payload.Startdate,
          enddate: payload.enddate,
          days: payload.days,
        },
      },
      {
        new: true,
        upsert: true,
      }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Saved successfully",
        data: result,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const deviceid = searchParams.get("deviceid");

    if (!deviceid) {
      return NextResponse.json(
        { success: false, message: "deviceid is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const data = await cyclelog.findOne({ deviceid });

    if (!data) {
      return NextResponse.json(
        { success: false, message: "No data found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const deviceid = searchParams.get("deviceid");

    if (!deviceid) {
      return NextResponse.json(
        { success: false, message: "deviceid is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const deleted = await cyclelog.findOneAndDelete({ deviceid });

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "No record found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}

/* export const POST = async (request) => {
  try {
    const payload = await request.json();
    console.log(payload);

    // Validate required fields
    if (!payload.deviceid || !payload.Startdate || !payload.enddate) {
      return NextResponse.json(
        { warning: "Send all required data" },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await mongoose.connect(connectionStr);

    // Update if deviceid exists, otherwise insert new document
    const result = await cyclelog.findOneAndUpdate(
      { deviceid: payload.deviceid }, // search condition
      {
        $set: {
          Startdate: payload.Startdate,
          enddate: payload.enddate,
          days: payload.days,
        },
      },
      {
        new: true,      // return updated document
        upsert: true,   // create document if not found
      }
    );
console.log(result)
    return NextResponse.json(
      {
        success: true,
        message: "Data saved successfully",
        data: result,
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: "Server error",
        error: error.message,
      },
      { status: 500 }
    );
  }
};

// GET /api/cyclelog?deviceid=ABC123
export const GET = async (request) => {
  try {
    // Read query parameter
    const { searchParams } = new URL(request.url);
    const deviceid = searchParams.get("deviceid");

    // Validate
    if (!deviceid) {
      return NextResponse.json(
        { success: false, message: "deviceid is required" },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await mongoose.connect(connectionStr);

    // Find data by deviceid
    const data = await cyclelog.findOne({ deviceid });

    // If not found
    if (!data) {
      return NextResponse.json(
        { success: false, message: "No data found" },
        { status: 404 }
      );
    }

    // Return data
    return NextResponse.json(
      {
        success: true,
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Server error",
        error: error.message,
      },
      { status: 500 }
    );
  }
};
 */