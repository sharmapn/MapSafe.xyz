//original article of this application sample application = dapp university
//another one based on that = https://github.com/rsksmart/devportal/blob/2c6e21a9d057a9dcb9ba3b35268d3732fd8af41f/tutorials/tokens/create-a-collectable-token.md
// But we have since changed our approach where we instead mint from a central account

//important link for ethereum implementation
//https://ethereum.stackexchange.com/questions/42929/send-payment-from-wallet-using-web3

// START CODE ... API POST Listener 
// Refer to the following sources for more information on the API POST Listener code:
// https://github.com/bbachi/react-nodejs-example
// https://medium.com/bb-tutorials-and-thoughts/how-to-make-api-calls-in-react-applications-7758052bf69

// For reference, a lot of redundant code has been removed from this script,
// But remains in the 'server_BCK4deletion.js' file

const web3 = require('web3');
const ethers = require('ethers');
const express = require('express');
const Datastore = require('nedb');
const path = require('path');
const LocationNFT = require('./abis/Location.json')
//const nftAddress = require('/config')
//const fromAddress = require('../config')
//const fromAddress = "0x244EAbEf05ACF009746Ce91fE1712Daf3857e620"
//09-Jan-2023. This is the contract address
const contractAddress = "0x8dD5Ca941A9F839062b6589A2E3f701458B011A9" //"0xa505630672898f901A0c6B261A693C39f17e66B8"
//const address = '0x244EAbEf05ACF009746Ce91fE1712Daf3857e620'; //'0xAD8eD8FBA46BA6bE9120d0aEc43109A0543b69d3';
const privateKey = '';
//const provider = new Provider(privateKey, 'https://rinkeby.infura.io/v3/e90e21a0290f452386b3efa1dc8df355'); 
   
const app = express();
const port = 3000;	  

//rinkerby closed down, so we now use goerli
const NETWORK = 'goerli' //'rinkeby'

//nedb database 
const database = new Datastore('database.db');
database.loadDatabase();

//app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));

app.use(express.json()); 
const bodyParser = require('body-parser');
//app.use(bodyParser.urlencoded({ extended: true }));
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", function(req, res) {
  res.send("working fine");
  //res.sendFile(__dirname + "/index.html");
  //console.log(__dirname);
})

//https://stackabuse.com/nedb-a-lightweight-javascript-database/
app.get('/gethash', (request, response) => {
  database.find({}, (err, data) => {
    if (err) {
      response.end();
      return;
    }
    response.json(data);
  });
});

app.get('/checkForHash', (request, response) => {
	users.findOne({ twitter: '@ScottWRobinson' }, function(err, doc) {
		console.log('Found hash:', doc.hash);
	});
});

//Note I installed this : npm install --save body-parser
app.post('/posthash', async function (request, response) {
  console.log('Request received to post hash on server');
  var hashValue = request.body.hash;
  console.log('Received hash: ' + hashValue);	
  
  //this also works
  //var hvalue = JSON.stringify(req.body);
  //console.log('hvalue:' + hvalue);  
  
  //response.on('error', (err) => {
   //   console.error(err);
   // });
  
  if (!hashValue) {
		//console.log('empty hash ');	
        return response.status(400).send({ error:true, message: 'Please provide hash value' });
  }	else{	
	  const timestamp = Date.now();
	  //data.timestamp = timestamp;
	  //console.log(timestamp + ' Adding hash:::::', hashValue);
	  var time = getTimestamp();
	  console.log(time + ' Adding hash:::::', hashValue);
	  //response.send(time  + ' Minting hash value: ' + hashValue);
	  
    //call the mint function
	  var success = await mint(hashValue);	  
	  console.log('success' + success) ;//' Minted hash value: ' + hashValue + ' at ' + time);
	  response.send(success); //'time + ' Minted hash value: ' + hashValue');
  }
	
  //https://stackabuse.com/nedb-a-lightweight-javascript-database/	
  var transactionRecord = {
    datetimestamp: time,
    hash: hashValue
  };

   database.insert(transactionRecord, function(err, doc) {
		console.log('Inserted', doc.hash, 'with ID', doc._id);
	});		
  //database.insert(data);
  
   response.json("Hash added to blockchain: " + hashValue);
});

app.listen(port, () => {
    console.log(`Server listening on the port::${port}`);
});
//END CODE API POST Listener 

// mint the nft
async function mint(location) 
{
    // How many tokens do I have before sending? - https://github.com/ChainSafe/web3.js/issues/1151
    //var balance = contract.methods.balanceOf(myAddress).call();
    //console.log(`Balance before send: ${financialMfil(balance)} MFIL\n------------------------`);

    //START 31-10-2021
    console.log('############### New Run: ################');
  
    // We require a provider to query the network
    //const Provider = require('@truffle/hdwallet-provider');   
    let provider = ethers.getDefaultProvider(NETWORK); //'rinkeby');
    //const signer = provider.getSigner();
    //var ethers = require('ethers');
    console.log ('provider: ' + provider);    
    let wallet = new ethers.Wallet(privateKey, provider);

    let balancePromise = wallet.getBalance();
    console.log('balancePromise: ' + balancePromise + ' balancePromise ' + JSON.stringify(balancePromise));
    balancePromise.then((balance) => {
        console.log('Balance before minting : ' + balance);
    });
    
    let transactionCountPromise = wallet.getTransactionCount();

    transactionCountPromise.then((transactionCount) => {
        console.log('transactionCount: ' + transactionCount);
    }); 

    // Call contract method 
    try {
          var mainContract = new ethers.Contract(contractAddress, LocationNFT.abi, wallet); //wallet); //fromAddress
          //console.log ('Location.abi: ' + JSON.stringify(Location.abi));
          //console.log ('mainContract: ' + JSON.stringify(mainContract));      
          console.log("Mining...please wait.");

          if(mainContract) {
            console.log ('mainContract data there: ');
          }
		  
        const nft2 = await mainContract.mintNFT(location)
        return nft2.hash; 
        //tranaction receitt
        //wait. block number, transaction receipt.
    } catch (e) {
      console.log(e) // This gets executed when process times out in ~30 minutes
    }
} //end of mint function

function getTimestamp(){
	var date_ob = new Date();
	var date = ("0" + date_ob.getDate()).slice(-2);	// current date  // adjust 0 before single digit date
	var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);// current month	
	var year = date_ob.getFullYear();// current year	
	var hours = date_ob.getHours();// current hours	
	var minutes = date_ob.getMinutes();// current minutes	
	var seconds = date_ob.getSeconds();// current seconds
	// prints date in YYYY-MM-DD format
	// console.log(year + "-" + month + "-" + date);
	// prints date & time in YYYY-MM-DD HH:MM:SS format
	// console.log(year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds);
	// prints time in HH:MM format
	// console.log(hours + ":" + minutes);	
	return (year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds);
}
 
