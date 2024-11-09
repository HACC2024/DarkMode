#include <Arduino.h>
#include <WiFi.h>
#include <WiFiClientSecure.h>
#include "SECRETS.h"
#include <PubSubClient.h>
#include <HTTPClient.h>
#include <Bounce2.h>

WiFiClientSecure wifiClient;
PubSubClient mqttClient(wifiClient);
String clientId;
String deviceId;
uint8_t switchPin = 13;
Bounce toggle = Bounce();

int registerSwitch(String token, String switchId)
{
  String postData = "";
  HTTPClient http;
  http.begin(wifiClient, SERVER_URL, SERVER_PORT, "/api/switch", true);
  http.addHeader("Authorization", "Bearer " + token);
  http.addHeader("X-Client-ID", switchId);
  http.addHeader("Content-Length", String(postData.length()));

  int responseCode = http.POST("");

  switch (responseCode)
  {
  case 401:
    Serial.println("Authorization Failed");
    break;
  case 400:
    Serial.println("X-Client-ID not found");
    break;
  case 200:
    Serial.println("Registration Successful");
    break;
  default:
    Serial.println("Unknown error: " + responseCode);
    break;
  }

  return responseCode;
}

String getDeviceId(String token, String switchId)
{
  String postData = "";
  HTTPClient http;
  http.begin(wifiClient, SERVER_URL, SERVER_PORT, "/api/switch", true);
  http.addHeader("Authorization", "Bearer " + token);
  http.addHeader("X-Client-ID", switchId);
  http.addHeader("Content-Length", String(postData.length()));
  int responseCode = http.GET();

  switch (responseCode)
  {
  case 401:
    Serial.println("Authorization Failed");
    break;
  case 400:
    Serial.println("X-Client-ID not found");
    break;
  case 200:
    Serial.println("Get Device ID Successful");
    return http.getString();
  case 404:
    Serial.println("Could not find Device ID");
    break;
  default:
    Serial.println("Unknown error: " + responseCode);
    break;
  }

  return "";
}

String getClientId()
{
  uint8_t mac[6];
  WiFi.macAddress(mac);
  char clientId[9];
  snprintf(clientId, sizeof(clientId), "%02X%02X%02X%02X", mac[2], mac[3], mac[4], mac[5]);
  Serial.println("8-Character MAC Representation: " + String(clientId));
  return String(clientId);
}

void connectToWifi()
{
  delay(10);
  WiFi.begin(SSID, PASS);

  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }
  Serial.println();
  Serial.println("Connected to WiFi");
  wifiClient.setInsecure();
}

void reconnect()
{
  // Loop until we're reconnected
  while (!mqttClient.connected())
  {
    Serial.print("Attempting MQTT connection...");
    // Attempt to connect
    if (mqttClient.connect(clientId.c_str()))
    {
      Serial.println("connected");
      // Subscribe
    }
    else
    {
      Serial.print("failed, rc=");
      Serial.print(mqttClient.state());
      Serial.println(" try again in 2 seconds");
      // Wait 2 seconds before retrying
      delay(2000);
    }
  }
}

void connectToMqtt()
{
  mqttClient.setServer(MQTT_DOMAIN, MQTT_PORT);
}

void toggleSwitch(int state)
{
  if (deviceId == "")
  {
    return;
  }
  Serial.println(state == 1 ? "on" : "off");
  mqttClient.publish(("device/" + deviceId).c_str(), state == 1 ? "on" : "off");
}

void setup()
{
  Serial.begin(9600);
  pinMode(switchPin, INPUT_PULLDOWN);
  toggle.attach(switchPin, INPUT_PULLUP); // USE INTERNAL PULL-UP
  toggle.interval(5);
  connectToWifi();
  connectToMqtt();
  clientId = getClientId();
  deviceId = getDeviceId(TOKEN, clientId);
  registerSwitch(TOKEN, clientId);
}

void loop()
{
  while (!mqttClient.connected())
  {
    reconnect();
  }
  mqttClient.loop();

  toggle.update();

  if (toggle.changed())
  {
    toggleSwitch(toggle.read());
    // Serial.println("SWITCHED");
  }
}