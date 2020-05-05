
#include <Servo.h>
#define PINOUT 2
#define SERVO_PIN 9


char currCha, prevChar;
int pos = 0;
int lightState = LOW;
int servoState = LOW;
int count = 0;
byte inData = 0;

Servo servo;

void setup() {
  // put your setup code here, to run once:


  pinMode(PINOUT, OUTPUT);
  servo.attach(9);
  servo.write(0);

  //Serial.println("Serial Ready");
  Serial.begin(9600);
}

void loop() {
  if (Serial.available() > 0) {
    
    inData = (byte)Serial.read();
    setOutput(inData);
    Serial.println(inData);
    delay(1000);
      
  }
  
  

}

void setOutput(byte data) {
  if (data == 0) {
    lightState = (lightState) ? LOW : HIGH;
    digitalWrite(PINOUT, lightState);
    Serial.println("Lumos");
  } else if(data == 1) {
    runServo();
    //Serial.print("In Data: "); Serial.print(data); Serial.println(" LOW");
  } else Serial.println("Incorrect Input");
}

void runServo() {
  Serial.println("Leviosa");
  if (servoState == LOW) {
    for (pos = 0; pos <= 270; pos += 1) { // goes from 0 degrees to 180 degrees
      // in steps of 1 degree
      servo.write(pos);       // tell servo to go to position in variable 'pos'
      delay(15);              // waits 15ms for the servo to reach the position
    }
  } else {
    for (pos = 270; pos >= 0; pos -= 1) { // goes from 180 degrees to 0 degrees
      servo.write(pos);              // tell servo to go to position in variable 'pos'
      delay(15);                       // waits 15ms for the servo to reach the position
    }
  }
  servoState = (servoState == LOW) ? HIGH : LOW;
}
