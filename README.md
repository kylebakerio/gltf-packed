# using meshopt with aframe
Here's a demo for using meshopt with aframe!

Component design inspired by this answer: https://stackoverflow.com/questions/65367877/how-do-i-get-a-gltfpack-processed-model-to-appear-in-a-frame

Note that gltfpack is software you install locally. See [here](https://meshoptimizer.org/gltf/) for install instructions

Note that while you can install with npm, you will be missing critical features, so it's worth it installing it "properly".

Use is simple, just include the dependcies:

```html
<!DOCTYPE html>
<html>
  <head>
    <script src="https://aframe.io/releases/1.3.0/aframe.min.js"></script>
    
    <!--   dependencies   -->
    <script src="https://cdn.jsdelivr.net/gh/zeux/meshoptimizer/js/meshopt_decoder.js"></script>
    <script src="https://unpkg.com/three@0.137.0/examples/js/utils/WorkerPool.js"></script>
    <script src="https://unpkg.com/three@0.137.0/examples/js/loaders/KTX2Loader.js"></script> 
    <script src="https://cdn.jsdelivr.net/gh/kylebakerio/gltf-packed/gltf-packed.js"></script>
    
  </head>
  <body>
    <a-scene>      
      <a-assets>
        <!--    asset that was packed with gltfpack, including KTX2 textures, via this command:
                gltfpack -cc -tc -tl 1024  -mm -mi -i big-shell-nofloor-recenter-2.glb -o big-shell-gltfpack-2-2-ktx2-1.glb
        -->
        <a-asset-item id="big-shell-ktx2" src="https://cdn.glitch.global/e61b50a7-4dd5-4681-9de2-1466363354bd/4a49674e-78a0-403e-8f4b-36b5903ffdec.big-shell-gltfpack-2-2-ktx2-1.glb?v=1665874408766"></a-asset-item>
      </a-assets>
      <!--   here we use meshopt-ktx2-draco-gltf-model instead of regular     -->
      <a-entity gltf-packed="#big-shell-ktx2" shadow="cast:true; receive:true;" id="the-shell" scale="1 1 1" position="0 0 0"></a-entity>
    </a-scene>
  </body>
</html>
```
