using UnityEngine;

[RequireComponent(typeof(MeshFilter), typeof(MeshRenderer))]
public class TerrainGenerator : MonoBehaviour
{
    public int length = 100;
    public int width = 100;
    public float noiseScale = 10.0f;
    public float heightMultiplier = 5.0f;

    private Mesh mesh;
    private Vector3[] vertices;
    private int[] triangles;

    void Start()
    {
        GenerateTerrain();
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
                vertices[i] = new Vector3(x, y, z);
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
        mesh.RecalculateNormals();
    }
}