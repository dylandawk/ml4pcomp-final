Teachable Machine + Harry Potter
===========================

This project combines [Teachable Machine Image and Sound Classifiers](https://teachablemachine.withgoogle.com/) with a microcontroller to create a magical wizarding experience. 

I use the spells "Wingardium Leviosa" and "Lumos" as the voice commands to trigger an N95 mask to rise via servo and string and a light to turn on via power relay. In addition, a wand must be visible to the camera in order for the voice commands to work.

It was fortunately, or unfortunately, trained on my gestures and voice so in order to reproduce this you would have to retrain an image and sound model from Teachable machine and use the link to the model provided to change [imageAndSoundDetectorApp.js](https://github.com/dylandawk/ml4pcomp-final/blob/master/app/imageAndSoundDetector/imageAndSoundDetectorApp.js) lines 4 & 5. 

## Attribution
A long time ago this was a starter on Glitch using React and Webpack. It was copied by @starakaj, and then React has been removed You can find the original at https://glitch.com/~starter-react.

This project relates to video 2 of 5 in the [React Starter Kit](https://glitch.com/react-starter-kit) video series.
