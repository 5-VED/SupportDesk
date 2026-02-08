//  Set up kafka producer

const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:9092'],
});

const producer = kafka.producer();

const kafkaProducer = async (topic = "", partition = 0, message = {}) => {
    await producer.connect();
    await producer.send({
        topic: topic,
        messages: [
            { partition: partition, value: JSON.stringify(message) },
        ],
    });
};


module.exports = { kafkaProducer };