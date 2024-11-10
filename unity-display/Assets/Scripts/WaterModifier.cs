using System.Collections;
using System.Collections.Generic;
using Unity.VisualScripting;
using UnityEngine;

public class WaterModifier : MonoBehaviour, IModifiable
{
    [SerializeField] private Material material;
    [SerializeField] Color cleanDeepColor;
    [SerializeField] Color cleanShallowWater;
    [SerializeField] Color dirtyDeepColor;
    [SerializeField] Color dirtyShallowColor;
    void Start()
    {
    }

    public void ModifyScene(float t)
    {
        Color newDeepColor = Color.Lerp(cleanDeepColor, dirtyDeepColor, t);
        Color newShallowColor = Color.Lerp(cleanShallowWater, dirtyShallowColor, t);

        material.SetColor("_DeepColor", newDeepColor);
        material.SetColor("_ShallowColor", newShallowColor);
    }

    private void OnDisable()
    {
        material.SetColor("_DeepColor", cleanDeepColor);
        material.SetColor("_ShallowColor", cleanShallowWater);
    }
}
