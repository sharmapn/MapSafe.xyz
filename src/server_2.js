//import React, { Component, useState  } from 'react';
//import { useState } from 'react';
//import Web3 from 'web3'
//import './App.css';

//import '../extra.js';  //functions to get all transactions - 25-09-2021 
//import nftToken from '../abis/nftToken.json'
//import './balances.js';

//29-10-2021
//import { ethers } from 'ethers'
//import LocationNFT from '/abis/Location.json'

/*
import {
  nftAddress, fromAddress //nftmarketaddress
} from '../config'
*/

//import { nftContract, gameContract } from '../Contract/contract'  //added

//original article of this application sample application = dapp university
//another one based on that = https://github.com/rsksmart/devportal/blob/2c6e21a9d057a9dcb9ba3b35268d3732fd8af41f/tutorials/tokens/create-a-collectable-token.md

//important link for ethereum implementation
//https://ethereum.stackexchange.com/questions/42929/send-payment-from-wallet-using-web3

// START CODE ... API POST Listener 
// Refer to the following sources for more information on the API POST Listener code:
// https://github.com/bbachi/react-nodejs-example
// https://medium.com/bb-tutorials-and-thoughts/how-to-make-api-calls-in-react-applications-7758052bf69

const web3 = require('web3');
const ethers = require('ethers');
const express = require('express');
//const Datastore = require('nedb');
const path = require('path');
const LocationNFT = require('./abis/Location.json')
//const nftAddress = require('/config')
//const fromAddress = require('../config')
const fromAddress = "0x244EAbEf05ACF009746Ce91fE1712Daf3857e620"
const nftAddress = "0xa505630672898f901A0c6B261A693C39f17e66B8"

/*
const app = express(),
      //bodyParser = require("body-parser");
      port = 80;
	  */
  
const app = express();
const port = 3000;	  

//app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));

app.use(express.json()); 
const bodyParser = require('body-parser');
//app.use(bodyParser.urlencoded({ extended: true }));
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", function(req, res) {
  // res.send("working fine");
  res.sendFile(__dirname + "/public/index.html");
  console.log(__dirname);
})

app.post("/bmicalculator", function(req, res) {
  var vWeight = Number(req.body.weight);
  var vHeight = Number(req.body.height);
  var result = bmiCalc(vWeight, vHeight);

  res.send("your BMI is: " + result);
})

function bmiCalc(weight, height) {
  var heightInMeter = height / 100;
  var bmi = weight / (heightInMeter * heightInMeter);
  return bmi;
}

//const database = new Datastore('database.db');
//database.loadDatabase();

/*
app.get('/api/hashes', (req, res) => {
  console.log('api/hashes called!')
  res.json(hashes);
});
*/

/*
app.get('/api', (request, response) => {
  database.find({}, (err, data) => {
    if (err) {
      response.end();
      return;
    }
    response.json(data);
  });
});
*/


//Note I installed this : npm install --save body-parser
app.post('/posthash', (req, res) => {
  console.log('Request received to post hash on server');
  var hashValue = req.body.hash;
  console.log('Received hash: ' + hashValue);	
  
  //this also works
  //var hvalue = JSON.stringify(req.body);
  //console.log('hvalue:' + hvalue);  
  
  if (!hashValue) {
		//console.log('empty hash ');	
        return res.status(400).send({ error:true, message: 'Please provide hash value' });
  }	else{	
	  const timestamp = Date.now();
	  //data.timestamp = timestamp;
	  //console.log(timestamp + ' Adding hash:::::', hashValue);
	  var time = getTimestamp();
	  //console.log(time + ' Adding hash:::::', hashValue);
	  //call the mint function
	  //mint(hashValue);	  
	  console.log(time + ' Minted hash value: ' + hashValue);
  }
	
  //database.insert(data);
  
  /*
	let name = req.query.name;
	let lastname = req.query.lastname;
	let email = req.query.email;
	let password = req.query.password;
	let sql = "INSERT INTO tblProfile(name,lastname,email,password) VALUES(? ? ? ?)";
	conn.query(sql, [name, lastname, email, password], (err, result) => {
		if (err) throw err;
		res.write("inserted.");
		res.end();
	});
	*/
  
   res.json("Hash added to blockchain: " + hashValue);
});

/*
app.get('/', (req,res) => {
  //res.sendFile(path.join(__dirname, '../my-app/build/index.html'));
});
*/

