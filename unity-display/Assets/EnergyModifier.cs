using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class EnergyModifier : MonoBehaviour, IModifiable
{
    [SerializeField] private RectTransform rectTransform;

    public void ModifyScene(float t)
    {
        Vector3 localScale = rectTransform.localScale;
        localScale.x = t;
        rectTransform.localScale = localScale;

    }
}
