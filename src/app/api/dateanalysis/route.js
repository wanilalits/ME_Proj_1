import mongoose from "mongoose";
import {
  Sensor,
  Sensor_1,
  Sensor_2,
  Sensor_3,
  Sensor_4,
  Sensor_5,
  Sensor_6,
} from "../../../database/userSchema";
//"../../../../database/userSchema";
import { NextResponse } from "next/server";
import { time } from "console";
const connectionStr = "mongodb+srv://lalilswani:KrGXqcaDbahGMmaL@cluster0.ygf21f6.mongodb.net/projectOne?retryWrites=true&w=majority&appName=Cluster0";
let all = "mg";


export const GET = async (reqest) => {
  // console.log("request", reqest.nextUrl.searchParams);
 console.log("request....................");
  const query = await reqest.nextUrl.searchParams.get("purp");
  const deviceid = await reqest.nextUrl.searchParams.get("deviceid");
  await mongoose.connect(connectionStr);

 if (query === "dateanalysis") {

  const dateParam = await reqest.nextUrl.searchParams.get("date");
  const mydeviceid = await reqest.nextUrl.searchParams.get("deviceid");

  //const targetDate = new Date(dateParam);

  
const selected = new Date(dateParam);
const start = new Date(
  `${selected.toLocaleDateString("en-CA")}T00:00:00+05:30`
);
  // END OF DAY
const end = new Date(
  `${selected.toLocaleDateString("en-CA")}T23:59:59.999+05:30`
);



 // const start = new Date(targetDate);
 // start.setHours(0, 0, 0, 0);
 // const end = new Date(targetDate);
 // end.setHours(23, 59, 59, 999);
// START OF DAY






  let Model = Sensor;
  if (mydeviceid === "Device_1") {
    Model = Sensor_1;
  } else if (mydeviceid === "Device_2") {
    Model = Sensor_2;
  } else if (mydeviceid === "Device_3") {
    Model = Sensor_3;
  } else if (mydeviceid === "Device_4") {
    Model = Sensor_4;
  } else if (mydeviceid === "Device_5") {
    Model = Sensor_5;
  } else if (mydeviceid === "Device_6") {
    Model = Sensor_6;
  }

  // =========================================================
  // CURRENT DATE COUNT
  // =========================================================

  const currentCount = await Model.countDocuments({
    createdAt: {
      $gte: start,
      $lte: end,
    },
  });

  // =========================================================
  // PREVIOUS DATE WHERE DATA EXISTS
  // =========================================================

  const previousRecord = await Model.findOne({
    createdAt: { $lt: start },
  })
    .sort({ createdAt: -1 });

  let previousDate = null;
  let previousCount = 0;

  if (previousRecord) {

    previousDate = new Date(previousRecord.createdAt);

    const prevStart = new Date(previousDate);
    prevStart.setHours(0, 0, 0, 0);

    const prevEnd = new Date(previousDate);
    prevEnd.setHours(23, 59, 59, 999);

    previousCount = await Model.countDocuments({
      createdAt: {
        $gte: prevStart,
        $lte: prevEnd,
      },
    });
  }

  // =========================================================
  // NEXT DATE WHERE DATA EXISTS
  // =========================================================

  const nextRecord = await Model.findOne({
    createdAt: { $gt: end },
  })
    .sort({ createdAt: 1 });

  let nextDate = null;
  let nextCount = 0;

  if (nextRecord) {

    nextDate = new Date(nextRecord.createdAt);

    const nextStart = new Date(nextDate);
    nextStart.setHours(0, 0, 0, 0);

    const nextEnd = new Date(nextDate);
    nextEnd.setHours(23, 59, 59, 999);

    nextCount = await Model.countDocuments({
      createdAt: {
        $gte: nextStart,
        $lte: nextEnd,
      },
    });
  }

  // =========================================================
  // TODAY COUNT
  // =========================================================

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const todayCount = await Model.countDocuments({
    createdAt: {
      $gte: todayStart,
      $lte: todayEnd,
    },
  });

  return NextResponse.json({
    success: true,

    selectedDate: start,
    selectedDateCount: currentCount,

    previousDate,
    previousDateCount: previousCount,

    nextDate,
    nextDateCount: nextCount,

    today: new Date(),
    todayCount,
  });
}



};
 