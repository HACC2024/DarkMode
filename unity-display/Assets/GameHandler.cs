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
        if (Application.isEditor)
        {
            float t = Time.timeSinceLevelLoad % interval / interval;
            modifyEvents.Invoke(t);
        }
    }

    public void Modify(float t)
    {
        modifyEvents.Invoke(t);
    }
}