/*
app.get("/", function(req, res) {
  // res.send("working fine");
  //res.sendFile(__dirname + "/client.html");
  res.sendFile('/client.html', { root: '.' })
  console.log(__dirname);
})
*/

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

app.listen(port, () => {
    console.log(`Server listening on the port::${port}`);
});

//END CODE API POST Listener 

/*
class App {

  // add 22-09-2021
  constructor(props) {    
    //super(props);

    this.state = {
      /////// Default state
      storageValue: 0,
      web3: null,
      account: '',
      contract: null,
      //accounts: null,
      route: window.location.pathname.replace("/", ""),
      network:null,
      totalSupply: 0,
      locations: []
    };

    //this.on = this.on.bind(this);
    //this.off = this.off.bind(this);
  }  

*/

async function componentWillMount() {
    //31-10-21..we comment teh first two functions as we no longer use web3 or the local metamask
    //await this.loadWeb3()
    //await this.loadBlockchainData()
    await this.loadEthers() //we try mint NFT using the ethers.js
}  

  //29-10-2021..lets try ethers.js
async function loadEthers()
{
    console.log('here 03');
    /*
    const Web3 = require('web3');
    //const web3 = new Web3('HTTP://127.0.0.1:7545');
    //const Provider = require('@truffle/hdwallet-provider');
    const MyContract = require('./build/contracts/MyContract.json');
    const infuraUrl = 'https://rinkeby.infura.io/v3/e90e21a0290f452386b3efa1dc8df355';
    const address = '0x244EAbEf05ACF009746Ce91fE1712Daf3857e620';

    const privateKey = ''; // Genesis private key
    

    var ethers = require('ethers');

    //let url = "https://ropsten.infura.io/v3/3cf511bbaebe499f98f867238aaaadbb";
    const provider = new ethers.providers.JsonRpcProvider(infuraUrl);


    //new code
    const testnet = 'https://rinkeby.infura.io/v3/e90e21a0290f452386b3efa1dc8df355'; 
    const walletAddress = '0x244EAbEf05ACF009746Ce91fE1712Daf3857e620';
    */
    /*
    const web3 = new Web3(url); //infuraUrl
    const networkId = await web3.eth.net.getId();

    const myContract = new web3.eth.Contract(
      MyContract.abi,
      MyContract.networks[networkId].address
    );
    */
      
    console.log('############### New Run: ################');

    var ethers = require('ethers');

    // We require a provider to query the network
    let provider = ethers.getDefaultProvider('rinkeby');

    //maybe this is not needed
    var fromAddress  = '0x244EAbEf05ACF009746Ce91fE1712Daf3857e620';

    //my own
    let privateKey = "0x" + ""; //my own
    //original
    //let privateKey = "";
    let wallet = new ethers.Wallet(privateKey, provider);
    
    console.log('main contract start');
    var mainContract = new ethers.Contract(nftAddress, LocationNFT.abi, wallet); //fromAddress
    console.log('main contract  end');

    let balancePromise = wallet.getBalance();

    balancePromise.then((balance) => {
        console.log('balance: ' + balance);
    });

    let transactionCountPromise = wallet.getTransactionCount();

    transactionCountPromise.then((transactionCount) => {
        console.log('transactionCount: ' + transactionCount);
    }); 

    //mint nft here
    //main minting function
    
    /*
    const nft = mainContract.methods.mintNFT('test').send({ from: fromAddress })   //replace with `accAddress' from the config file
    .once('receipt', (receipt) => {
      console.log ('nft: ', nft);
    })
    */

    /*
    //
    const signer = provider.getSigner();
    let contract = new ethers.Contract(accAddress, location.abi, signer)
    let transaction = await contract.createToken('mint')
    //let tx = await transaction.wait()
    //let event = tx.events[0]
    //let value = event.args[2]
    //let tokenId = value.toNumber()
    //const price = web3.utils.toWei(formInput.price, 'ether')

    // above code omitted
    //const listingPrice = web3.utils.toWei('10', 'ether')
    */
}
  
  //21 sept 2021...added addtional features from https://github.com/ohbyeongmun/NFT_TOKEN_ERC721
  // const [owner, setOwner] = useState();
  // const [info, setInfo] = useState({
  //       name: '',
  //       level: '',
  // })
  // const [addr, setAddr] = useState();
  // const [Quantity, setQuantity] = useState();
  //end ..added addtional features

  //console.log(nftContract.methods);
  //console.log(gameContract.methods);

   
