using UnityEngine;

[RequireComponent(typeof(MeshFilter), typeof(MeshRenderer))]
public class IslandComputeGenerator : MonoBehaviour
{
    public int length = 100;
    public int width = 100;
    public float noiseScale = 10.0f;
    public float heightMultiplier = 5.0f;

    public ComputeShader computeShader;

    private Mesh mesh;
    private ComputeBuffer vertexBuffer;
    private ComputeBuffer triangleBuffer;

    private struct VertexData
    {
        public Vector3 position;
        public Vector3 normal;
    }

    void Start()
    {
        InitializeMesh();
    }

    void InitializeMesh()
    {
        mesh = new Mesh();
        GetComponent<MeshFilter>().mesh = mesh;

        int vertexCount = (length + 1) * (width + 1);
        int triangleCount = length * width * 6;

        vertexBuffer = new ComputeBuffer(vertexCount, sizeof(float) * 6);
        triangleBuffer = new ComputeBuffer(triangleCount, sizeof(int));

        VertexData[] vertices = new VertexData[vertexCount];
        int[] triangles = new int[triangleCount];

        vertexBuffer.SetData(vertices);
        triangleBuffer.SetData(triangles);

        UpdateMesh();
    }

    void UpdateMesh()
    {
        int kernelHandle = computeShader.FindKernel("CSMain");

        computeShader.SetInt("length", length);
        computeShader.SetInt("width", width);
        computeShader.SetFloat("noiseScale", noiseScale);
        computeShader.SetFloat("heightMultiplier", heightMultiplier);
        computeShader.SetBuffer(kernelHandle, "verticesBuffer", vertexBuffer);
        computeShader.SetBuffer(kernelHandle, "trianglesBuffer", triangleBuffer);

        int dispatchX = Mathf.CeilToInt((float)length / 8.0f);
        int dispatchY = Mathf.CeilToInt((float)width / 8.0f);
        computeShader.Dispatch(kernelHandle, dispatchX, dispatchY, 1);

        VertexData[] vertices = new VertexData[vertexBuffer.count];
        int[] triangles = new int[triangleBuffer.count];

        vertexBuffer.GetData(vertices);
        triangleBuffer.GetData(triangles);

        Vector3[] positions = new Vector3[vertices.Length];
        Vector3[] normals = new Vector3[vertices.Length];

        for (int i = 0; i < vertices.Length; i++)
        {
            positions[i] = vertices[i].position;
            normals[i] = vertices[i].normal;
        }

        mesh.Clear();
        mesh.vertices = positions;
        mesh.triangles = triangles;
        mesh.normals = normals;
    }

    void OnDisable()
    {
        vertexBuffer.Release();
        triangleBuffer.Release();
    }
}