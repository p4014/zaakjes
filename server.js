var express = require('express'),
emp = require('./routes/employee');
var app = express();
app.use(express.static(__dirname));
app.get('/employees', emp.findAll);
app.get('/somPerMaand', emp.cumulate);
app.get('/categorie', emp.categorie);
app.get('/clean', emp.cleanData);
app.post('/post', emp.addEmp);
app.post('/postCategorie', emp.addCat);
app.put('/employee/:id', emp.updateEmp);
app.get('/employeeed', emp.findByDate);
app.delete('/employee/:id', emp.deleteEmp);
app.listen(3000);
console.log('Listening on port 3000...');
var mongo = require('mongodb');
var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;
var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('local', server);
db.createCollection('BankZaken');
db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'empdb' database");
        db.collection('BankZaken', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'empdata' collection doesn't exist. Creating it with sample data...");
              populateDB();
            }
        });
    }
});
var populateDB = function() {
  var employees = [
    {
        id: "1",
        name: "John",
        dob: "08/06/1977",
        gender: "Male",
        designation: "Consultant"
    },
      {
        id: "2",
        name: "Robert",
        dob: "09/08/1977",
        gender: "Male",
        designation: "Sr.Consultant"
    }
    ];
  db.collection('empdata', function(err, collection) {
        collection.insert(employees, {safe:true}, function(err, result) {});
    });
};