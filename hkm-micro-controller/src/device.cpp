#include <Arduino.h>
#include <WiFi.h>
#include <WiFiClientSecure.h>
#include "SECRETS.h"
#include <PubSubClient.h>
#include <HTTPClient.h>

WiFiClientSecure wifiClient;
PubSubClient mqttClient(wifiClient);
String clientId;
uint8_t ledPin = 13;

int registerDevice(String token, String deviceId)
{
  String postData = "";
  HTTPClient http;
  http.begin(wifiClient, SERVER_URL, SERVER_PORT, "/api/device", true);

  http.addHeader("Authorization", "Bearer " + token);
  http.addHeader("X-Client-ID", deviceId);
  http.addHeader("Content-Length", String(postData.length()));
  int responseCode = http.POST("");

  if (responseCode == 401)
  {
    Serial.println("Authorization Failed");
  }
  else if (responseCode == 400)
  {
    Serial.println("X-Client-ID not found");
  }
  else if (responseCode == 200)
  {
    Serial.println("Registration Successful");
  }
  else
  {
    Serial.println("Unknown error: " + responseCode);
  }

  return responseCode;
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

void mqttCallback(char *topic, byte *message, unsigned int length)
{
  if (String(topic) != "device/" + String(clientId))
  {
    return;
  }

  Serial.print("Message arrived on topic: ");
  Serial.print(topic);
  Serial.print(". Message: ");

  String messageTemp = String((char *)message, length);
  Serial.println(messageTemp);

  Serial.print("Changing output to ");
  if (messageTemp == "on")
  {
    Serial.println("on");
    digitalWrite(ledPin, HIGH);
  }
  else if (messageTemp == "off")
  {
    Serial.println("off");
    digitalWrite(ledPin, LOW);
  }
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
      mqttClient.subscribe(("device/" + clientId).c_str());
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
  mqttClient.setCallback(mqttCallback);
}

void setup()
{
  pinMode(ledPin, OUTPUT);
  Serial.begin(9600);
  connectToWifi();
  connectToMqtt();
  clientId = getClientId();
  registerDevice(TOKEN, clientId);
}

void loop()
{
  while (!mqttClient.connected())
  {
    reconnect();
  }

  mqttClient.loop();
}