using System;
using UnityEngine;

[RequireComponent(typeof(MeshFilter), typeof(MeshRenderer))]
public class TerrainGenerator : MonoBehaviour
{
    public int length = 100;
    public int width = 100;
    public float noiseScale = 10.0f;
    public float heightMultiplier = 5.0f;
    public Gradient lushGradient;
    public Gradient deadGradient;

    private Mesh mesh;
    private Vector3[] vertices;
    private int[] triangles;
    private Color[] colors;
    private Material material;
    private float maxVertexHeight = 0f;
    private float minVertexHeight = 0f;
    void Start()
    {
        GenerateTerrain();
        material = GetComponent<Renderer>().material;
    }
    float Map(float s, float a1, float a2, float b1, float b2)
    {
        return b1 + (s - a1) * (b2 - b1) / (a2 - a1);
    }
    void GenerateTerrain()
    {
        mesh = new Mesh();
        GetComponent<MeshFilter>().mesh = mesh;

        vertices = new Vector3[(length + 1) * (width + 1)];
        for (int i = 0, z = 0; z <= width; z++)
        {
            for (int x = 0; x <= length; x++, i++)
            {
                float y = Mathf.PerlinNoise(x * noiseScale / length, z * noiseScale / width) * heightMultiplier;
                if (y > maxVertexHeight)
                {
                    maxVertexHeight = y;
                }
                if (y < minVertexHeight)
                {
                    minVertexHeight = y;
                }
                vertices[i] = new Vector3(x, y, z);
            }
        }

        colors = new Color[(length + 1) * (width + 1)];
        for (int i = 0, z = 0; z <= width; z++)
        {
            for (int x = 0; x <= length; x++, i++)
            {
                colors[i] = lushGradient.Evaluate(Map(vertices[i].y, minVertexHeight, maxVertexHeight, 0.0f, 1.0f));
            }
        }

        triangles = new int[length * width * 6];
        for (int ti = 0, vi = 0, z = 0; z < width; z++, vi++)
        {
            for (int x = 0; x < length; x++, ti += 6, vi++)
            {
                triangles[ti] = vi;
                triangles[ti + 1] = vi + length + 1;
                triangles[ti + 2] = vi + 1;
                triangles[ti + 3] = vi + 1;
                triangles[ti + 4] = vi + length + 1;
                triangles[ti + 5] = vi + length + 2;
            }
        }

        UpdateMesh();
    }

    void UpdateMesh()
    {
        mesh.Clear();
        mesh.vertices = vertices;
        mesh.triangles = triangles;
        mesh.colors = colors;
        mesh.RecalculateNormals();
    }

    private void Update()
    {
        GenerateTerrain();
    }
}