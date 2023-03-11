//credit to: https://github.com/fmgrafikdesign/SimpleWebSerialJS/blob/main/examples/control-led-with-button/plain/plain.ino
//Arduino script used to interface with the front end + AI control model. 


//wire up an LED to pin 2
const int ledPin = 2;
void setup() {
  Serial.begin(9600);
  pinMode(ledPin, OUTPUT);
}

void loop() {
  //responds to the front end files either button press or AI video model detection for palm open palm closed
  if(Serial.available()) {
    int inByte = Serial.read();
    if(inByte == 0) {
        digitalWrite(ledPin, HIGH);
    } else if (inByte == 1) {
        digitalWrite(ledPin, LOW);
    }
  }
  delay(5);
}
