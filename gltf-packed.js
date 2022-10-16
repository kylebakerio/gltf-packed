/* global AFRAME, THREE, MeshoptDecoder */
/*
  this component assumes you have included the necessary prerequisites
  <script src="https://cdn.jsdelivr.net/gh/zeux/meshoptimizer/js/meshopt_decoder.js"></script>
  <script src="https://unpkg.com/three@0.137.0/examples/js/utils/WorkerPool.js"></script>
  <script src="https://unpkg.com/three@0.137.0/examples/js/loaders/KTX2Loader.js"></script> 
*/

AFRAME.registerComponent("gltf-packed", {
    schema: { type: 'model' },
    init: async function () {
        if (!MeshoptDecoder) {
          throw new Error(`Must include MeshoptDecoder Dependecy! \n <script src="https://cdn.jsdelivr.net/gh/zeux/meshoptimizer/js/meshopt_decoder.js"></script>`)
        }
        if (!THREE.KTX2Loader) {
          throw new Error(`Must include KTX2Loader Dependecy! \n <script src="https://unpkg.com/three@0.137.0/examples/js/utils/WorkerPool.js"></script>
  <script src="https://unpkg.com/three@0.137.0/examples/js/loaders/KTX2Loader.js"></script>`)
        }
        let ktx2resolver;
        console.log('will wait to resolve...', this.data)
        this.waitforktx2 = new Promise(resolve => {ktx2resolver=resolve});
        setTimeout(ktx2resolver, 2000) // awful hack, testing concept
        await this.waitforktx2
        console.log("resolved")


        const renderer = this.el.sceneEl.renderer

        this.loader = new THREE.GLTFLoader()
                      .setCrossOrigin('anonymous')
                      .setKTX2Loader(new THREE.KTX2Loader().setTranscoderPath( 'https://unpkg.com/three@0.137.0/examples/js/libs/basis/' ).detectSupport(renderer))
                      // .setDRACOLoader(new THREE.DRACOLoader().setDecoderPath('./wasm/')) // this line doesn't throw errors, but not sure how to test that it is actually working
                      .setDRACOLoader(new THREE.DRACOLoader().setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.3/')) // again: not tested, could be wrong?
                      .setMeshoptDecoder(MeshoptDecoder)

        this.model = null;
    },
    async update() {
        await this.waitforktx2
        var self = this;
        var el = this.el;
        var src = this.data;

        if (!src) { return; }
        this.remove();
        // Load a glTF resource

        this.loader.load(
            // resource URL
            src,
            // called when the resource is loaded
            function gltfLoaded(gltfModel) {
                self.model = gltfModel.scene || gltfModel.scenes[0];
                self.model.animations = gltfModel.animations;
                // setObject3D is needs an object3D, and the model is a group?
                let rootItem = new THREE.Object3D();
                rootItem.add(self.model)
                el.setObject3D('mesh', rootItem);
                el.emit('model-loaded', { format: 'gltf', model: self.model });
            }, 
            this.progress, // here a function can be specified for catching progress event
            function gltfFailed(error) {
                var message = (error && error.message) ? error.message : 'Failed to load glTF model';
                console.warn(message);
                el.emit('model-error', { format: 'gltf', src: src });
            });
    },
    progress: console.log,
    remove: function () {
        if (!this.model) { return; }
        this.el.removeObject3D('mesh');
    }
});
