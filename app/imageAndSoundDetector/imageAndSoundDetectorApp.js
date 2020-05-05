//const p5 = require("p5"); // Just so it's easy to draw

// Model URL
const soundModelURL = 'https://teachablemachine.withgoogle.com/models/2KIex-SIK/';
const imageModelURL = 'https://teachablemachine.withgoogle.com/models/Gl-Gn5B-C/';

let serial;// variable to hold an instance of the serialport library
let portName = '/dev/tty.usbmodem146401';// fill in your serial port name here

// These are the options that you can pass to your sound classifier when creating 
// it. Unless you pass "invokeCallbackOnNoiseAndUnknown: true", the callback
// will only trigger when one of the non-noise categories is recognized.
const soundClassifierOptions = {
    includeSpectrogram: true, // in case listen should return result.spectrogram
    probabilityThreshold: 0.90,
    invokeCallbackOnNoiseAndUnknown: true,
    overlapFactor: 0.50 // probably want between 0.5 and 0.75.
}
const flipVideo = true;
const width = 640;
const height = 480;

let outByte = 0;// for outgoing data
let latestData = "waiting for data";

const p5draw = (p) => {
    
    let audioClassifier, videoClassifier;
    let audioLabel = "listening...";
    let videoLabel = "loading...";
    let videoConfidence = "loading...";
    let prevAudioLabel;
    var cnv;

	p.setup = () => {

        cnv = p.createCanvas(width, height);
        centerCanvas();
        //p.background(255);

        // set up serial communication
        serial = new p5.SerialPort();    // make a new instance of the serialport library
        serial.open(portName);           // open a serial port
        serial.on('error', serialError); // callback for errors
        serial.on('open', gotOpen);
        serial.on('close', gotClose);

        p5video = p.createCapture(p.VIDEO);
		p5video.size(width, height);
        p5video.hide();

        // We'll use this offscreen canvas to store the video, in case we
        // want to transform it before classifying it
        offscreenGraphics = p.createGraphics(width, height);
        
        videoClassifier = ml5.imageClassifier(imageModelURL + 'model.json', classifyVideo);
        audioClassifier = ml5.soundClassifier(soundModelURL + 'model.json', soundClassifierOptions, audioClassifierReady);
    }
    
    function gotOpen() {
        console.log("Serial Port is Open");
    }
       
    function gotClose(){
        console.log("Serial Port is Closed");
        latestData = "Serial Port is Closed";
    } 

    function serialError(err) {
        console.log('Something went wrong with the serial port. ' + err);
    }

    function centerCanvas() {
        var x = (p.windowWidth - width) / 2;
        var y = (p.windowHeight - height) / 2;
        cnv.position(x, y);
    }

    p.windowResized = () => {
        centerCanvas();
    }

	p.draw = () => {
        //p.background(0);

        // This draws the video with X and Y flipped
        offscreenGraphics.push();
        if (flipVideo) {
            offscreenGraphics.translate(width, 0);
            offscreenGraphics.scale(-1, 1);
        }
        offscreenGraphics.image(p5video, 0, 0, width, height);
        offscreenGraphics.pop();

        p.image(offscreenGraphics, 0, 0, p.width, p.height);

        // Draw the label
        p.fill(255);
        p.textSize(10);
        p.textAlign(p.CENTER);
        p.text(`Audio Label: ${audioLabel}, Video Label: ${videoLabel} `, width / 2, height - 4);
        sendSerialData();
    }

    // Get a prediction for the current video frame
    function classifyVideo() {
        videoClassifier.classify(offscreenGraphics, gotVideoResult);
    }

    // Unlike the video classifier, this classifier will run continuously,
    // calling gotResult again and again
    function audioClassifierReady() {
        audioClassifier.classify(gotAudioResult);
    }

    function gotVideoResult(error, results) {
        if (error) {
            console.error(error);
            return;
        }

        // results is an array, sorted by confidence. Each
        // result will look like { label: "category label" confidence: 0.453 }
        // or something like this
        videoLabel = results[0].label;
        videoConfidence = results[0].confidence;
        classifyVideo();
    }
    
    function gotAudioResult(error, results) {
        if (error) {
            console.error(error);
            return;
        }

        // results is an array, sorted by confidence. Each
        // result will look like { label: "category label" confidence: 0.453 }
        // or something like this
        audioLabel = results[0].label;
    }

    function sendSerialData(){
        if(audioLabel != "_background_noise_" && 
            audioLabel != prevAudioLabel &&
            videoLabel === "wand" &&
            videoConfidence > 0.95)
        {
            outByte = (audioLabel == 'lumos') ? 0 : 1;
            serial.write(outByte);
            console.log(outByte);
        }
        //console.log(`Video Label: ${videoLabel}, Confidence: ${videoConfidence}, Audio Label: ${audioLabel}`);
        prevAudioLabel = audioLabel;
    }
}

module.exports = function setup() {
	const myp5 = new p5(p5draw, "main");
}