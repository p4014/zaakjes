var transactions = {"Transactions":{ }};
exports.findAll = function(req, res) {
    db.collection('BankZaken', function(err, collection) {
    	collection.find().forEach(function(data) {
    		var date = data.Datum;
    		var year = date.slice(0,4);
    		var month = date.slice(4,6);
    		var day = date.slice(6,8)
    		var newDate = year.concat('-').concat(month).concat('-').concat(day);
    		console.log(newDate);
    		
    		data.Datum = new Date(newDate);
    		collection.save(data)
    	    collection.update({
    	        "_id": data._id,
    	    }, {
    	        "$set": {
    	            "Bedrag": parseFloat(data.Bedrag)
    	        }
    	    });
    	});
        collection.find().toArray(function(err, items) {
        	transactions.Transactions = items;
        	
            res.send(transactions);
        });
    });
};
exports.cumulate = function(req, res) {
 var aggregate =  db.collection('BankZaken');
 	aggregate.aggregate([
 	  {$match:{
 		  Bedrag : {
 			 $exists : true
 		  }
 	  }},
 	  {
 	    $group: {
 	       _id: {
 	    	   rekening: "$Rekening",
 	    	   af_Bij: "$Af Bij",
 	    		 ord_date: {
	              month: { $month: "$Datum" },
	              year: { $year: "$Datum"}
	 	    	}
 	       },
 	       total: {
 	         $sum: "$Bedrag"
 	       }
 	     
 		}
 	   }]).toArray(function(err, items){
 	 transactions.Transactions = items;
	 console.log(items);
        });
 	
 	res.send(transactions);
};

exports.addEmp = function(req, res) {
    var emp = req.body;
    console.log('Adding record: ' + JSON.stringify(emp));
    db.collection('BankZaken', function(err, collection) {
        collection.insert(emp, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}
exports.deleteEmp = function(req, res) {
var empToDelete = req.params.id;
db.collection('BankZaken',function(err,collection){
collection.remove({'id':empToDelete},function(err){
  res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
})
})
}
exports.updateEmp = function(req, res) {
  var id = req.params.id;
    var emp = req.body;
  db.collection('BankZaken', function(err, collection) {
        collection.update({'id':id},emp,function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}
exports.findByDate= function (req,res) {
	var empId = req.params.Datum;
	console.log(empId);
	console.log(req)
	db.collection('BankZaken',function (err,collection) {
		   collection.find( {  Datum: empId } ).toArray(function(err, items) {
	            res.send(items);
	        });
		
		})
	}