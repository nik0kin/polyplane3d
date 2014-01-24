//from http://wiki.unity3d.com/index.php?title=Animating_Tiled_texture

using UnityEngine;
using System.Collections;
 
class AnimateTiledTexture : MonoBehaviour
{
    public int columns = 2;
    public int rows = 2;
    public float framesPerSecond = 10f;
	public int totalFrames = 4;
 
    //the current frame to display
    private int index = 0;
 
    void Start()
    {
        StartCoroutine(updateTiling());
 
        //set the tile size of the texture (in UV units), based on the rows and columns
        Vector2 size = new Vector2(1f / columns, 1f / rows);
        renderer.sharedMaterial.SetTextureScale("_MainTex", size);
    }
 
    private IEnumerator updateTiling()
    {
        while (true)
        {
            //move to the next index
            index++;
            if (index >= rows * columns || index >= totalFrames)
                index = 0;
 			
			//print(index);
            //split into x and y indexes
            Vector2 offset = new Vector2(((float)index / columns - (index / columns)), //x index
                                          (index / columns) / (float)rows);          //y index
			
            renderer.sharedMaterial.SetTextureOffset("_MainTex", offset);
 
            yield return new WaitForSeconds(1f / framesPerSecond);
        }
 
    }
}