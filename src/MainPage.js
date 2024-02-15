import React from 'react';
import { useState } from 'react'; 
import Plot from 'react-plotly.js';
let gpxParser = require('gpxparser');


//replaces the file upload page and renders the map, splits, pace chart, etc
const MainPage = (props) => { 

    let gpx = new gpxParser();
    gpx = props.gpxData;

    const [miles_km, setMiles_km] = useState(true);//state for miles/km, defaults to miles
    const [showChart, setShowChart] = useState(true);//state for showing chart

    const onOptionChangeTrue = () => {
        setMiles_km(true);
    }

    const onOptionChangeFalse = () => {
        setMiles_km(false);
    }

    const handleChange = () => {
        setShowChart(!showChart); //if something happens to the checkbox, change to opposite
      };

    const totalMeters = gpx.tracks[0].distance.total; 
    const totalMiles = totalMeters / 1609.3445; //converts distance to miles
    const totalKm = totalMeters / 1000;

    let numPoints = gpx.tracks[0].points.length;
    
    //calculating the time the activity takes in minutes:seconds formt
    let endTime = gpx.tracks[0].points[numPoints-1].time.toString();
    let startTime = gpx.tracks[0].points[0].time.toString();

    let duration = (Date.parse(endTime) - Date.parse(startTime)) / 1000; //gets the number of seconds the activity took (parse returns milliseconds)
    let minutes = Math.floor(duration / 60);
    let seconds = duration - (minutes * 60); //subtracts the time in minutes to get the remaining seconds

    //We can use this same process to calculate pace (with time per mile = duration/distance)
    let mileDuration = duration/totalMiles;
    let paceMin = Math.floor(mileDuration / 60);
    let paceSec = mileDuration - (paceMin * 60);

    //calculting pace in km
    let kmDuration = duration/totalKm;
    let paceMinKm = Math.floor(kmDuration / 60);
    let paceSecKm = kmDuration - (paceMinKm * 60);

    //generate elevation chart
    let xValues = []
    let yValues = []

    for (let i = 0; i < numPoints; i++) {
        xValues.push(i);
        yValues.push(gpx.tracks[0].points[i].ele);
        
    }

    //create chart
    // Define Data
    const chartData = [{
    x: xValues,
    y: yValues,
    mode: "lines",
    type: "scatter"
    }];

    const chartLayout = {
        xaxis: {range: [0, numPoints-1], title: "Elevation (meters)", showticklabels: false},
        yaxis: {range: [Math.min(...yValues), Math.max(...yValues)], title: ""},
        title: "Elevation",
    };

  
  return (
    
    <div className="MainPage"> 
        <input type="radio" id="miles" name="unitType" value={true}  onChange={onOptionChangeTrue} ></input>
        <label for="miles">Miles</label><br></br>
        <input type="radio" id="km" name="unitType" value={false} onChange={onOptionChangeFalse}></input>
        <label for="km">Kilometers</label><br></br>

        <div className='MainStats'>
            <p>Total Distance: {miles_km ?  totalMiles.toFixed(2) + " mi" : totalKm.toFixed(2) + " km"}</p>
            <p>Time: {minutes}:{seconds}</p>
            <p>Average Pace: {miles_km ?  paceMin+":"+paceSec.toFixed(0)+"/mi" : paceMinKm+":"+paceSecKm.toFixed(0)+"/km"}</p>
        </div>

        <br></br>
        <input type="checkbox" id="hideElev" name="hideElev" value="Hide" checked={showChart} onChange={handleChange} />
        <label for="hideElev"> Hide</label><br></br>
        {showChart ? <Plot data={chartData} layout={chartLayout}/> : null }
    </div> 
    
  ); 
  
}; 

export {MainPage};