# MapSafe.xyz

This repository holds the source code for the MapSafe Geospatial Data Sovereignty tool. We are in the process of preparing the code. 
In the meantime, feel free to raise any issue with the tool via the Issues Tab.


Mapsafe offers a complete approach to safeguarding geospatial data by obfuscating, encrypting and notarising it.
These functions run client-side in the browser, meaning geospatial data never leaves the computer unprotected. Thereby, the tool creates a completely trustless mechanism for sharing sensitive data.

The paper on the tool, "MapSafe: A complete tool for achieving geospatial data sovereignty," was published in the Transactions in GIS Journal.  

https://onlinelibrary.wiley.com/doi/10.1111/tgis.13094 <br>
https://onlinelibrary.wiley.com/doi/epdf/10.1111/tgis.13094

The various security functions are in these files:
- masking module is within "assets/js/xyz.js" 
- hexagonal binning is within "assets/js/h3_binning.js" and "assets/js/h3_binning_verification.js"
- encryption module is within "assets/js/dstool.js" 
- notarisation module is within "assets/js/blockchain_minting.js" 
