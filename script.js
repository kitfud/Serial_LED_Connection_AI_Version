var connectContainer = document.getElementById("connectContainer")

var controlContainer = document.getElementById("controlContainer")
controlContainer.style.visibility="hidden"


    let port;
    let portOpen = false
    let toggle = false;

    let palmOpen; 
    let palmClosed; 

    let prediction; 

    async function connect() {
        console.log('connect called');
        port = await navigator.serial.requestPort();
        await port.open({
            baudRate: 9600
        })
      controlContainer.style.visibility = "visible"
      connectContainer.style.visibility="hidden"
  
    }


async function buttonToggle(){
    const writer = port.writable.getWriter();
        const byte = (toggle = !toggle) ? 0 : 1
        const data = new Uint8Array([byte]); // 1
        await writer.write(data);
        writer.releaseLock();
}

    async function toggleLED(toggleVal) {
        const writer = port.writable.getWriter();
        const byte = toggleVal
        const data = new Uint8Array([byte]); // 1
        await writer.write(data);
        writer.releaseLock();
    }

    // More API functions here:
    // https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

    // the link to your model provided by Teachable Machine export panel
    const URL = "https://teachablemachine.withgoogle.com/models/KFSlR7AUh/";

    let model, webcam, labelContainer, maxPredictions;

    // Load the image model and setup the webcam
    async function init() {
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";
    portOpen=true;
        // load the model and metadata
        // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
        // or files from your local hard drive
        // Note: the pose library adds "tmImage" object to your window (window.tmImage)
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();

        // Convenience function to setup a webcam
        const flip = true; // whether to flip the webcam
        webcam = new tmImage.Webcam(200, 200, flip); // width, height, flip
        await webcam.setup(); // request access to the webcam
        await webcam.play();
        window.requestAnimationFrame(loop);

        // append elements to the DOM
        document.getElementById("webcam-container").appendChild(webcam.canvas);
        labelContainer = document.getElementById("label-container");
        for (let i = 0; i < maxPredictions; i++) { // and class labels
            labelContainer.appendChild(document.createElement("div"));
        }
    }

    async function loop() {
        webcam.update(); // update the webcam frame
        await predict();
      console.log("palmOpen",prediction[0].probability)
      //console.log("palmClosed",prediction[1].probability)
      palmOpen = prediction[0].probablity
      //palmClosed = prediction[1].probablity

     console.log("palmOpen",)

      //console.log(portOpen)
      if (portOpen){
       // console.log("port active!")
        //console.log("palmClosed",palmClosed)
      if(prediction[0].probability>.85){
      console.log("palmOpen")
        toggleLED(0)
      }
     else if (prediction[1].probability>.85){
        console.log("palmClosed")
        toggleLED(1)
      }
      }
       
        window.requestAnimationFrame(loop);
    }

    // run the webcam image through the image model
    async function predict() {
        // predict can take in an image, video or canvas html element
        prediction = await model.predict(webcam.canvas);
        for (let i = 0; i < maxPredictions; i++) {
            const classPrediction =
                prediction[i].className + ": " + prediction[i].probability.toFixed(2);
            labelContainer.childNodes[i].innerHTML = classPrediction;
        }      
    }