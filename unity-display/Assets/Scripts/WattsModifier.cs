using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using TMPro;

public class WattsModifier : MonoBehaviour, IModifiable
{
    private TextMeshProUGUI textMeshPro;
    public GameHandler gameHandler;

    public void ModifyScene(float t)
    {
        if (gameHandler == null)
        {
            return;
        }

        if (textMeshPro == null)
        {
            return;
        }

        textMeshPro.text = $"{Mathf.FloorToInt(gameHandler.totalWatts * t)}/{gameHandler.totalWatts}\nWATTS";
    }

    // Start is called before the first frame update
    void Start()
    {
        textMeshPro = GetComponent<TextMeshProUGUI>();
    }
}
