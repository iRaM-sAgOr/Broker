const amqplib = require("amqplib");

const exchangeName = "direct_exchange";

const args = process.argv.slice(2);

if (args.length == 0) {
  console.log("Please provide the routing type from [info] [warning] [error]");
  process.exit(0);
}

const receiveMessage = async () => {
  try {
    const connection = await amqplib.connect("amqp://localhost");
    const channel = await connection.createChannel();
    await channel.assertExchange(exchangeName, "direct", { durable: false });
    const q = await channel.assertQueue("", { exclusive: true });
    console.log("Consumer Waiting for Message ", q.queue);

    args.forEach((binding) => {
      channel.bindQueue(q.queue, exchangeName, binding);
    });

    channel.consume(
      q.queue,
      (msg) => {
        if (msg.content) {
          console.log("Received Message: ", msg.content.toString());
        }
      },
      { noAck: true }
    );
  } catch (e) {
    console.log(e);
  }
};

receiveMessage();

// one: node receive_logs.js error
// two: node receive_logs.js error info
// three: node receive_logs.js warning info
