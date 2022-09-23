var  express = require('express');

const app = express();

app.use(express.static(__dirname + '/public'));

app.listen(3000, () => {
    console.log("Application Started!");
    console.log('http://localhost:3000');
});