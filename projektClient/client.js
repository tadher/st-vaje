var express = require('express'),
    app = express();

app.use(express.static('public'));

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.listen(3080, function () {
  console.log('Example app listening on port 3080!')
})