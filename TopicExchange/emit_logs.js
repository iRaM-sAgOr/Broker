const amqplib = require("amqplib");
const exchangeName = "topic_exchange";

const args = process.argv.slice(2);
const topic = args[0];
const msg = args[1] || "Demo Topics Exchange";

const sendMessage = async () => {
  try {
    const connection = await amqplib.connect("amqp://localhost");
    const channel = await connection.createChannel();
    await channel.assertExchange(exchangeName, "topic", { durable: false });

    channel.publish(exchangeName, topic, Buffer.from(msg));
    console.log("[x] send message ", msg);
    setTimeout(() => {
      connection.close();
      process.emit(0);
    }, 500);
  } catch {}
};

sendMessage();

// node TopicExchange/emit_logs.js  "us.error" 'here is a error'