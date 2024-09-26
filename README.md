# Broker

# RabbitMq

1. Docker image:

   $ docker run -d -it --rm --network my_network \
    -p 5672:5672 -p 15672:15672 \
   --name rabbitmq \
   rabbitmq:management
   This command has no security for the web console
   Secured Docker broker image:

   $ docker run -d -it --rm --network my_network \
    -p 5672:5672 -p 15672:15672 \
    --name rabbitmq \
    -e RABBITMQ_DEFAULT_USER=<myuser> \
    -e RABBITMQ_DEFAULT_PASS=<mypassword> \
    rabbitmq:management

# Type of exhange of this broker

1. Fanout(No routing)
2. Direct(Routing match)
3. Topic(Routing Pattern Match)
4. Headers(Header match)

NB: By default the broker works as direct routing. Routing is the connection of producer and exchange. Binding checks the relation
between exchange and queue, consumer

# Flow

[Provider]------------(Routing)------->Exchange-------(Bing)--------->queue(1....n)---------->[Consumer]

Usecase:

1. As Worker:

   -- There could be a scenario where the main server may have some module that can process the image

   -- But the single module can not process images from different users at a time quickly. And the server become boomed

   -- Here we can distribute the processing module in some seperate service. Each service will take an image single time

   -- This process of handling one image processing task for one server will be handled by broker

   -- Request will come to the Main server to process images. Main server will send the request to the Broker

   -- Broker will distribute the task with balanced round robin algorithm among the servers

   -- Additional Features: Need to persist the data and queue even after broker restart

Flow

[API_Request]--------->[Main_Server]------->[Broker]-----(Distribute)----[Image_Processing_Services(1----n)]

2. Pub/Sub(Fanout)

    -- This work will required Exchange to introduce
    
    -- Producer will send the message to the exchange without any routing key

    -- Consumer will subscribe to the exchange with queue and will get all the message

3. Routing(Direct)-->store different log in different server

    -- Here Producer will send message to the exchange with exchangeName and routing key

    -- Consumer will subscribe exchange with a routing key.
    
    -- Consumer will get the message only if the routing key matches
