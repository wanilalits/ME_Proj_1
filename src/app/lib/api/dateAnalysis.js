export const getDateAnalysis = async (deviceid) => {
  //console.log(deviceid);
  try {
    // 1. Get cycle data
    const cycleRes = await fetch(`/api/users/cycles?deviceid=${encodeURIComponent(deviceid)}`);
    const cycleResult = await cycleRes.json();

    if (!cycleResult.data) {
     // console.log("No cycle data");
      return null;
    }

    // 2. Get enddate
    const enddate = cycleResult.data.enddate;
    //console.log("End Date:", enddate);

    // 3. Call second API
    const res = await fetch(`/api/dateanalysis?purp=dateanalysis&deviceid=${encodeURIComponent(deviceid)}&date=${encodeURIComponent(enddate)}`);
    const result = await res.json();
    console.log(result);

    // return data
    return result;
  } catch (err) {
    console.log(err);
    return null;
  }
};
