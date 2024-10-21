Shader "Custom/TerrainShader"
{
    Properties
    {
        _HeightMultiplier ("Height Multiplier", Range (0, 10)) = 5
    }
    SubShader
    {
        Tags { "RenderType"="Opaque" }
        LOD 200

        Pass
        {
            CGPROGRAM
            #pragma vertex vert
            #pragma fragment frag

            struct appdata
            {
                float4 vertex : POSITION;
                float3 normal : NORMAL;
            };

            struct v2f
            {
                float2 uv : TEXCOORD0;
                float3 normal : TEXCOORD1;
                float4 vertex : SV_POSITION;
            };

            v2f vert (appdata v)
            {
                v2f o;
                o.vertex = UnityObjectToClipPos(v.vertex);
                o.normal = mul((float3x3)UNITY_MATRIX_IT_MV, v.normal);
                return o;
            }

            fixed4 frag (v2f i) : SV_Target
            {
                float3 normal = normalize(i.normal);
                fixed4 color = lerp(fixed4(0.36, 0.25, 0.20, 1.0), fixed4(0.2, 0.8, 0.2, 1.0), normal.y);
                return color;
            }
            ENDCG
        }
    }
}