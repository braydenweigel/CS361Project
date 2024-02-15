import './App.css';
import React from 'react'; 
import { useState } from 'react'; 
import { MainPage } from './MainPage.js';

let gpxParser = require('gpxparser');
var gpx = new gpxParser(); //creates a gpxParser object 

//default content for when the page opens
export default function App() {

  const [mainpage, setMainpage] = useState(false); //the main page content won't appear until the file has been uploaded and processed

  function handleClick() {
    setMainpage(false); //mainpage content disappears initially when button is clicked (as new data needs to be processed)
    gpx = new gpxParser();

    const uploadedFile = document.getElementById("fileSelector").files[0]; //gets the file that the user has uploaded
    let fileReader = new FileReader();

    fileReader.onload = function () { //use onload so string won't store text until the file has been fully read
      const gpxString = fileReader.result; //string gpxData stores the binary text of the gpx file
      gpx.parse(gpxString);//parses the gpx string
      setMainpage(true);//changes the state to true so the mainpage content can render
      
    }

    fileReader.readAsText(uploadedFile); //reads the uploaded file
    

  }
  
  return (
    <div className="App">
      <form>
        <input type="file" id="fileSelector" name="fileSelector" accept=".gpx"/><br></br>
        <input type="text" id="link" name="link" placeholder="Activity Link Here" disabled/><br></br>
        <button type="button" title="Upload File" onClick={handleClick}>Upload File</button>
      </form>
      {mainpage ? <MainPage gpxData={gpx}/> : null /*send data from gpxParser because the main page content needs the data*/}
      
    </div>
  );
}


