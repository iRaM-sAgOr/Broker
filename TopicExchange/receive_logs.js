const amqplib = require("amqplib");
const exchangeName = "topic_exchange";

const args = process.argv.slice(2);

if (args.length == 0) {
  console.log("Please provide the routing key");
  process.exit(1);
}

const receiveMessage = async () => {
  try {
    const connection = await amqplib.connect("amqp://localhost");
    const channel = await connection.createChannel();
    await channel.assertExchange(exchangeName, "topic", { durable: false });

    const q = await channel.assertQueue("", { exclusive: true });
    console.log("Consumer waiting for message", q.queue);

    args.forEach((binding) => {
      channel.bindQueue(q.queue, exchangeName, binding);
    });
    channel.consume(
      q.queue,
      (msg) => {
        if (msg.content) {
          console.log("Receive Message ", msg.content.toString());
        }
      },
      { noAck: true }
    );
  } catch (e) {
    console.log("Error ", e);
  }
};

receiveMessage();


//  node TopicExchange/receive_logs.js "*.error"