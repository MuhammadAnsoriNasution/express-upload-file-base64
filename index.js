const Express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
var fs = require('fs');

const app = Express();
app.use(bodyParser.json({ limit: '100mb' }));

const Storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, './images');
  },
  filename(req, file, callback) {
    callback(null, `${file.fieldname}${Date.now()}${file.originalname}`);
  },
});

const upload = multer({ storage: Storage });

app.get('/', multer().none(), (req, res) => {
  res.status(200).send('You can post to /api/upload.');
});

app.post('/api/upload', multer().none(), (req, res) => {
  try {
    req.body.item.map((item, i) => {
      const folder = './'+item.folder
      let base64Image = item.image.split(';base64,').pop();
      if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder);
      }

      fs.writeFile(folder+'/'+item.name, base64Image, { encoding: 'base64' }, function (err) {
        console.log('File created');
      });
    })
    res.status(200).json({
      message: 'success!',
      status: true
    });
  } catch (error) {
    res.status(400).json({
      message: 'error!',
      status: false
    });
  }

});

app.listen(3000, () => {
  console.log('App running on http://localhost:3000');
});