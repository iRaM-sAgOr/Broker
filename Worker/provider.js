const amqplib = require("amqplib");

const queueName = "worker";
const msg = process.argv.slice(2).join(" ") || "image processing";

const sendWork = async () => {
  try {
    const connection = await amqplib.connect("amqp://localhost");
    const channel = await connection.createChannel();
    await channel.assertQueue(queueName, { durable: true }); // regenerate the queue after broker restart
    channel.sendToQueue(queueName, Buffer.from(msg), { persistent: true }); // persist the data
    console.log(" [x] Sent %s", msg);
    setTimeout(() => {
      connection.close();
      process.exit(0);
    }, 500);
  } catch {}
};

sendWork();