async function loadWeb3() 
{
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
      //window.web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/<APIKEY>"));
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
    console.log(window.web3.currentProvider);

    //const [account,setAccount,autorizeApp] = ConnectMetamask();
    //ConnectMetamask();

    //show balance in the beginning
    //https://www.shawntabrizi.com/ethereum/ethereum-web3-js-hello-world-get-eth-balance-ethereum-address/
    //function getBalance() { 
      /*
      var address, wei, balance
      address = document.getElementById("address").value
      try {
        window.web3.eth.getBalance(address, function (error, wei) {
              if (!error) {
                  var balance = window.web3.fromWei(wei, 'ether');
                  document.getElementById("output").innerHTML = balance + " ETH";
              }
          });
      } catch (err) {
          document.getElementById("output").innerHTML = err;
      }
      */
    //}


}

  
  //22-09-2021 - try to make sre about the network
  /*async on(event) {
    event.preventDefault();

    // Restore provider session
    //await this.state.web3Modal.clearCachedProvider();
      try {
        let chainId=await web3.eth.getChainId()
          if(chainId==3){
            this.setState({
              network: "ropsten",
      
            })}else{
              this.setState({
                network: "please switch to ropsten",
              })
          
            };
      
    } catch (e) {
      return;
    }

  } */

async function loadBlockchainData() 
{
    console.log("Load BlockChain Data: ");
    // Another way to Instantiate web3 with HttpProvider
    //const web3 = new Web3('https://rinkeby.infura.io/') - https://medium.com/pixelpoint/track-blockchain-transactions-like-a-boss-with-web3-js-c149045ca9bf

    const web3 = window.web3
    // Load account - Use web3 to get the user's accounts.
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })

    //get all transactions of that account - //https://ethereum.stackexchange.com/questions/2531/common-useful-javascript-snippets-for-geth/3478#3478
    //console.log('TransactionsByAccount: ' + getTransactionsByAccount(web3.eth.accounts[0]));
    //Yeah, the above mentioned approach works for Contract Addresses. Unfortunately, there is not any method in Web3js which will help us achieve this task. 
    //But, the way I did it was going from the 0 block-number to Latest. While going through I got all the transactions that happened in the block along with 
    //the details of the transaction.
    //https://ethereum.stackexchange.com/questions/25389/getting-transaction-history-for-a-particular-account
    //https://gitter.im/ethereum/web3.js?at=5b8d0bd0c2bd5d117a10d714
    var myaccount = accounts[0] , startBlockNumber, endBlockNumber;
    if (endBlockNumber == null) {
      endBlockNumber = web3.eth.blockNumber;
      console.log("Using endBlockNumber: " + endBlockNumber);
    }
    if (startBlockNumber == null) {
      startBlockNumber = endBlockNumber - 1000;
      console.log("Using startBlockNumber: " + startBlockNumber);
    }
    console.log("Searching for transactions to/from account \"" + myaccount + "\" within blocks "  + startBlockNumber + " and " + endBlockNumber);
      for (var i = startBlockNumber; i <= endBlockNumber; i++) {
      if (i % 1000 == 0) {
        console.log("Searching block " + i);
      }
      var block = web3.eth.getBlock(i, true);
      if (block != null && block.transactions != null) {
        block.transactions.forEach( function(e) {
          if (myaccount == "*" || myaccount == e.from || myaccount == e.to) {
            console.log("  tx hash          : " + e.hash + "\n"
              + "   nonce           : " + e.nonce + "\n"
              + "   blockHash       : " + e.blockHash + "\n"
              + "   blockNumber     : " + e.blockNumber + "\n"
              + "   transactionIndex: " + e.transactionIndex + "\n"
              + "   from            : " + e.from + "\n" 
              + "   to              : " + e.to + "\n"
              + "   value           : " + e.value + "\n"
              + "   time            : " + block.timestamp + " " + new Date(block.timestamp * 1000).toGMTString() + "\n"
              + "   gasPrice        : " + e.gasPrice + "\n"
              + "   gas             : " + e.gas + "\n"
              + "   input           : " + e.input);
          }
        })
      }
    }

    /*
    web3.eth.getAccounts(function(err, accounts) {
      if (err != null) {
        alert("Error retrieving accounts.");
        return;
      }
      if (accounts.length == 0) {
        alert("No account found! Make sure the Ethereum client is configured properly.");
        return;
      }
      account = accounts[0];
      console.log('Account: ' + account);
      web3.eth.defaultAccount = account;
    }); */
    

    // 22 Set 2021 ...Set web3, accounts, and contract to the state, and then proceed with an
    // example of interacting with the contract's methods.
    this.setState({ 
      web3, 
      accounts, 
      balance, 
      networkId, 
      networkType     
    });

    var networkId = await web3.eth.net.getId();       console.log('networkId   ' + networkId);
    var networkData = LocationNFT.networks[networkId];   console.log('networkData ' + networkData);
    //22-09-2021    
    // contractAddress and abi are setted after contract deploy - https://github.com/solangegueiros/dapp-register-rsk/blob/master/register-rsk-web3-injected/index.js
    // var contractAddress = '0xc864D0fef177A69aFa8E302A1b90e450910A4c3E';
    // var abi = JSON.parse( '[{"constant":true,"inputs":[],"name":"getInfo","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_info","type":"string"}],"name":"setInfo","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]' );

    //var contract = new web3.eth.Contract(abi,scaddress);
    var networkType = await web3.eth.net.getNetworkType(); console.log('networkType ' + networkType);
    var isMetaMask = web3.currentProvider.isMetaMask;
    let balance = accounts.length > 0 ? await web3.eth.getBalance(accounts[0]): web3.utils.toWei('0');
    balance = web3.utils.fromWei(balance, 'ether');
    console.log('balance ' + balance);
    

    //added 22-09-2021
    console.log('All Transactions');
    var myAddr = '0x8fF5d55ec17EDEF145fDB9F48Ed2EF335FFb2107';
    var currentBlock = web3.eth.blockNumber;
    var n = web3.eth.getTransactionCount(myAddr, currentBlock);
    var bal = web3.eth.getBalance(myAddr, currentBlock);
    for (var i=currentBlock; i >= 0 && (n > 0 || bal > 0); --i) {
        try {
            var block = web3.eth.getBlock(i, true);
            if (block && block.transactions) {
                block.transactions.forEach(function(e) {
                    if (myAddr == e.from) {
                        if (e.from != e.to)
                            bal = bal.plus(e.value);
                        console.log(i, e.from, e.to, e.value.toString(10));
                        --n;
                    }
                    if (myAddr == e.to) {
                        if (e.from != e.to)
                            bal = bal.minus(e.value);
                        console.log(i, e.from, e.to, e.value.toString(10));
                    }
                });
            }
        } catch (e) { console.error("Error in block " + i, e); }
    }

    if (!networkData) {
      window.alert('Smart contract not deployed to detected network.');
      return;
    }

    //a lot based on this code https://github.com/solangegueiros/rsk.solange.dev/blob/d2c7cb695ea6624fa1e22605217998f626650038/es/token-nft/readme.md
    if(networkData) {
      const abi = LocationNFT.abi
      var networkData = LocationNFT.networks[networkId];   console.log('networkData ' + networkData);
      const address = networkData.address
      const contract = new web3.eth.Contract(abi, address);   console.log('contract   ' + contract);   // Get the contract instance.
      this.setState({ contract })
      const totalSupply = await contract.methods.totalSupply().call();  console.log('totalSupply   ' + totalSupply);
      this.setState({ totalSupply })

      //https://ethereum.stackexchange.com/questions/71307/mycontract-getpasteventsallevents-returns-empty-array
      contract.getPastEvents("allEvents", { fromBlock: 1}).then(console.log);   

      //additional added 22-09-21
      var nft = await contract.methods.name().call();             console.log('nft   ' + nft);
      var token = await contract.methods.symbol().call();         console.log('token   ' + token);
      var supply = await contract.methods.totalSupply().call();   console.log('supply   ' + supply);
      //additional added
      const dateTime = Date.now();
      const timestamp = Math.floor(dateTime);
      var currentdate = new Date(); 
      var datetime = currentdate.getFullYear()+ "/" +(currentdate.getMonth()+1)+"/"+currentdate.getDate(); 

    //added 22-09-2021
    web3.eth.getBalance("0x8fF5d55ec17EDEF145fDB9F48Ed2EF335FFb2107")
          .then(console.log);

      // Load Locations
      for (var i = 1; i <= totalSupply; i++) {
        const location = await contract.methods.locations(i - 1).call()
        this.setState({
          locations: [...this.state.locations, location]
        })
        console.log('location' + location)
      }
    } else {
      window.alert('Smart contract not deployed to detected network.')
    }
} //end async loadBlockchainData() function

  //07-Oct-2021..Transfer some Ethereum to user's account.
  // Create an async function so I can use the "await" keyword to wait for things to finish
  // https://github.com/ChainSafe/web3.js/issues/1151
   
  //balances();
  // loadBlockchainData2();
  //end the transfer of Ethereum

 // mint the nft
