#include <string>

bool ON_RELAY_STATE = LOW;
int INITIALIZED_PIN_RANGE_MIN = 0;
int INITIALIZED_PIN_RANGE_MAX = 17;

// Expose function
bool successOn = Particle.function("turnOn", turnOn);
bool successOff = Particle.function("turnOff", turnOff);

// Turn on inputted relay pin
int turnOn(String relayPin) {
    int relayNum = relayPin.toInt();
    digitalWrite(relayNum, ON_RELAY_STATE);
    return relayNum;
}

// Turn off inputted relay
int turnOff(String relayPin) {
    int relayNum = relayPin.toInt();
    digitalWrite(relayNum, not ON_RELAY_STATE);
    return relayNum;
}

void setup() {
    // Initialize pins
    for (unsigned int i = INITIALIZED_PIN_RANGE_MIN; i < INITIALIZED_PIN_RANGE_MAX; ++i) {
        pinMode(i, OUTPUT);
        digitalWrite(i, not ON_RELAY_STATE);
    }
}

void loop() {
    // Do nothing, only exposing functions
}
