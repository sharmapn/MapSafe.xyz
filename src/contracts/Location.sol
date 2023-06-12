pragma solidity 0.5.0;

import "./ERC721Full.sol";

contract Location is ERC721Full {
  //09-10-2021
//  struct Location {
        //uint256 genes;
        //uint64 birthTime;
//        uint32 location;
//        uint32 BMAId;
        //uint32 dadId;
        //uint16 generation;
 //   }
    //Location[] locations;


  string[] public locations;
  mapping(string => bool) _locationExists;

  //https://stackoverflow.com/questions/69239240/polygon-transaction-working-just-fine-on-mumbai-but-not-on-mainnet
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  constructor() ERC721Full("Location", "LOCATION") public {
  }

  // E.G. color = "#FFFFFF"  //public only owner? - https://blog.logrocket.com/how-to-create-nfts-with-javascript/
  function mintNFT(string memory _location) public returns (uint256) {
    
    _tokenIds.increment();
    uint256 newItemId = _tokenIds.current();
    
    require(!_locationExists[_location]);
    uint _id = locations.push(_location);
    _mint(msg.sender, _id);
    _locationExists[_location] = true;

    return newItemId;
  }

  //23-10-2021..get location details
  // Get the property details.
  //https://github.com/varshanipreddy/land-records-blockchain
	// function getPropertyDetails(uint _propId) view public returns (Status, uint, address)  {
	//	return (properties[_propId].status, properties[_propId].value, properties[_propId].currOwner);
	//}

  //09-10-2021..added
 /*
  function getLocation(uint256 tokenId) public view returns (
        //uint256 genes,
        //uint256 birthTime,
        //uint256 mumId,
        //uint256 dadId,
        uint256 location) //code looks cleaner when the params appear here vs. in the return statement.
        {
            require(tokenId < birdies.length, "Token ID doesn't exist.");
            Bird storage bird = birdies[tokenId];//saves space over using memory, which would make a copy
            
            genes = bird.genes;
            birthTime = uint256(bird.birthTime);
            mumId = uint256(bird.mumId);
            dadId = uint256(bird.dadId);
            generation = uint256(bird.generation);
    } */
  
  /*
  function getAllLocationsOfOwner(address owner) external view returns(uint256[] memory) {
        uint256[] memory allLocationsOfOwner = new uint[](ownsNumberOfTokens[owner]);
        uint256 j = 0;
        for (uint256 i = 0; i < locations.length; i++) {
            if (locationOwner[i] == owner) {
                allLocationsOfOwner[j] = i;
                j = SafeMath.add(j, 1);
            }
        }
        return allLocationsOfOwner;
    }

  function ownerOf(uint256 tokenId) external view returns (address owner) {
        require(tokenId < locations.length, "Token ID doesn't exist.");
        return locationOwner[tokenId];
    }  

  function balanceOf(address owner) external view returns (uint256 balance) {
        return ownsNumberOfTokens[owner];
    }
  */

  //https://github.com/devpavan04/cryptoboys-nft-marketplace/blob/main/src/contracts/CryptoBoys.sol
  // get owner of the token
  /*
  function getTokenOwner(uint256 _tokenId) public view returns(address) {
    address _tokenOwner = ownerOf(_tokenId);
    return _tokenOwner;
  }

  // get metadata of the token
  function getTokenMetaData(uint _tokenId) public view returns(string memory) {
    string memory tokenMetaData = tokenURI(_tokenId);
    return tokenMetaData;
  }

  // get total number of tokens minted so far
  function getNumberOfTokensMinted() public view returns(uint256) {
    uint256 totalNumberOfTokensMinted = totalSupply();
    return totalNumberOfTokensMinted;
  }

  // get total number of tokens owned by an address
  function getTotalNumberOfTokensOwnedByAnAddress(address _owner) public view returns(uint256) {
    uint256 totalNumberOfTokensOwned = balanceOf(_owner);
    return totalNumberOfTokensOwned;
  }
  */
  
}