var transactions = {"Transactions":{ }};
var somTransactions = {"Transactions":{ }};
var categorie = {"Categorie":{ }};
exports.findAll = function(req, res) {
    db.collection('BankZaken', function(err, collection) {
    	
        collection.find().toArray(function(err, items) {
        	transactions.Transactions = items;
        	
            res.send(transactions);
        });
    });
};
exports.categorie = function(req, res) {
    db.collection('Categorie', function(err, collection) {
    	
        collection.find().toArray(function(err, items) {
        	categorie.Categorie = items;
        	
            res.send(categorie);
        });
    });
};
exports.cumulate = function(req, res) {
 var aggregate =  db.collection('BankZaken');
 	aggregate.aggregate([
	 	 {
	 	 	$project:{
	 	 		rekening: "$Rekening",
	            month: { $month: "$Datum" },
	            year: { $year: "$Datum"},
	           	mutatie : {
	           		$switch:{
	           			branches: [
           					{ case: { $eq: ["$Code", "GT"] },
	           					then: { $switch:{
		           							branches: [
		           							{ case: { $eq: ["$Tegenrekening", ""] },
		           								then: "Spaar" }
		           							],
	           						default:
	           						"Regulier"
	           						}
	           					}
           					}
	           			],
	           				default:
	           				"Regulier"
	           			
	           		}
	           	},
	            bedrag_minus :
	 	    	{
	 	    		$switch: {
	      				branches: [
	         				{ case: { $eq: [ "$Af Bij", "Af" ] }, 
	         				then: {$multiply: ["$Bedrag", -1 ]} }
	         			],
	         			default : 
	         			"$Bedrag"
 	  				}
 	  			}
 	  		}},{
 	       $group: {
 	       _id: {
 	    	    rekening: "$rekening",
	            month: "$month",
	            year: "$year",
	            mutatie: "$mutatie"
	          
	      },
	  
 	       total: {
 	         $sum: "$bedrag_minus"
 	       }
 	     }
 		
 	   	
 	}]).toArray(function(err, items){
	 	 somTransactions.Transactions = items;
		 console.log(somTransactions.Transactions);
		console.log(err);
        });
 	
 	res.send(somTransactions);
};

exports.cleanData = function(req, res){
	db.collection('BankZaken', function(err, collection) {
	collection.find().forEach(function(data) {
		if(typeof data.Datum === 'string'){
		var date = data.Datum;
		var year = date.slice(0,4);
		var month = date.slice(4,6);
		var day = date.slice(6,8)
		var newDate = year.concat('-').concat(month).concat('-').concat(day);
		console.log(newDate);
		
		data.Datum = new Date(newDate);
		collection.save(data)
		}
		if(typeof data.Bedrag === 'string'){
	    collection.update({
	        "_id": data._id,
	    }, {
	        "$set": {
	            "Bedrag": parseFloat(data.Bedrag)
	        }
	    });
		}
	});
	});
};

exports.addEmp = function(req, res) {
	console.log(req.query);
    var json = req.query;

    json.Datum = new Date(json.Datum);
    json.Bedrag = parseFloat(json.Bedrag.replace(',', '.'));
    console.log(json.Datum);
    //console.log('Adding record: ' + JSON.stringify(json));
    db.collection('BankZaken', function(err, collection) {
    	 collection.insert( json, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result));
                res.send(result);
            }
        });
    });
};

exports.addCat = function(req, res) {
	console.log(req.query);
    var json = req.query;

    db.collection('Categorie', function(err, collection) {
    	 collection.insert( json, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
                console.log(err);
            } else {
                console.log('Success: ' + JSON.stringify(result));
                res.send(result);
            }
        });
    });
};
exports.deleteEmp = function(req, res) {
var empToDelete = req.params.id;
db.collection('BankZaken',function(err,collection){
collection.remove({'id':empToDelete},function(err){
  res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
})
})
};
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
};
exports.findByDate= function (req,res) {
	db.collection('BankZaken', function(err, collection) {
      
        collection.find().toArray(function(err, items) {
          transactions.Transactions = items;
          
            res.send(transactions);
        });
    });
	};