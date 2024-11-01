using UnityEngine;
using UnityEngine.UI;

public class GradientModifier : MonoBehaviour, IModifiable
{
    public Gradient gradient;
    private Image image;

    public void ModifyScene(float t)
    {
        image.color = gradient.Evaluate(t);
    }

    void Start()
    {
        image = GetComponent<Image>();
    }
}
