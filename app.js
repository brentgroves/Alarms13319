// https://github.com/vpulim/node-soap
const mqtt = require("mqtt");
var datetime = require("node-datetime");
const common = require('@bgroves/common');

var mqttClient;

var { MQTT_SERVER } = process.env;

// At the bottom of the wsdl file you will find the http address of the service

// CNC422
// WorkcenterGroup/WorkCenter
// GA FWD Knuckle/FWD BE 517
// Plex Workcenter: 61420

function SoundAlarm1(transDate) {
  common.log(`SoundAlarm1: ${transDate}`);

  let msg = {
    TransDate: transDate,
  };
  let msgString = JSON.stringify(msg);
  common.log(msg);
  mqttClient.publish("Alarm13319-1", msgString);
  return;
}

function SoundAlarm2(transDate) {
  // log(`SoundAlarm2: ${this.transDate}`);
  common.log(`SoundAlarm2: ${transDate}`);

  let msg = {
    TransDate: transDate,
  };
  let msgString = JSON.stringify(msg);
  common.log(msg);
  mqttClient.publish("Alarm13319-2", msgString);
  return;
}

function CheckForAlarm1() {
  var dt = datetime.create();
  var transDate = dt.format("Y-m-d H:M");
  var min = dt.format("M");
  common.log(`CheckForAlarm1: ${min}`);

  if (
    min === "00" ||
    min === "15" ||
    min === "30" ||
    // (min === '54') ||
    min === "45"
  ) {
    common.log("Set Alarm2 for 2 minutes from now.");
    // setInterval(SoundAlarm2.bind(params), 1000 * 60 * 2); // 2 mins past alarm1
    setTimeout(SoundAlarm2, 1000 * 60 * 2, transDate); // 2 mins past alarm1
    SoundAlarm1(transDate);
  }
}

function main() {
  try {
    common.log(`Starting Alarms13319`);
    common.log(`MQTT_SERVER=${MQTT_SERVER}`);
    // log(`MQTT=${MQTT}`)  // MQTT ALWAYS SAYS LOCALHOST!!
    mqttClient = mqtt.connect(`mqtt://${MQTT_SERVER}`);

    mqttClient.on("connect", function () {
      mqttClient.subscribe("presence", function (err) {
        if (!err) {
          mqttClient.publish("presence", "Hello mqtt");
        }
      });
    });
    setInterval(CheckForAlarm1, 1000 * 60);
  } catch (err) {
    console.log("Error !!!", err);
  }
}
main();
