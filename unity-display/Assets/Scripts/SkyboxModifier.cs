using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class SkyboxModifier : MonoBehaviour, IModifiable
{
    public Color lushSky;
    public Color dirtySky;
    public float rotationSpeed = 10f;

    float currentRotation = 0;

    public void ModifyScene(float t)
    {
        Color newColor = Color.Lerp(lushSky, dirtySky, t);
        RenderSettings.skybox.SetColor("_Tint", newColor);
    }

    void Update()
    {
        currentRotation += rotationSpeed * Time.deltaTime;
        currentRotation %= 360;
        RenderSettings.skybox.SetFloat("_Rotation", currentRotation);
    }

    void OnDestroy()
    {
        RenderSettings.skybox.SetColor("_Tint", lushSky);
    }
}