using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class TerrainModifier : MonoBehaviour, IModifiable
{
    [SerializeField] private float verticalDisplacement;
    private Vector3 startingPosition;
    private void Start()
    {
        startingPosition = transform.position;
    }
    public void ModifyScene(float t)
    {
        transform.position = t * Vector3.up * verticalDisplacement + startingPosition;
    }

}
