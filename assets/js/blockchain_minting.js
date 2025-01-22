
var trans_date = null;

//This function gets called from index.html 
async function loadWeb3(){
  //const Web3 = require("web3")
  console.log('LoadWeb3')
  if (window.ethereum){
    window.web3 = new Web3(window.ethereum)
    await window.ethereum.enable()
    console.log('window.ethereum')
  }
  else if (window.web3){
    window.web3 = new Web3(window.web3.currentProvider)
    console.log('window.web3')
  }
  else{
    window.alert('Non-Ethereum browser detected. You should consider trying MetaMask4!')
    console.log('Non-Ethereum browser detected. You should consider trying MetaMask4!')
  }
}

async function loadBlockchainData(){
  console.log('Inside loadBlockchainData() fn')
  const web3 = window.web3
  // Load account
  const accounts = await web3.eth.getAccounts()
  this.setState({ account: accounts[0] })
  console.log('web3' + web3)

  const networkId = await web3.eth.net.getId()
  const networkData = Location.networks[networkId]
  if(networkData) {
    const abi = Location.abi
    const address = networkData.address
    const contract = new web3.eth.Contract(abi, address)
    this.setState({ contract })
    const totalSupply = await contract.methods.totalSupply().call()
    this.setState({ totalSupply })
    // Load Locations
    for (var i = 1; i <= totalSupply; i++) 
    {
      const location = await contract.methods.locations(i - 1).call()
      this.setState({
        locations: [...this.state.locations, location]
      })
    }
  } 
  else {
    window.alert('Smart contract not deployed to detected network.')
  }
}

async function loadInfo(){ 
    console.log("Load Info");
    //contract address and ABI
    const address = "0xa505630672898f901A0c6B261A693C39f17e66B8"
    var Location;
    $.getJSON("Location.json", function(json){      
      Location = json;      

      if (window.ethereum) { 
        console.log("MetaMask exists.");
        
        try {
          //var accounts;
          //accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });            
          ethereum.request({ method: "eth_requestAccounts" })
          .then(
            //() => document.getElementById("count").click()
            console.log('Success')
           )
          .catch((err) => console.error(err.message)
           );
                 
          ethereum.on("chainChanged", () => window.location.reload());        
          ethereum.on("accountsChanged", (accounts) => {
              if (accounts.length > 0) {
                  console.log(`Using account ${accounts[0]}`);
              } else {
                  console.error("0 accounts.");
              }
          });        
          ethereum.on("message", (message) => console.log(message));        
          ethereum.on("connect", (info) => {
              console.log(`Connected to network ${info}`);
          });        
          ethereum.on("disconnect", (error) => {
              console.log(`Disconnected from network ${error}`);
          });        
          
          const provider = new ethers.providers.Web3Provider(window.ethereum);    //console.log('Provider ' + provider)
          const signer = provider.getSigner();                                    //console.log('signer '   + signer)
          const contract = new ethers.Contract(address, Location.abi, signer);    //console.log('contract ' + contract)
          
          window.contract = contract
          //console.log(contract)          
        } 
        catch (error) {
          if (error.code === 4001) {
            // User rejected request
            console.log(error.message)
          }
          console.log(error.message)
          //setError(error);
        }
      }
      else {
        console.error("Install MetaMask.");
     }
    });    
}

async function minting()
{
  document.getElementById("finish-button").disabled = false;
  trans_date = new Date().toISOString(); //$("#hash").val();  //set the global transaction date
  console.log("Minting Date " + trans_date)
  var receipt = await contract.mintNFT(minting_string); //encrypted file hash_value 
  console.log(receipt)
  console.log("Minting ")
  var url = `https://sepolia.etherscan.io/tx/${receipt.hash}`
  console.log('Transaction Link ' + url)
  var fromAddr = receipt.from;
  console.log('From Wallet Account Address ' + receipt.from)
  var tranx_hash = receipt.hash;
  console.log('Ethereum Transaction Hash ' + tranx_hash)
  var gas_price = receipt.gasPrice;
  console.log('GasPrice' + gas_price)

  $("#TransAddress").html(`<b>Success!</b> The filename and hash value is being minted on Ethereum Blockchain. See URL. 
                          <br> <a href="${url}" target="_blank">${url}</a>`)

   //stop the spinner
   $(".loading-icon").addClass("hide");
   $(".button").attr("disabled", false);
   $(".btn-txt-nota").text("Success!"); 
  
  saveReceipt(minting_string, url, fromAddr, tranx_hash, gas_price); //save the transaction details as pdf
} 