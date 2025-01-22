/*   
    Copyright (c) 2023 Pankajeshwara Nand Sharma
    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
    The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/


// This Script containing the Data Sovereignty Multi-level Encryption and Decryption functions 
// The remaining Data Sovereignty functions are in these scripts
//    - Masking functions are in 'xyz.js', 
//    - H3-JS Binning functions are in 'HSbinning.js' and 'H3Binning_verifcation.js'
//    - Notarisation functions are in 'blockchain_minting.js'

var objFile=null;               //upload encrypted file for decryption
var hash_value, full_fileName;
var minting_string;             //full_fileName + "_" + hash of encrypted filename;  
var encryptedZIPFileData_fine, encryptedZIPFileData_medium, encryptedZIPFileData_coarse; //for each encryption level, store returned encrypted blob eac time
var fileInput = null;           //uploaded file 
var isDocument = false;         //if uploaded file is document
var fileExtension = null;       //file extension of uploaded file
var fileName = null;            //firstpart of original filename will be used as part of encrypted filename
var levels_to_safeguard = null; //storing the user provided option
var decrypted_buf;
var map_data_loaded = false;    //if map dataset has been loaded, then only we invoke the h3 binning map, otherwise these is no data for it to display at the first time loading 
//  While computing eccryption times, the function that converts the masked geojson to shapefile needs tobe moved outside the encryption function 
var originalShapeFile, maskedShapeFile, moreMaskedShapeFile;
//  save the decrypted file as global variable, from where map will be displayed
var decryptedGEOJSON;           //hold the decryptedGEOJSON which will be later used to display the dataset - could be the masked or binned dataset
var zipfile, file_name;         //hold the details of the decrypted zip file
var maskingFlag = true;         //true represents masking and false represents binning.
var binnedShapeFile, moreBinnedShapeFile;
var binnedGeoJSON, binnedGeoJSON_more;

// Retrieve the masking flag stored in tghe encrypted volume - signifies if masking or binning was carried out
// set by default to true, meaning by default masking was done
var verification_masking_flag = true;
// For use when the most inner layer is selected for decryption, we show the original map in openlayers
var levelToDec_global;
var h3resolution, buffer_radius;
var h3resolution_more, buffer_radius_more;

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

loadSampleShapeFile = async function (){
    var outputID = "sensitiveTag", layerName = "sensitive";
    const req = new XMLHttpRequest();
    req.open("GET", "/oil_drills_north_coromandel.zip", true);
    req.responseType = "blob";   
    req.onload = (event) => {
        const blob = req.response;
        original_shapefile = blob; //to be included in the first level encrypted volume    
        var projFileName;
        JSZip.loadAsync(blob).then(function(result){           
            myKeys = Object.keys(result.files);
            myKeys.forEach(function(i){if (i.endsWith('prj') == true ) {projFileName = i;}})
        });
        JSZip.loadAsync(blob).then(function(result){             
            projectionPromise = result.files[projFileName].async('text');
            projectionPromise.then(function(proj){projection[layerName] = proj; console.log(proj);}) //Add the projection text to the projection array and name it based on the input layer name
        });
         
        //shp accepts shapefiles and GeoJSON zipped files: https://github.com/calvinmetcalf/shapefile-js
        shp("/oil_drills_north_coromandel.zip").then(function (geojson) {   
            console.log("Loading GeoJSON from sample shapefile")
            $("#" + outputID).html(layerName + ".data = " + JSON.stringify(geojson) + ";");        
            document.getElementById("sensitiveInput").disabled = true;  //user shoud not be able to upload a file
            document.getElementById("displayMap").disabled = false;     //enable the map display           
            document.getElementById("firstnextaction-button").click();  //try to move to the next tab           
            $message = $('.tabcontent1 span.dataset_loaded_msg');       //show dataset loaded message
            $message.text('Dataset Loaded!');
            fileName = "oil_drills_north_coromandel";                   //needed for saving the ecrypted file later
            fileExtension = "zip";                                      //needed for saving the ecrypted file later
        });   
    };
    req.send(); 
}	

function preparePassphrase(str, level){
    var return_passphrase;
    if(level == 1){             //use all 15 terms for fine level
        return_passphrase = str;//passphrase = passphrase.split(' ');
    }
    else if(level == 2){         
        var terms = str.split(' ');
        return_passphrase = terms[0];
        for (let i = 1; i < 10; i++){ return_passphrase = return_passphrase + ' ' + terms[i]; } //get the first 10 terms for medium level
    }
    else if(level == 3){  //get the first 5 terms for coarse level
        var terms = str.split(' ');
        return_passphrase = terms[0];
        for (let i = 1; i < 5; i++){ return_passphrase = return_passphrase + ' ' + terms[i];  }                 
    }
    return_passphrase = return_passphrase.trim();  //making sure preceding and trailing spaces are removed
    console.log("Passphrase for encryption/decryption level : " + level + " = (" + return_passphrase + ")");
    return return_passphrase;
}

function returnBlob(obj){
    const str = JSON.stringify(obj);
    const bytes = new TextEncoder().encode(str);
    const blob = new Blob([bytes], {
        type: "application/json;charset=utf-8"
    });
    return blob
} 

var saveJson = function(obj, fileName) {
	var str = JSON.stringify(obj);
	var data = encode( str );

	var blob = new Blob( [ data ], {
		type: 'application/octet-stream'
	});
	
	var url = URL.createObjectURL( blob );
	var link = document.createElement( 'a' );
	link.setAttribute( 'href', url );
	link.setAttribute( 'download', fileName );
	var event = document.createEvent( 'MouseEvents' );
	event.initMouseEvent( 'click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
	link.dispatchEvent( event );
} 

var encode = function( s ) {
	var out = [];
	for ( var i = 0; i < s.length; i++ ) {
		out[i] = s.charCodeAt(i);
	}
	return new Uint8Array( out );
} 

//Main function to zip the map and encrypt implements three-level volume encryption
async function multiLevelEncrypt(startTimeENC){ 
    //var startTimeENC = new Date();   
    await new Promise(resolve => setTimeout(resolve, 500)); //show the spinner, spinner doesnt work without this wait facilit - delay half second 

    //Remove the layer as JSON.stringify was not working 
    //Checking the full masked object and comparing the masked.data to masked.reprojected, one will see masked.data has that ".layer" object added. 
    //This contains the circular reference that breaks the JSON serializer. Dropping that layer object that JSON.stringify works as expected
    delete masked.data.layer;   //delete masked.reprojected.layer;
    console.log('masked.data' + masked.data);     //console.log('JSON.stringify(masked.data)' + JSON.stringify(masked.data));
    
    //for storing as geojson (blobGJ_more)
    delete maskedMore.data.layer;     console.log('maskedmore.data' + maskedMore.data)
    
    console.log('Beginning Encryption: Encryption levels to sagfeguard = ' + levels_to_safeguard);    
    
    //Volume encryption Time!
    //In all cases, encrypt and include this first level containiong the 'original' dataset, 
    //1st level wil be the most inner, 2nd will be inner, and 3rd outer
    if (levels_to_safeguard <= 3) {
        // LEVEL 1. = fine-level = innermost level zip made first. if its level 1, add these files and send zip for encryption and then it will be used as as part of the next zip file
        console.log('Level 1 begins');
        var zipLevel1 = new JSZip();
        //Shapefile included instead of GeoJSON becasue of the time take to generate geojson and its not needed        
        zipLevel1.file("originalShapeFile.zip",original_shapefile); //returnShapeFile
        if(maskingFlag){
            zipLevel1.file("Metadata.txt", //above has values here
                    "\nNote this is the fine level (level 1) cntaining the original map" +
                    "\nThis level contains the masking parameters of Level 2 \nMinimum Distance: " + minimum_Distance + " metres\nMaximum Distance: " + maximum_Distance + " metres"
                    );
        }
        else{
            zipLevel1.file("Metadata.txt", //above has values here
                    "\nNote this is the fine level (level 1) containing the original map" +                
                    "\n\nThis level contains the binning parameters of Level 2 \nH3 Resolution: " + h3resolution  + "\nBuffer Radius: " + buffer_radius
                    );
        }
        
        //The zip file is now ready in a blob format. Need to encrypt and save it. encrypt this zip file again before saving
        var encryptedZipFileData_Level1, encryptedZipFileData_Level2, encryptedZipFileData_Level3;
        
        try { 
            encryptedZipFileData_Level1 = await zip_callEncryption(zipLevel1, 1, levels_to_safeguard, startTimeENC); // Await for the first function to complete
        }
        catch (error) { console.error(error); }  
    }
    
    //If user wants level 2 as well 
    if (levels_to_safeguard >= 2) { //level 2 is be included in levels 2 and 3
        // Level 2. Medium-level zip should contain the medium level map, metadata and encrypted zip of fine-level (level 1)  - then zip it and encrypt
        // parameters: masking distance, angle
        console.log('Level 2 begins');
        var zipLevel2 = new JSZip();    
        zipLevel2.file("fine_level.enc", encryptedZipFileData_Level1);   //add the encrypted fine-level zip containing the map and metadata 
        
        if(maskingFlag){  //if user has chosen masking option, as his last option while on the masking tab            
            delete masked.reprojected.layer;             
            maskedShapeFile = returnShapeFile(masked.reprojected);                         
            zipLevel2.file("maskedShapeFile.zip", maskedShapeFile); 
            zipLevel2.file("Metadata.txt",
                "\nNote this level contains the medium level map - which is masked once, the masking parameters of which is in one level inside, i.e. the innermost  level) "
                + "This level contains the masking parameters of outer most level - Level 3 (Coarse) "
                + "\nMinimum Distance more: " + maximum_Distance + " metres\nMaximum Distance more: " + maximum_Distance_more + " metres"   
                );
        }
        else{ //if user has chosen binning option, as his last option while on the masking tab
            var bgj = JSON.stringify(binnedGeoJSON);                        
            zipLevel2.file("binned.geojson", bgj);               
            zipLevel2.file("Metadata.txt",
                "\nNote this level contains the medium level map - which is binned once, the binning parameters of which is in one level inside, i.e. the innermost  level "
                + "This level contains the binning parameters of outer most level - Level 3 (Coarse) "
                + "\nH3 Resolution: " + h3resolution_more + "\nBuffer Radius: " + buffer_radius_more            
                );
        }    
    
        try {
            encryptedZipFileData_Level2 = await zip_callEncryption(zipLevel2, 2, levels_to_safeguard, startTimeENC); //second parameter is the level 
        }
        catch (error) { console.error(error);  } 
    }

    //If user wants level 3 as well
    if (levels_to_safeguard == 3) {
        console.log('Level 3 begins'); //Most outer layer
        // 3. Coarse-level zip contains the coarse level map, metadata and encrypted zip of medium-level - then zip the resultant file and encrypt it
        var zipLevel3 = new JSZip();
        //add the encrypted fine level zip containing the data/map and metadata 
        zipLevel3.file("medium_level.enc", encryptedZipFileData_Level2);   //add the encrypted medium-level zip containing the map and metadata 
                
        if(maskingFlag){  //if user has chosen masking option, as his last option while on the masking tab                   
            moreMaskedShapeFile = returnShapeFile(maskedMore.reprojected);  //more masked data
            zipLevel3.file("moreMaskedShapeFile.zip", moreMaskedShapeFile); 
            zipLevel3.file("metadata.txt",             
                    + "\nNo Masking parameters here. "
                    + "\nSince this outer level contains the 'more' masked map - of which the masking parameters is within one level inside - middle level");  
        }
        else { //if user has chosen binning option, as his last option while on the masking tab            
            var bgjm = JSON.stringify(binnedGeoJSON_more);  //console.log('morebinnedGeoJSON: ' + bgjm)            
            zipLevel3.file("binned.geojson", bgjm);          
            zipLevel3.file("metadata.txt",             
                    + "\nNo Binning parameters here. "
                    + "\nSince this outer level contains the 'more' binned map - of which the binning parameters is within one level inside - middle level");
        }                 
        
        //variable which signifies if use has carieed out masking of binning while safegarding, telling the verification process to show a masking (openlayers) or binning (mapbox) map canvas
        //maskingFlag = true, wil signify masking was carried out, else binning  //console.log('maskingFlag' + maskingFlag)
        zipLevel3.file("safeguardingApproach.txt", maskingFlag + "\n");
                
        //create a zip file of the coarse data and encrypt it. At this level, the encrypted file will be automatically saved. See code inside fn.
        try {                                                              //always start current_level = 3
            encryptedZipFileData_Level3 = await zip_callEncryption(zipLevel3, 3, levels_to_safeguard, startTimeENC);
        }
        catch (error) { console.error(error); }
    }

    //stop the spinner
    $(".loading-icon").addClass("hide");
    $(".button").attr("disabled", false);
    $(".btn-txt-enc").text("Encrypt");    

    //endTimeENC = new Date();
    //executionTimeENC = ((endTimeENC - startTimeENC) / 1000);
    //console.log("Three levels of encryption complete. Exceution Time: " + executionTimeENC);   
}

// This function takes the zip file object, generates a blob out of it, encrypts it and return its 
// syntax based on ``doJob'' example from  https://techbrij.com/javascript-async-await-parallel-sequence
async function zip_callEncryption(zipFile, level, levels_to_safeguard, startTimeENC) {
    return new Promise((resolve, reject)  => {                    
        var encryptedZipFile, encryptedZipFileData;
        var downloadFile = false;
        if(level == levels_to_safeguard) downloadFile = true;  //if(level == 3) downloadFile = true;
        //create a zip file of the coarse data and then save it    
        //Add the deflate option: https://stuk.github.io/jszip/documentation/api_jszip/generate_async.html
        zipFile.generateAsync({type: "blob", compression: "DEFLATE"}, )  //https://stuk.github.io/jszip/
            .then(function (content) {                            
                var arrayBuffer, fileReader = new FileReader();        
                //this function is needed as we want to first create a file using the blob and then encrypt that 
                //Can use FileReader to read the Blob as an ArrayBuffer
                fileReader.onload = function (event) { 
                    arrayBuffer = fileReader.result;
                    //console.log("here fileReader.result: " + fileReader.result);
                    encryptedZipFile = encryptData(false, fileReader.result, downloadFile, level, startTimeENC);  //data passed is in arraybuffer format, but later should now be converted to blob again
                    encryptedZipFile.then((value) => {                            
                        encryptedZipFileData = value
                        resolve(encryptedZipFileData);
                    }); 
                };
                //actually, accoding to documentation, this gets called almost as soon as fileReader has been created
                fileReader.readAsArrayBuffer(content); //content = blob
                fileReader.result; // also accessible this way once the blob has been read                    
            }); 
        var str = JSON.stringify(encryptedZipFileData, circularReplacer());      
    })    
  }

//pass the 'masked_reprojected'
async function generateShapeFileFromGeoJSON(geoJSON, v_fileName){   
    var options = {
      //folder: v_fileName,
      types: {
          point: v_fileName, polygon: v_fileName, line: v_fileName
      }
    }
    var shpBuffer = shpwrite.zip(geoJSON, options); 
    console.log('shapeFile ' + shpBuffer)
    return shpBuffer;
  }

// Converts and saves the returned shapefile from generateShapeFileFromGeoJSON() function, used to download the masked data
async function saveShapeFile(geoJSON, option){
    var shpBuffer = await generateShapeFileFromGeoJSON(geoJSON, fileName); 
    var base64String = Uint8Array.from(window.atob(shpBuffer), (v) => v.charCodeAt(0));
    var shapeFileBlob = new Blob([ base64String ], {type:"application/zip"});
    saveAs(shapeFileBlob, option + "_" + fileName + ".zip");   // see FileSaver.js
}

//Return shapefile from geojson
async function returnShapeFile(geoJSON){
    var shpBuffer = await generateShapeFileFromGeoJSON(geoJSON, fileName); 
    var base64String = Uint8Array.from(window.atob(shpBuffer), (v) => v.charCodeAt(0));
    var shapeFileBlob = new Blob([ base64String ], {type:"application/zip"});
    return shapeFileBlob;
    //saveAs(shapeFileBlob, fileName + ".zip");   // see FileSaver.js
}

//Decryption function
//recursive unzip, decrypt and verify. keep on decrypting the encrypted file until we reach the level required by the user. Note encrypted file would be of a zip 
//level 3 = coarse, level 2 = medium, level 1 = fine. Fine indside medium which would be inside coarse
async function multiLevelDecrypt(v_objFile, levelToDecryptTo, currentLevel, downloadFile, startTimeDEC){ // when this function is called at first the value for `currentLevel' should be 1, then when called recursively it increases
    // when this function is called at first the value for `currentLevel' should be 1, then when called recursively it increases
    //console.log("Inside multiLevelDecrypt function ");
    console.log("#### Decryption started. Level To decrypt to = "+  levelToDecryptTo + " currentLevel " + currentLevel);
    
    //To show user the spinner, delay portion of a second - spinner doesnt work without this wait facility
    await new Promise(resolve => setTimeout(resolve, 100));

    //var startTimeDEC = new Date();
    //console.log("Multi Level Decryption: Started " + startTimeDEC);

    //get content from file object. The `big encrypted zip file'
    var cipherbytes = await readfile(v_objFile)
    .catch(function(err){
        console.error(err);
    }); 
    
    var encrypted_maskedData = new Uint8Array(cipherbytes);
    //console.log("Original encrypted_maskedData: " + encrypted_maskedData);  //get file data 
    //console.log("Console: Uploaded encrypted masked data for decryption: " + convertStringToArrayBuffer(encrypted_maskedData));
       
    downloadFile = false;
    if (currentLevel == levelToDecryptTo)
        downloadFile = true;
    
    //first decrypt the file data of the `big encrypted zip file'. Remember a file with a '.enc' extension would have been passed
    //(b) Decrypt. We need to decrypt this coarse level first and store it in a variable 
    var decrypted_file_data;
    decrypted_file_data = await decryptData(v_objFile, encrypted_maskedData, levelToDecryptTo, currentLevel, downloadFile, startTimeDEC); //will automatically use the 'objFile' global variable
   
    if (!decrypted_file_data){
        console.log("Returning without unzipping "); 
        return;
    }

    //`big encrypted zip file' is encrypted. So decrypt it into file content into fileobject so each file can be iterated 
    var file = new File([decrypted_file_data], "decrypted.txt", {
        type: "text/plain",
    });
    v_objFile = file; //assign to variable used below
    decrypted_zip_file = file;
       
    //save decrypted file (in zipped form) 
    //saveAs(v_objFile, "decryptedVolume_"+currentLevel+".zip");
    
    //Unzip each file from the decrypted zip file object,  
    console.log("Unzipping now: "); 
    var jsZip = new JSZip();
    jsZip.loadAsync(v_objFile).then(function (zip) {
        Object.keys(zip.files).forEach(function (filename){
            //iterate over each zipped file 
            zip.files[filename].async('string').then(function (fileData){
                console.log("\t filename: " + filename);                             
                
                //get the maskingflag. This code will be executed in all circumstances, as decryption begins from the outer later
                if (filename  ===  'safeguardingApproach.txt') {
                    verification_masking_flag = fileData;  //get and set the masking flag
                    console.log('fileData: ' + fileData)
                } 
                
                //if the found shapefile file and this is the level of which need to be shown/decrypted                
                //both the zip file containing the next level and the shapefile contain the ".zip" extension
                if (filename.endsWith('.zip') == true && currentLevel == levelToDecryptTo){ 
                    console.log("\t Shapefile to decrypt: " + filename);                       
                    
                    //For verification, the map is displayed now. Decrypt the encrypted volume at that level, display and allow user to save the decrypted file                              
                    //These code below can be later shifted to HBbinning_verification.js             
                    zipfile = zip; 
                    file_name = filename;
                    // Shifted this block of code to the H3Binning_verification.js file
                    zip.file(filename).async('blob').then( (blob) => {
                        //saveAs(blob, filename); 
                        // endTimeDEC = new Date();
                        // executionTimeDEC = ((endTimeDEC - startTimeDEC) / 1000);
                        // console.log("3 levels of decryption complete. Exceution Time: " + executionTimeDEC);

                        (async () => {
                            const buf = await blob.arrayBuffer(); 
                            console.log("buf.byteLength: " + buf.byteLength );
                            decrypted_buf = buf;        //Create a geojson from shapefile for diplay during verification.                  
                                   
                            shp(buf).then(function (geojson) {                                
                                sensitive.data  = JSON.stringify(geojson);  
                                //console.log('sensitive.data '+ sensitive.data )
                                $("#sensitiveTag").html("sensitive.data = " + sensitive.data + ";"); 
                                decryptedGEOJSON = sensitive.data;
                                console.log("Loaded geojson"); // + JSON.stringify(geojson));
                            });
                            
                          })();  
                    }); 
                    console.log("Displayed Map")  
                       
                }
                //if binning was performed
                if (filename.endsWith('binned.geojson') == true && currentLevel == levelToDecryptTo){
                    zip.file(filename).async('string').then( (str) => {    
                        console.log('Binning: Found geoJSON in filename: '+filename+' while encryption Level: ' + currentLevel);
                        decryptedGEOJSON = str;                        
                    });
                }               
                //Look for the encrypted volume. It has an '.enc' file extension. If this is not the right level of decryption, keep going one level down for decrypt 
                else if (filename.endsWith('.enc') == true && currentLevel != levelToDecryptTo) //if the required level not reached, keep on decrypting
                {
                    //console.log("Calling multiLevelDecrypt function again");
                    currentLevel = currentLevel - 1; // decrement the current level
                    //decrypt ... https://stackoverflow.com/questions/65491311/extracted-files-from-zip-using-jszip-return-plain-text-files
                    zip.file(filename).async('blob').then( (blob) => {                            
                        //call recursive decryption 
                        multiLevelDecrypt(blob, levelToDecryptTo, currentLevel, downloadFile, startTimeDEC); 
                    });                        
                }
            })           
        })
    }).catch(err => window.alert(err)) 

    //stop the spinner
    $(".loading-icon").addClass("hide");
    $(".button").attr("disabled", false);
    $(".btn-txt-dec").text("Decrypt"); 

}

async function blobToArrayBuffer(blob) {
    if ('arrayBuffer' in blob) 
        return await blob.arrayBuffer();
    
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject();
        reader.readAsArrayBuffer(blob);
    });
}

//http://jsbin.com/raxutonaho/1/edit?html,js,console
function removeEmpty(obj) {
    Object.keys(obj).forEach(function(key) {
      (obj[key] && typeof obj[key] === 'object') && removeEmpty(obj[key]) ||
      (obj[key] === '' || obj[key] === null) && delete obj[key]
    });
    return obj;
  };

//This is the main encryption function that does the encryption 
//Parameters: the 'file_contents' can be the zipped map file or a document
async function encryptData(isDocument, file_contents, downloadFile, level, startTimeENC) {
    var plaintextbytes = new Uint8Array(file_contents);
    //console.log("plaintextbytes:" + plaintextbytes );
        
    //get passphrase
    var mainPassphrase = document.getElementById("passphraseOutput").value;
    console.log("Main passphrase: " + mainPassphrase);

    var passphrase = preparePassphrase(mainPassphrase, level);  //prepare/reduce passphrase for the different levels
    console.log("Passphrase to use for decryption: " + passphrase);
    //
    var pbkdf2iterations=10000;
    var passphrasebytes=new TextEncoder("utf-8").encode(passphrase);
    //console.log('passphrasebytes' + passphrasebytes);
    var pbkdf2salt=window.crypto.getRandomValues(new Uint8Array(8));
    console.log('pbkdf2salt' + pbkdf2salt);

    var passphrasekey=await window.crypto.subtle.importKey('raw', passphrasebytes, {name: 'PBKDF2'}, false, ['deriveBits'])
        .catch(function(err){
            console.error(err);
        });
    console.log('passphrasekey imported');

    var pbkdf2bytes=await window.crypto.subtle.deriveBits({"name": 'PBKDF2', "salt": pbkdf2salt, "iterations": pbkdf2iterations, "hash": 'SHA-256'}, passphrasekey, 384)
        .catch(function(err){
            console.error(err);
        });
    console.log('pbkdf2bytes derived');
    pbkdf2bytes=new Uint8Array(pbkdf2bytes);

    keybytes=pbkdf2bytes.slice(0,32);
    ivbytes=pbkdf2bytes.slice(32);

    var key=await window.crypto.subtle.importKey('raw', keybytes, {name: 'AES-GCM', length: 256}, false, ['encrypt'])
        .catch(function(err){
            console.error(err);
        });
    console.log('key imported');

    var cipherbytes=await window.crypto.subtle.encrypt({name: "AES-GCM", iv: ivbytes}, key, plaintextbytes)
        .catch(function(err){
            console.error(err);
        });

    if(!cipherbytes) {
        console.error("Error encrypting file.  See console log.");
    }

    cipherbytes=new Uint8Array(cipherbytes);

    //cipherbytes=new Uint8Array(cipherbytes);
    var resultbytes=new Uint8Array(cipherbytes.length+16)
    resultbytes.set(new TextEncoder("utf-8").encode('Salted__'));
    resultbytes.set(pbkdf2salt, 8);
    resultbytes.set(cipherbytes, 16);
    
    //do we need this line of code below?
    var blob = new Blob([resultbytes], {type: 'application/download'}); //resultbytes instead of plaintext    
    
    endTimeENC = new Date();
    executionTimeENC = ((endTimeENC - startTimeENC) / 1000);
    console.log("Level " + level + " encryption complete. Exceution Time: " + executionTimeENC);

    //only download/display link when the level is right
    if(downloadFile){
        //save the blob file
        //https://github.com/eligrey/FileSaver.js/issues/357
        var blob2 = new Blob([resultbytes],{type: 'text/plain'} ); // save as Blob 
        
        //compute hash of the final encrypted volume file (level 3).
        //https://stackoverflow.com/questions/21761453/create-sha-256-hash-from-a-blob-file-in-javascript
        const hashHex = await getHash("SHA-256", blob2)
        hash_value = hashHex;          //finally UPDATE THE GLOBAL VARIABLE 'HASH'
        console.log('hashHex: ' + hashHex); 
        hashOutput.textContent = hash_value;  //display_hash() //display hash 

        full_fileName = fileName + "." + fileExtension + ".enc";  //add '.enc' file extension
        //the string to be minted is stored as a global variable
        minting_string = full_fileName + "_" + hashHex;

        saveAs(blob2, full_fileName); 
        console.log('encrypted volume saved: ' + full_fileName)         
    }   
    encryptedFileData = blob;   //do we need this line of code ??
    return Promise.resolve(resultbytes);
}

// New function for hash 
///https://stackoverflow.com/questions/21761453/create-sha-256-hash-from-a-blob-file-in-javascript
async function getHash(algorithm, data) { 
    const main = async (msgUint8) => { // https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest#converting_a_digest_to_a_hex_string
      const hashBuffer = await crypto.subtle.digest(algorithm, msgUint8)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
    }

    //check if data is blob, processes and returns
    if (data instanceof Blob) {
      const arrayBuffer = await data.arrayBuffer()
      const msgUint8 = new Uint8Array(arrayBuffer)
      return await main(msgUint8)
    }
    const encoder = new TextEncoder()
    const msgUint8 = encoder.encode(data)
    return await main(msgUint8)
  } 

// https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/File_drag_and_drop ... is also on msdn
function readfile(file){
    return new Promise((resolve, reject) => {
        var fr = new FileReader();
        fr.onload = () => {
            resolve(fr.result )
        };
        fr.readAsArrayBuffer(file);
    });
}

function parseZipFile(zipFile) {
    console.log('Parsing zip file ' + zipFile.name + ' ...');
    console.log(' -> data ' + zipFile.data);

    JSZip.loadAsync(zipFile).then(function (zip) {
        Object.keys(zip.files).forEach(function (filename) {
            zip.files[filename].async('string').then(function (fileData) {
                console.log(fileData) // These are your file contents
            })
        })
    })
}

// This function is called during verification. 
// For safeguarding, its not used for opening files all the time. It is only used in the case when user is trying on directly encrypt 
// i.e. line 186 in index.html <p><strong>Optional: Encrypt file directly</strong> without masking.
var openFile = function(event) {
    console.log("File Uploaded");
    var input = event.target;
    var reader = new FileReader();
    reader.onload = function(){
        var arrayBuffer = reader.result;
        console.log(arrayBuffer.byteLength);
    };    
    objFile = input.files[0]; //this is the main variable which is populated

    //file validation for the verification flow (2). 
    console.log("File Validation");
    fileValidation(2); 

    //here call to compute hash and store the resultant value
    compute_hash();
};

// Main function used to decrypt files     
async function decryptData(objFile, encryptedBytes, levelToDecryptTo, currentLevel, download, startTimeDEC){
    console.log("Decryption");    
    var cipherbytes = encryptedBytes; 

    //get passphrase
    var mainPassphrase = document.getElementById("txtDecpassphrase").value;
    console.log("Main passphrase: " + mainPassphrase);

    var passphrase = preparePassphrase(mainPassphrase, currentLevel);  //prepare/reduce passphrase for the different levels
    
    var pbkdf2iterations=10000;
    var passphrasebytes=new TextEncoder("utf-8").encode(passphrase);
    var pbkdf2salt=cipherbytes.slice(8,16);

    var passphrasekey=await window.crypto.subtle.importKey('raw', passphrasebytes, {name: 'PBKDF2'}, false, ['deriveBits'])
        .catch(function(err){
            console.error(err);

        });
    console.log('passphrasekey imported');

    var pbkdf2bytes=await window.crypto.subtle.deriveBits({"name": 'PBKDF2', "salt": pbkdf2salt, "iterations": pbkdf2iterations, "hash": 'SHA-256'}, passphrasekey, 384)
        .catch(function(err){
            console.error(err);
        });
    console.log('pbkdf2bytes derived');
    pbkdf2bytes=new Uint8Array(pbkdf2bytes);

    keybytes=pbkdf2bytes.slice(0,32);
    ivbytes=pbkdf2bytes.slice(32);
    cipherbytes=cipherbytes.slice(16);

    var key=await window.crypto.subtle.importKey('raw', keybytes, {name: 'AES-GCM', length: 256}, false, ['decrypt'])
        .catch(function(err){
            console.error(err);
        });
    console.log('key imported');

    var decryptedData, error = false;

    var plaintextbytes=await window.crypto.subtle.decrypt({name: "AES-GCM", iv: ivbytes}, key, cipherbytes)
        .catch(function(err){
            console.error(err);
            console.log("Error during Decryption");
            error = true;
            //If encounter error, try decrypting with one level down
            //Also ensure that if user is trying to decrypt to middle or outer level, and those do not exist, inform the user
            //so take the 'levelToDecryptTo' variable and if its outer level (level 3) and it does not exist ->  show error and return - with no further processing
            if (currentLevel == 3 && levelToDecryptTo == 3){
                alert('Either the passphrase is incorrect or the encrypted volume does not contain the outer level with the coarse dataset');  
                return false;
            }
            // same for middle level
            else if (currentLevel == 2 && levelToDecryptTo == 2){  
                alert('Either the passphrase is incorrect or the encrypted volume does not contain the middle level with the medium dataset')
                return false;  
            }
            else if (currentLevel == 1 && levelToDecryptTo == 1){  
                alert('The passphrase is incorrect')
                return false;  
            }
            //For levels 3 and 2, the process havent yet reached the 'leveltodecryptto' that the user wants
            //But this should not be applied for level 1, as there is no further to go
            if ((currentLevel != levelToDecryptTo)  && currentLevel == 3 || currentLevel == 2) //just to make sure not to keep on going decrypting and only attempt it two more times (middle and inner level)
            {
                console.log("Trying to encrypt the next (inner) level ");
                decryptedData = multiLevelDecrypt(objFile, levelToDecryptTo, currentLevel - 1, download, startTimeDEC);  
            }            
        });
        
    if(download && (error == false)) { //we only download/display link at the right level
        //save the blob file https://github.com/eligrey/FileSaver.js/issues/357   
        console.log("#### Download Begins");
        endTimeDEC = new Date();
        executionTimeDEC = ((endTimeDEC - startTimeDEC) / 1000);
        console.log("Three levels of decryption complete. Exceution Time: " + executionTimeDEC);        
        var blob = new Blob([plaintextbytes],{type: 'text/plain'} ); // save as Blob 
        var fileName2 = fileName + "_level"+ currentLevel +".zip";
        decryptedZIPFile = blob; //save the decrypted volume/ zip file as global variable, from where map will be displayed
        saveAs(blob, fileName2); 
        console.log('Decrypted file Level'+ currentLevel + 'saved, filename: ' + fileName2)  
    }
    return plaintextbytes;
}

function saveStaticDataToFile(ha, filename) {
    var blob = new Blob([ha],
        { type: "text/plain;charset=utf-8" });
    saveAs(blob, filename);
}

//used to display hash 
function display_hash() {
    console.log("Displaying file: " + full_fileName + " hash: " + hash_value); 
    hashOutput.textContent = hash_value; 
    document.getElementById("mintButton").disabled = false;
    document.getElementById("download-trans").disabled = false;
}

//Display hash of encrypted volume
async function compute_hash(){
    console.log("Computing Hash: ");
    var hashHex;

    if(fileInput.files[0] == undefined) {
        return ;
    }
    var filename = fileInput.files[0].name;
    var reader = new FileReader();
    reader.onload = function(ev) {
        console.log("File", filename, ":");
        // https://techoverflow.net/2021/11/26/how-to-compute-sha-hash-of-local-file-in-javascript-using-subtlecrypto-api/
        crypto.subtle.digest('SHA-256', ev.target.result).then(hashBuffer => {
            // Convert hex to hash, see https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest#converting_a_digest_to_a_hex_string
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
            console.log('HashHex of Encrypted Volume : ' + hashHex) 
            hash_value = hashHex;
            hashOutput.textContent = hash_value;  //display hash 
        }).catch(ex => console.error(ex));
    };
    reader.onerror = function(err) {
        console.error("Failed to read file", err);
    }
    reader.readAsArrayBuffer(fileInput.files[0]);

    //finally update the global variable 'HASH'    
    hash_value = hashHex;     console.log('hash_value ' + hash_value)
}

//Save transaction receipt								
function saveReceipt(minted_string, tx_url, fromAddr, tx_hash, gas_price){    
    console.log('saving Transaction Receipt as PDF');

    var date = new Date()	
    const doc = new jsPDF();
    // metadata -- Optional - set properties on the document
    doc.setProperties({
        title: 'Mapsafe Transaction Record', subject: 'Mapsafe Transaction Record', author: 'Mapsafe',
        //keywords: 'generated, javascript, web 2.0, ajax',
        creator: 'Mapsafe'
    });

    var img = new Image() 
    img.src = '../images/logo_name.png'
    doc.addImage(img, 'png', 25, 10, 50, 12.5) //x pos, y pos, height, width

    doc.text("Transaction Details!", 25, 40);     doc.setFontSize(10);
    //sent from browser metamask 
    doc.text("Date: " + date, 25, 50);                  doc.text(25, 57, 'Wallet Account Address: ');// + fromAddr);
    doc.setTextColor(0, 0, 255); /*blue color text*/    doc.text(70, 57, fromAddr); //fromAddr); //trying on the same line

    doc.setTextColor(0, 0, 0); //black color text
    doc.setFontSize(12);     doc.text("Encrypted volume:", 25, 81);
    doc.setFontSize(10);     doc.text(25, 89,  'Details of the generated encrypted volume: ');
    
    doc.text(25, 97,  'Filename: ');
    doc.setTextColor(0, 0, 255); /*blue color text*/     doc.text(45, 97, full_fileName);  
    doc.setTextColor(0, 0, 0);   /*black color text */   doc.text(25, 104, 'Hash Value: ');
    doc.setTextColor(0, 0, 255); /*blue color text */    doc.text(45, 104,  hash_value);
    doc.setTextColor(0, 0, 0);   /*black color text */

    doc.setFontSize(12);     doc.text("Ethereum Blockchain Notarisation details!", 25, 129);
    
    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);                           doc.text(25, 137, 'Value: '); //txnNumber);
    doc.setTextColor(0, 0, 255);                         doc.text(35, 137,  minted_string);
    doc.setFontSize(10);
   
    doc.setTextColor(0, 0, 0);                           doc.text(25, 144, 'This value will be minted at the following address:'); 
    doc.setTextColor(0, 0, 255); /*blue color text*/    doc.text(25, 151, tx_url);    
    doc.setTextColor(0, 0, 0);   /*black color text */  doc.text(25, 158, 'Gas Price: ' + gas_price);

    doc.text(25, 225, 'MapSafe Data Sovereignty Tool')
    doc.text(25, 230, 'https://www.mapsafe.xyz/')

    var onlyDate = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();   
    doc.save("MapsafeReceipt_"+ onlyDate +".pdf");  // generate pdf 
}

//Function is currently used. It saves one file only - ciphertext
function savezipfile(data,filename) {
    var zip = new JSZip();
    zip.file(filename+".zip", data); //encoded, "Hello World\n"
    console.log("Console: Save zip file " + filename);
    zip.generateAsync({type: "blob"})
        .then(function (content) {
            // see FileSaver.js
            saveAs(content, filename + ".zip");
        });
}

function savezipfilecontent(data,filename) {
    var blob = new Blob(data, {type: "application/zip"}); 
    saveAs(blob, filename + ".zip");
}

function convertStringToArrayBuffer(str) {
    var encoder = new TextEncoder("utf-8");
    return encoder.encode(str);
}
function convertArrayBuffertoString(buffer) {
    var decoder = new TextDecoder("utf-8");
    return decoder.decode(buffer);
}

const circularReplacer = () => {
    // Creating new WeakSet to keep track of previously seen objects
    const seen = new WeakSet();

    return (key, value) => {
        // If type of value is an object or value is null
        if (typeof(value) === "object"
            && value !== null) {

            // If it has been seen before
            if (seen.has(value)) {
                return;
            }
            // Add current value to the set
            seen.add(value);
        }
        // return the value
        return value;
    };
};