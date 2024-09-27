const amqplib = require("amqplib");
const queueName = "worker";

const receiveMessage = async () => {
  const connection = await amqplib.connect("amqp://localhost");
  const channel = await connection.createChannel();
  await channel.assertQueue(queueName, { durable: true });
  channel.prefetch(1); // balanced round robbin process
  console.log("Waiting for image processing command to come");
  let sec = 0;
  channel.consume(
    queueName,
    (msg) => {
      if (msg.content) {
        console.log("[y] Received message:", msg.content.toString());
        sec = msg.content.toString().split(".").length - 1;
      }
      setTimeout(() => {
        console.log("Image processing [Done]");
        channel.ack(msg);
      }, sec * 1000);
    },
    { noAck: false }
  );
};

receiveMessage();
