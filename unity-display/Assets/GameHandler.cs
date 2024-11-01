using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Events;

public class GameHandler : MonoBehaviour
{
    public UnityEvent<float> modifyEvents;
    public int totalWatts = 0;
    private float targetValue = 1.0f;
    private float currentValue = 0.0f;
    [SerializeField] private float interval = 10f;
    private float lerpDuration = 1.0f; // Duration for lerping
    private float randomTargetValueTimer = 0f; // Timer for random target value assignment

    private void Update()
    {
        if (Application.isEditor)
        {
            float t = Time.timeSinceLevelLoad % interval / interval;
            modifyEvents.Invoke(t);

            // Randomly assign targetValue to a random float value between 0 and 1 every 2 seconds
            randomTargetValueTimer += Time.deltaTime;
            if (randomTargetValueTimer >= 2f)
            {
                targetValue = Random.Range(0f, 1f);
                randomTargetValueTimer = 0f; // Reset the timer
            }
        }

        // Lerp currentValue to targetValue over the duration
        currentValue = Mathf.Lerp(currentValue, targetValue, Time.deltaTime / lerpDuration);
        modifyEvents.Invoke(currentValue);
    }

    public void Modify(float t)
    {
        targetValue = t; // Set targetValue to t
    }

    public void SetTotalWatts(int totalWatts)
    {
        this.totalWatts = totalWatts;
    }
}
