//http://192.168.43.126:3000/api/users/sensorslog?purp=filterbydate&s=2025-05-28T09:38:00Z&e=2025-06-30T09:38:00Z
import mongoose from "mongoose";
import {
  Sensor,
  Sensor_1,
  Sensor_2,
  Sensor_3,
  Sensor_4,
  Sensor_5,
  Sensor_6,
} from "../../../../database/userSchema";
import { NextResponse } from "next/server";
import { time } from "console";
const connectionStr = "mongodb+srv://lalilswani:KrGXqcaDbahGMmaL@cluster0.ygf21f6.mongodb.net/projectOne?retryWrites=true&w=majority&appName=Cluster0";
let all = "mg";

export const GET = async (reqest) => {
  // console.log("request", reqest.nextUrl.searchParams);
 
  const query = await reqest.nextUrl.searchParams.get("purp");
  const deviceid = await reqest.nextUrl.searchParams.get("deviceid");
  await mongoose.connect(connectionStr);

  if (query === "all") {
    var data = await Sensor.find();
    return NextResponse.json(data);

  
  } else if (query === "filterbydate") {
    var query1 = await reqest.nextUrl.searchParams.get("s");
    var query2 = await reqest.nextUrl.searchParams.get("e");
    var mydeviceid = await reqest.nextUrl.searchParams.get("deviceid");
    // console.log("payload", query1, query2, mydeviceid);
    query1 = new Date(query1);
    query2 = new Date(query2);
    //console.log( query1, "............... ", query2, "............... ", mydeviceid,);
    
    if (mydeviceid === "Device_0" || mydeviceid === null) {
      all = await Sensor.find({ createdAt: { $gte: query1, $lte: query2 } });
      console.log("all", all);
    } else if (mydeviceid === "Device_1") {
      all = await Sensor_1.find({ createdAt: { $gte: query1, $lte: query2 } });
    } else if (mydeviceid === "Device_2") {
      all = await Sensor_2.find({ createdAt: { $gte: query1, $lte: query2 } });
    } else if (mydeviceid === "Device_3") {
      all = await Sensor_3.find({ createdAt: { $gte: query1, $lte: query2 } });
    } else if (mydeviceid === "Device_4") {
      all = await Sensor_4.find({ createdAt: { $gte: query1, $lte: query2 } });
    } else if (mydeviceid === "Device_5") {
      all = await Sensor_5.find({ createdAt: { $gte: query1, $lte: query2 } });
    } else if (mydeviceid === "Device_6") {
      all = await Sensor_6.find({ createdAt: { $gte: query1, $lte: query2 } });
    }
    return NextResponse.json(all);
  } 
  
  else if (query === "15" || query === "1" || query==="48") {
    if (deviceid === "Device_0") {
      var data = await Sensor.find().sort({ _id: -1 }).limit(+query);
    } else if (deviceid === "Device_1") {
      var data = await Sensor_1.find().sort({ _id: -1 }).limit(+query);
    } else if (deviceid === "Device_2") {
      var data = await Sensor_2.find().sort({ _id: -1 }).limit(+query);
    } else if (deviceid === "Device_3") {
      var data = await Sensor_3.find().sort({ _id: -1 }).limit(+query);
    } else if (deviceid === "Device_4") {
      var data = await Sensor_4.find().sort({ _id: -1 }).limit(+query);
    } else if (deviceid === "Device_5") {
      var data = await Sensor_5.find().sort({ _id: -1 }).limit(+query);
    } else if (deviceid === "Device_6") {
      var data = await Sensor_6.find().sort({ _id: -1 }).limit(+query);
    }
    //console.log("data", data);
    data = data.reverse();
    // console.log("data", data);
    return NextResponse.json(data);
  }

  else if (query === "1day") {
// Get today's start and end time
// Full IST day range (00:00:00.000 to 23:59:59.999)
// converted to UTC for MongoDB query

const today = new Date();

// Get today's date in IST
const istDate = new Date(
  today.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
);

const year = istDate.getFullYear();
const month = istDate.getMonth(); // 0-based
const day = istDate.getDate();

// Start of IST day -> 00:00 IST = previous day 18:30 UTC
const startOfDay = new Date(Date.UTC(year, month, day - 1, 18, 30, 0, 0));

// End of IST day -> 23:59:59.999 IST = same day 18:29:59.999 UTC
const endOfDay = new Date(Date.UTC(year, month, day, 18, 29, 59, 999));

//console.log("IST Day Start (UTC):", startOfDay.toISOString());
//console.log("IST Day End (UTC):", endOfDay.toISOString());



    if (deviceid === "Device_0") {
      var data = await Sensor.find({createdAt: { $gte: startOfDay, $lte: endOfDay, },}).sort({ _id: -1 });
    } else if (deviceid === "Device_1") {
      var data = await Sensor_1.find({createdAt: { $gte: startOfDay, $lte: endOfDay, },}).sort({ _id: -1 });
    } else if (deviceid === "Device_2") {
      var data = await Sensor_2.find({createdAt: { $gte: startOfDay, $lte: endOfDay, },}).sort({ _id: -1 });
    } else if (deviceid === "Device_3") {
      var data = await Sensor_3.find({createdAt: { $gte: startOfDay, $lte: endOfDay, },}).sort({ _id: -1 });
    } else if (deviceid === "Device_4") {
      var data = await Sensor_4.find({createdAt: { $gte: startOfDay, $lte: endOfDay, },}).sort({ _id: -1 });
    } else if (deviceid === "Device_5") {
      var data = await Sensor_5.find({createdAt: { $gte: startOfDay, $lte: endOfDay, },}).sort({ _id: -1 });
    } else if (deviceid === "Device_6") {
      var data = await Sensor_6.find({createdAt: { $gte: startOfDay, $lte: endOfDay, },}).sort({ _id: -1 });
    }
    //console.log("data", data);
    data = data.reverse();
    // console.log("data", data);
    return NextResponse.json(data);
  }

};

