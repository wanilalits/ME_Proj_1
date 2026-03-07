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
const connectionStr =
  "mongodb+srv://lalilswani:KrGXqcaDbahGMmaL@cluster0.ygf21f6.mongodb.net/projectOne?retryWrites=true&w=majority&appName=Cluster0";
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
    console.log(query1, "............... ", query2, "............... ", mydeviceid);
     if ((mydeviceid === "Device_0") || (mydeviceid === null)) {
    all = await Sensor.find({ createdAt: { $gte: query1, $lte: query2 }  });
    //console.log("all", all);
  }
    else if (mydeviceid === "Device_1") {
      all = await Sensor_1.find({ createdAt: { $gte: query1, $lte: query2 }  });
    } else if (mydeviceid === "Device_2") {
      all = await Sensor_2.find({ createdAt: { $gte: query1, $lte: query2 }  });
    } else if (mydeviceid === "Device_3") {
      all = await Sensor_3.find({ createdAt: { $gte: query1, $lte: query2 }  });
    } else if (mydeviceid === "Device_4") {
      all = await Sensor_4.find({ createdAt: { $gte: query1, $lte: query2 }  });
    } else if (mydeviceid === "Device_5") {
      all = await Sensor_5.find({ createdAt: { $gte: query1, $lte: query2 }  });
    } else if (mydeviceid === "Device_6") {
      all = await Sensor_6.find({ createdAt: { $gte: query1, $lte: query2 }  });
    } 











    return NextResponse.json(all);
  } else if ((query === "15") || (query === "1")) {
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
};

export const POST = async (reqest) => {
  let payload = await reqest.json();
  if (payload.tkn) {
   // console.log("payload", payload);
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
    return NextResponse.json({ sucess: true }, { status: 202 });
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
