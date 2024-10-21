using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Events;

public class GameHandler : MonoBehaviour
{
    public UnityEvent<float> modifyEvents;
    [SerializeField] private float interval = 10f;
    private void Update()
    {
        float t = Time.timeSinceLevelLoad % interval / interval;
        Debug.Log(t);
        modifyEvents.Invoke(t);
    }
}
