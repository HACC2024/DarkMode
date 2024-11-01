using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class EnergyModifier : MonoBehaviour, IModifiable
{
    [SerializeField] private RectTransform rectTransform;
    private RectTransform thisRectTransform;
    private float _startLocalScaleX;
    private Vector3 shakeOffset;
    private float currentT;

    private void Awake()
    {
        _startLocalScaleX = rectTransform.localScale.x;
        shakeOffset = new Vector3(Random.Range(0.0f, 1.0f), Random.Range(0.0f, 1.0f), Random.Range(0.0f, 1.0f));
        thisRectTransform = GetComponent<RectTransform>();
    }

    public void ModifyScene(float t)
    {
        currentT = t;
        Vector3 localScale = rectTransform.localScale;
        localScale.x = t * _startLocalScaleX;
        rectTransform.localScale = localScale;
    }

    private void Update()
    {
        // float time = Time.time;
        // float frequency = 20f + (currentT * 30f); // Increase frequency with currentT
        // float magnitude = 10f * currentT; // Exponential increase in magnitude

        // thisRectTransform.localPosition = new Vector3(
        //     Mathf.Sin(frequency * time + shakeOffset.x) * magnitude,
        //     Mathf.Sin(frequency * time + shakeOffset.y) * magnitude,
        //     thisRectTransform.localPosition.z
        // );
    }
}
