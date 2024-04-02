# MapSafe.xyz

This repository holds the source code for the MapSafe Geospatial Data Sovereignty tool. 
Feel free to raise any issue with the tool via the Issues Tab.


Mapsafe offers a complete approach to safeguarding geospatial data by obfuscating, encrypting and notarising it.
These functions run client-side in the browser, meaning geospatial data never leaves the computer unprotected. Thereby, the tool creates a completely trustless mechanism for sharing sensitive data.

The paper on the tool, "MapSafe: A complete tool for achieving geospatial data sovereignty," was published in the Transactions in GIS Journal.  

https://onlinelibrary.wiley.com/doi/10.1111/tgis.13094 <br>
https://onlinelibrary.wiley.com/doi/epdf/10.1111/tgis.13094

Full guide to safeguarding: https://mapsafe.xyz/safeguarding-guide.html

Watch this video to learn how to safeguard your data, from start to finish!
https://github.com/sharmapn/MapSafe.xyz/assets/17430034/8c8761ad-fb3c-4422-ac40-5bd3de29e4a5

Full guide to verification: https://mapsafe.xyz/verification-guide.html

Watch this GIF to learn how to verify your data, from start to finish!
https://github.com/sharmapn/MapSafe.xyz/assets/17430034/2db367cf-420f-4278-a144-578db4bd46c5



The various security functions are in these files:
- masking module is within "assets/js/xyz.js" 
- hexagonal binning is within "assets/js/h3_binning.js" and "assets/js/h3_binning_verification.js"
- encryption module is within "assets/js/dstool.js" 
- notarisation module is within "assets/js/blockchain_minting.js" 