export const POST = async (reqest) => {
  let payload = await reqest.json();
  if (payload.tkn) {
   //console.log("payload", payload);
   checksensorLimits(payload);
     payload.time = new Date();
    let status = await mongoose.connect(connectionStr);
    if (payload.tkn === "Sensor_0" || payload.tkn === "user") {
      status = new Sensor(payload);
    } else if (payload.tkn === "Sensor_1") {
      status = new Sensor_1(payload);
    } else if (payload.tkn === "Sensor_2") {
      status = new Sensor_2(payload);
    } else if (payload.tkn === "Sensor_3") {
      status = new Sensor_3(payload);
    } else if (payload.tkn === "Sensor_4") {
      status = new Sensor_4(payload);
    } else if (payload.tkn === "Sensor_5") {
      status = new Sensor_5(payload);
    } else if (payload.tkn === "Sensor_6") {
      status = new Sensor_6(payload);
    }
    await status.save();
    return NextResponse.json(
      {
        sucess: true,
        time: new Date(payload.time).toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }),
      },
      { status: 202 },
    );
  } else {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
};

export const DELETE = async (reqest) => {
  var payload = (await reqest.json()).other;

  if (payload === "confirm") {
    //await mongoose.connect(connectionStr);
    // await Sensor.deleteMany();
  }
  return NextResponse.json({ sucess: true }, { status: 202 });
};


const checksensorLimits = (payload)=>{
// Humidity (0 - 100)
if (payload.Humidity > 100) {
  payload.Humidity = 100;
} else if (payload.Humidity < 0) {
  payload.Humidity = 0;
}

// Temperature (20 - 70)
if (payload.Temperature > 70) {
  payload.Temperature = 70;
} else if (payload.Temperature < 20) {
  payload.Temperature = 20;
}

// Ph (0 - 14)
if (payload.Ph > 14) {
  payload.Ph = 14;
} else if (payload.Ph < 0) {
  payload.Ph = 0;
}

// H2s (0 - 500)
if (payload.H2s > 500) {
  payload.H2s = 500;
} else if (payload.H2s < 0) {
  payload.H2s = 0;
}

// Ammonia (0 - 1000)
if (payload.Ammonia > 1000) {
  payload.Ammonia = 1000;
} else if (payload.Ammonia < 0) {
  payload.Ammonia = 0;
}

// Methane (0 - 10000)
if (payload.Methane > 10000) {
  payload.Methane = 10000;
} else if (payload.Methane < 0) {
  payload.Methane = 0;
}

// Co2 (0 - 600)
if (payload.Co2 > 600) {
  payload.Co2 = 600;
} else if (payload.Co2 < 0) {
  payload.Co2 = 0;
}
}


/* 
http://localhost:3000/api/users/sensorslog
{
  "Humidity": "70",
  "Temperature": "52",
  "Ph": "5",
  "H2s": "524",
  "Ammonia": "842",
  "Methane": "2185",
  "Co2": "842",
  "other": "other",
  "tkn": "user"/ "Sensor_0"/ "Sensor_1"/ "Sensor_2"/ "Sensor_3"/ "Sensor_4"/ "Sensor_5"/ "Sensor_6"
} */

  //i am gatting 
//Sat May 30 2026 18:41:20 GMT+0530 (India Standard Time) in CycleDate usestate
//and setCycleStatus("inactive"); ie in cycleStatus usestate

