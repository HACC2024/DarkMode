#include <Arduino.h>
#include <WiFi.h>
#include "SECRETS.h"

void setup()
{
  Serial.begin(115200);
  WiFi.begin(SSID, PASS);

  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(1000);
    Serial.print(".");
  }
  Serial.println();
  Serial.println("Connected to WiFi");

  postButtonState();
}

void loop()
{
  postButtonState();
  delay(1000); // Add a delay to prevent spamming the server
}

void postButtonState()
{
  WiFiClient client;
  if (client.connect(SERVER_URL, SERVER_PORT))
  {
    String postData = "{\"state\":\""; // Use the TOKEN defined in SECRETS.h
    client.println("POST / HTTP/1.1");
    client.println("Host: " SERVER_URL); // Use SERVER_URL as the host
    client.println("Content-Type: application/json");
    client.println("Authorization: Bearer " TOKEN); // Add TOKEN in the authorization header
    client.print("Content-Length: ");
    client.println(postData.length());
    client.println();
    client.print(postData);

    Serial.println("Post request sent");
  }
  else
  {
    Serial.println("Connection to server failed");
  }
  client.stop();
}