async function mint(location) 
{
    // How many tokens do I have before sending? - https://github.com/ChainSafe/web3.js/issues/1151
    //var balance = contract.methods.balanceOf(myAddress).call();
    //console.log(`Balance before send: ${financialMfil(balance)} MFIL\n------------------------`);

    //START 31-10-2021
    console.log('############### New Run: ################');
  
    const Provider = require('@truffle/hdwallet-provider');
    //const address = '0x244EAbEf05ACF009746Ce91fE1712Daf3857e620'; //'0xAD8eD8FBA46BA6bE9120d0aEc43109A0543b69d3';
    const privateKey = ''; //'';
    //const provider = new Provider(privateKey, 'https://rinkeby.infura.io/v3/e90e21a0290f452386b3efa1dc8df355'); 
    let provider = ethers.getDefaultProvider('rinkeby');
    //var mnemonic = "orange apple banana ... ";
    //const signer = provider.getSigner();

    //var ethers = require('ethers');

    // We require a provider to query the network
    //let provider = ethers.getDefaultProvider('rinkeby');
    console.log ('provider: ' + provider);
    //maybe this is not needed
    var fromAddress  = '0x244EAbEf05ACF009746Ce91fE1712Daf3857e620';

    //let privateKey = ""; //my own
    //other account private key
    //let privateKey = "";
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


    //console.log ('wallet: ' + JSON.stringify(wallet));
    let nftAddress = "0xa505630672898f901A0c6B261A693C39f17e66B8";
    console.log ('nftAddress: ' + nftAddress);

    // Options for the transaction 
    /*const options = {
      gasLimit: FIXED_GAS,
      gasPrice: ethers.utils.parseUnits(gasPriceInGwei, 'gwei')
    }; */

    //idea from here
	//maybe can resolve the error using repos from here
	//https://github.com/search?q=%22.send%28%7Bfrom%3A%22+ethereum&type=code

    // Call contract method 
    try {
          var mainContract = new ethers.Contract(nftAddress, LocationNFT.abi, wallet); //wallet); //fromAddress
          //console.log ('Location.abi: ' + JSON.stringify(Location.abi));
          //console.log ('mainContract: ' + JSON.stringify(mainContract));      
          console.log("Mining...please wait.");

          if(mainContract) {
            console.log ('mainContract data there: ');
          }
		  
		  //29-04-2022..try some new node
		  //Contract Deploy
		  //const contract = new web3.eth.Contract(LocationNFT.abi, contAdd);
		  //contract.methods.mint(address, tokenId, amount).send({from: address, value: 0})

		//https://github.com/PercyUkn/evoting-UNI/blob/edea6a3e24a7cf4f18fa8090c7ba01e5d976bd98/client/src/components/dashboard/AdminPanel.js
		
		/*
		 await mainContract.mintNFT(location).send({
              from: fromAddress 
         });
		 
		 this.setState({
              locations: [...this.state.locations, location]
            })
		 */	

		
          const nft2 = mainContract.mintNFT(location).send({ from: fromAddress })   //replace with `accAddress' from the config file
          .once('receipt', (receipt) => 
          {
                    //     console.log ('nft: ', nft);
                    //   })  
                      //END 31-10-2021
                      //COMMENTED 31-10-2021 ..main minting function
                  //   const nft = this.state.contract.methods.mintNFT(location).send({ from: this.state.account })
                  //   .once('receipt', (receipt) => {
            console.log ('nft: ', nft2); 
            //we change something here
            this.setState({
              locations: [...this.state.locations, location]
            })      
        })
		
    } catch (e) {
      console.log(e) // This gets executed when process times out in ~30 minutes
    }

} //end of mint function

function test(){
   console.log('Minted');
};
  
//}

//export default App;
