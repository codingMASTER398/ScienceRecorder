let machine = "test"

const fs = require(`fs`)

function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*(){}":>?<~|\\';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

String.prototype.replaceAt = function(index, replacement) {
    return this.substring(0, index) + replacement + this.substring(index + replacement.length);
}

function sendData(json){
    fetch(`http://localhost:3003/record/${machine}`, {
        headers: {
            "Content-Type": "Application/JSON"
        },
        method: "POST",
        body: JSON.stringify(json)
    }).then(()=>{
        console.log(`Recorded data successfully`)
    }).catch(console.error)
}

function diskTest(){
    let length = 10_000_000
    let id = makeid(length)

    let now = performance.now()
    fs.writeFileSync(`./disk.txt`, id)
    fs.writeFileSync(`./disk2.txt`, id)
    let readA = fs.readFileSync(`./disk.txt`).toString()
    let readB = fs.readFileSync(`./disk2.txt`).toString()
    let then = performance.now()
    let corruption = 0

    for(let i = 0; i < length; i++){
        if(readA.charAt(i) !== readB.charAt(i)){
            corruption++;
        }
    }

    fs.unlinkSync(`./disk.txt`)
    fs.unlinkSync(`./disk2.txt`)

    return {
        "took": then - now,
        corruption,
        length
    }
}

const si = require('systeminformation');

async function collectInfo(){
    let currentLoad = await si.currentLoad()
    currentLoad = currentLoad.currentLoad // wow, really?

    let battery = await si.battery()
    battery = battery.currentCapacity

    let cpuTemp = await si.cpuTemperature()
    cpuTemp = cpuTemp.main

    // TODO: Fan speed
    let fanSpeed = 0;

    ///
    let disk = diskTest();

    sendData({
        disk,
        fanSpeed,
        cpuTemp,
        battery,
        currentLoad,
        time: Date.now()
    })
}

collectInfo()
setInterval(() => {
    console.log(`Collecting data for ${new Date().toTimeString()}`)
    collectInfo()
}, 60000);