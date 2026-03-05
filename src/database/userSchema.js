import mongoose from "mongoose"

const logModel = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    userID: {
        type: String,
        require: true,
        unique: true
    },
    country: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },

    HashPassword: {
        type: String,
        require: true,
    },
});
export const Log = mongoose.models.userdatas || mongoose.model('userdatas', logModel);

const sensorlogModel = new mongoose.Schema({

    Humidity: {
        type: String,
    },
    Temperature: {
        type: String,
    },
    Ph: {
        type: String,
    },

    H2s: {
        type: String,
    },
    Ammonia: {
        type: String,
    },
    Methane: {
        type: String,
    },
    Co2: {
        type: String,
    },

    time: {
        type: String,
    },
    other
        : {
        type: String,
    },
},
{timestamps: true }
);

export const Sensor = mongoose.models.sensorCollections || mongoose.model('sensorCollections', sensorlogModel);
export const Sensor_1 = mongoose.models.sensorCollections_1 || mongoose.model('sensorCollections_1', sensorlogModel);
export const Sensor_2 = mongoose.models.sensorCollections_2 || mongoose.model('sensorCollections_2', sensorlogModel);
export const Sensor_3 = mongoose.models.sensorCollections_3 || mongoose.model('sensorCollections_3', sensorlogModel);
export const Sensor_4 = mongoose.models.sensorCollections_4 || mongoose.model('sensorCollections_4', sensorlogModel);
export const Sensor_5 = mongoose.models.sensorCollections_5 || mongoose.model('sensorCollections_5', sensorlogModel);
export const Sensor_6 = mongoose.models.sensorCollections_6 || mongoose.model('sensorCollections_6', sensorlogModel);




