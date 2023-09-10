// This script is used to validate each step in the multi-step form and also to enable the next options
// For the layers, on each of the steps in the process (multi-step form) we confirm if the users want to skip the step

var loadDisplayCompleted  = false; //If the user has loaded and displayed the map
var maskingCompleted      = false;
var binningCompleted      = false; //Keep track of whether binning of masking os chosen.
var encryptionCompleted   = false;
var notarisationCompleted = false;

//each of the following functions validates one task on Mapsafe

function validateMasking(){
    var maskingbutton = document.getElementById("mask");
    console.log(maskingbutton.dataset.clicked ? "Yes" : "No");
    if (maskingbutton.dataset.clicked)
      console.log('Masking done')
    else{
      console.log('Masking not done')
      var proceed = confirm('Are you sure you want to skip masking')      
        if (proceed) {
        //proceed
        } else {
        //don't proceed
        }
    }
  }   
  
  function validateEncryption(){
    var maskingbutton = document.getElementById("mask");
    console.log(maskingbutton.dataset.clicked ? "Yes" : "No");
    if (maskingbutton.dataset.clicked)
      console.log('Masking done')
    else{
      console.log('Masking not done')
      confirm('Are you sure you want to skip encryption')
    }
  }    

function fileValidation(flow) {
  var displayMapButton = document.getElementById("displayMap");
  var firstNextButton = document.getElementById("firstnextaction-button");
  
  if(flow == 1)       //safeguarding
    fileInput = document.getElementById('sensitiveInput');    //store first and only file as global variable                   
  else if(flow == 2)  //verification      
    fileInput = document.getElementById('encryptedInput');    //store first and only file as global variable  
   
  var filePath = fileInput.value;   
  var fpath = filePath.replace(/\\/g, '/'); //var fpath = this.value; //https://stackoverflow.com/questions/20323999/how-to-get-file-name-without-extension-in-file-upload-using-java-script?noredirect=1&lq=1
  fileName = fpath.substring(fpath.lastIndexOf('/')+1, fpath.lastIndexOf('.'));  
  fileExtension = filePath.split('.').pop();  console.log('fileExtension ' + fileExtension); //get file extension for documents
  
  if (flow == 1) {  //safeguarding
    if (fileExtension == "zip" || fileExtension == "ZIP") {  
        firstNextButton.disabled = false; displayMapButton.disabled = false; console.log('Valid shapefile');        
    } else {
        firstNextButton.disabled = true;  displayMapButton.disabled = true; //just making sure, but it should alrady be disabled
        console.log('Invalid shapefile'); alert('Invalid file type');
    }
  }
  else if (flow == 2) {   //verification
    if (fileExtension == "enc" || fileExtension == "ENC") { 
        firstNextButton.disabled = false; displayMapButton.disabled = false; console.log('Valid encrypted filetype');
    } else {
        firstNextButton.disabled = true;    //making sure, but it should alrady be disabled
        console.log('Invalid encrypted volume'); alert('Invalid file type');
    }
  }
}