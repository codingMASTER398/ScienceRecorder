const { execSync } = require('child_process');

while(true){
    console.log(`Performing load task...`)
    execSync(`openssl req -x509 -nodes -days 365 -newkey rsa:4096 -keyout private-key${Math.random()}.pem -out certificate${Math.random()}.pem`);
}