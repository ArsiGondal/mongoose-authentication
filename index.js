const mongoose = require('mongoose');
const app = require('./app');

mongoose.connect('mongodb://localhost:27017/testApi',
{useNewUrlParser: true}).then(() => console.log('Succefully Connected to Database!'));

const port = 3000;
const server = app.listen(port , () => {
    console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection' , err => {
    console.log('UNHANDLED REJECTION. SHUTTING DOWN....');
    console.log(err.name,err.message);
    server.close(() => {
        process.exit(1);
    });
});
