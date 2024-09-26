const amqplib = require("amqplib");

const exchangeName = "direct_exchange";
const args = process.argv.slice(2); // Get from third to last part of the command. Ignore node filename
const routing = args[0]; // get the first one as type
const msg = args[1] || "Everything Working Fine";

console.log("Command Line", args, msg);

const sendMessage = async () => {
  const connection = await amqplib.connect("amqp://localhost");
  const channel = await connection.createChannel();
  await channel.assertExchange(exchangeName, "direct", { durable: false });
  channel.publish(exchangeName, routing, Buffer.from(msg));
  console.log("Message Send ", msg);

  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500);
};

sendMessage();

// Ex: node emit_logs.js error "Some Error message"