var SCREEN_WIDTH = 1500;
var SCREEN_HEIGHT = 900;
import path from '@/settings'

var testCss = "\
	.device_pan {\
		box-shadow: 0px 0px 12px rgba(0,255,255,0.5);\
		border: 1px solid rgba(127,255,255,0.25);\
		background: rgba(0,127,127,0.8);\
		font-family: Helvetica, sans-serif;\
		teCxt-align: center;\
		line-height: normal;\
		cursor: pointer;\
		padding: 4px;\
	}\
	.device_pan:hover {\
		box-shadow: 0px 0px 12px rgba(0,255,255,0.75);\
		border: 1px solid rgba(127,255,255,0.75);\
	}\
	.device_pan .title {\
		font-size: 12px;\
		color: rgba(127,255,255,0.75);\
	}\
	.device_pan .name {\
		font-size: 12px;\
		color: rgba(127,255,255,0.75);\
	}\
	.device_pan .value {\
		font-size: 12px;\
		font-weight: bold;\
		color: rgba(255,255,255,0.75);\
		text-shadow: 0 0 10px rgba(0,255,255,0.95);\
	}\
  .device_pan .unit {\
		font-size: 12px;\
		font-weight: bold;\
		color: rgba(255,255,255,0.75);\
		text-shadow: 0 0 10px rgba(0,255,255,0.95);\
	}\
	.tip_pan {\
		font: 15px Microsoft YaHei;\
		color: rgba(0,0,0);\
		text-shadow: 0px 0px 6px #FF0000;\
		cursor: pointer;\
	}\
	.video_pan {\
		background: #000000;\
		width: 1200px;\
        height: 720px;\
	}\
	.video_control {\
        display: block;\
        background-color: black;\
        object-fit: fill;\
        width: 1200px;\
        height: 720px;\
	}\
    .video_wait {\
        height: 320px;\
        width: 320px;\
		position: absolute;\
    }\
";

export default {
  size: { w: SCREEN_WIDTH, h: SCREEN_HEIGHT },
  // background: { url: require('assets/image/images/back.jpg' },
  css: testCss,

  camera: {
    type: 'Perspective',
    viewAngle: 75,
    near: 1,
    far: 20000,
    position: { x: 0, y: 800, z: 1000 },
  },

  controls: [
    {
      type: 'Orbit',
      enabled: true,

      minDistance: 10,
      maxDistance: 20000,

      // minZoom: 1,
      // maxZoom: 1,

      minPolarAngle: -Math.PI / 2,
      maxPolarAngle: Math.PI / 2,

      minAzimuthAngle: -Math.PI,
      maxAzimuthAngle: Math.PI,

      enableDamping: false,
      //dampingFactor: number;

      enableZoom: true,
      //zoomSpeed: number;

      enableRotate: true,
      //rotateSpeed: number;

      enablePan: false,
      //panSpeed: number;

      screenSpacePanning: false,
      //keyPanSpeed: number;
    },
    {
      type: 'Trackball',
      enabled: false,
      rotateSpeed: 5.0,
      zoomSpeed: 5,
      panSpeed: 2,
      staticMoving: true,
    },
    {
      type: 'Map',
      enabled: false,
      enableDamping: true,
      dampingFactor: 0.05,
      screenSpacePanning: true,
    },
    // {
    // 	type: 'Drag',
    // 	enabled: true,
    // },
  ],

  renderer: {
    param: {
      antialias: true,
      alpha: true
    },
    clearColor: 0x00000000,
    clearAlpha: 0,
    passes: [
      {
        type: 'Outline',
        edgeStrength: 5,
        edgeGlow: 1,
        edgeThickness: 2.3,
        pulsePeriod: 3,
        visibleEdgeColor: 0xffffff,
      },
      {
        type: 'Shader',
        shader: THREE.FXAAShader,
        events: {
          create: (o) => {
            o.uniforms['resolution'].value.set(1 / 1500, 1 / 900);
          }
        }
      }
    ],
  },

  materials: {
    wall: [
      { type: 'Phong', param: { color: 0xafc0ca } },
      { type: 'Phong', param: { color: 0x9cb2d1 } },
      { type: 'Phong', param: { color: 0xd6e4ec } },
      { type: 'Phong', param: { color: 0xd6e4ec } },
      { type: 'Phong', param: { color: 0xafc0ca } },
      { type: 'Phong', param: { color: 0xafc0ca } },
    ],
    wall_glass: {
      type: 'Basic', param: { color: 0x58acfa, opacity: 0.4, transparent: true }
    },

    light_shader: {
      type: 'Shader',
      param: {
        uniforms: {
          viewVector: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
          viewRate: { type: "f", value: 2.0 },
        },
        vertexShader: 'uniform vec3 viewVector;' +
          'uniform float viewRate;' +
          'varying float intensity;' +
          'void main() {' +
          'gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4( position, 1.0 );' +
          'vec3 actual_normal = vec3(modelMatrix * vec4(normal, 0.0));' +
          'intensity = pow( dot(normalize(viewVector), actual_normal), viewRate );' +
          '}',
        fragmentShader: 'varying float intensity;' +
          'void main() {' +
          'vec3 glow = vec3(0, 1, 0) * intensity;' +
          'gl_FragColor = vec4( glow, 1.0 );' +
          '}',
        side: THREE.FrontSide,
        blending: THREE.AdditiveBlending,
        transparent: true
      }
    },
  },

  templates: {
    wall: {
      childs: [
        {
          geometry: { type: 'Box', width: 20, height: 200, depth: 1100 },
          subtract: { type: 'Box', width: 20, height: 110, depth: 1100 },
          material: "wall"
        },
        {
          geometry: { type: 'Box', width: 1, height: 110, depth: 1100 },
          material: "wall_glass",
        },
      ]
    },

    fire: {
      userData: {
        deviceState: false,
        outline: true,
        cursor: 'pointer',
        click: true,
      },
      model: {
        type: 'Obj',
        url: './obj/fire/fire.obj',
        mtl: './obj/fire/fire.mtl',
      },
      scale: { x: 0.3, y: 0.3, z: 0.3 },
    },

    dehumidifier: {
      layer: 'device',
      geometry: { type: 'Box', width: 50, height: 120, depth: 30 },
      material: [
        { type: 'Phong', param: { color: 0x8B8D8C } },
        { type: 'Phong', param: { color: 0x8B8D8C } },
        { type: 'Phong', param: { color: 0x8B8D8C } },
        { type: 'Phong', texture: { url: require('assets/image/images/arrow.png'), repeat: { x: 3, y: 1 } }, param: { transparent: true } },
        { type: 'Phong', texture: { url: require('assets/image/images/dehumidifier.png') }, param: {} },
        { type: 'Phong', param: { color: 0x8B8D8C } },
      ],
      userData: {
        deviceState: false,
        outline: true,
        cursor: 'pointer',
        click: true,
      },
      attach: {
        get deviceState () {
          if (this.userData) {
            return this.userData.deviceState;
          }
          return false
        },
        set deviceState (v) {
          this.userData.deviceState = v;
          if (v) {
            this.material[2] = this.material[3];
            if (!this.tween) {
              this.tween = new T3Tween({ x: 0 }, { x: 1 }, 1000, (o) => {
                this.material[2].map.offset.x = o.x;
              });
            }
            this.tween.start();
          }
          else if (this.tween) {
            this.tween.stop();
            this.material[2] = this.material[0];
          }
        },
      },
    },

    airconditioner: {
      layer: 'device',
      geometry: { type: 'Box', width: 150, height: 40, depth: 30 },
      material: [
        { type: 'Phong', param: { color: 0x8B8D8C } },
        { type: 'Phong', param: { color: 0x8B8D8C } },
        { type: 'Phong', param: { color: 0x8B8D8C } },
        { type: 'Phong', param: { color: 0x8B8D8C } },
        { type: 'Phong', texture: { url: require('assets/image/images/air-indoor.png') }, param: {} },
        { type: 'Phong', param: { color: 0x8B8D8C } },
        { type: 'Phong', texture: { url: require('assets/image/images/arrow.png'), repeat: { x: 6, y: 1 } }, param: { transparent: true } },
      ],
      userData: {
        deviceState: false,
        outline: true,
        cursor: 'pointer',
        click: true,
      },
      attach: {
        get deviceState () {
          if (this.userData) {
            return this.userData.deviceState;
          }
          return false
        },
        set deviceState (v) {
          this.userData.deviceState = v;
          if (v) {
            this.material[2] = this.material[6];
            if (!this.tween) {
              this.tween = new T3Tween({ x: 0 }, { x: 1 }, 1000, (o) => {
                this.material[2].map.offset.x = o.x;
              });
            }
            this.tween.start();
          }
          else if (this.tween) {
            this.tween.stop();
            this.material[2] = this.material[0];
          }
        },
      },
    },

    fan: {
      layer: 'device',
      childs: [
        {
          model: {
            type: 'Stl',
            url: './obj/fan/fan.stl',
            material: { type: 'Phong', param: { color: 0xff5533, specular: 0x111111, shininess: 200 } },
            position: { x: 0, y: 37, z: 0 },
            rotation: { x: 0.5, y: 0, z: 0 },
            scale: { x: 6, y: 6, z: 6 },
          },
          attach: {
            castShadow: true,
            receiveShadow: true,
          },
          userData: {
            outline: true,
            cursor: 'pointer',
          },
        },
        {
          geometry: [
            { type: 'Box', width: 67, height: 3, depth: 18 },
            { type: 'Box', width: 3, height: 64, depth: 18, position: { x: -32, y: -32, z: 0 } },
            { type: 'Box', width: 3, height: 64, depth: 18, position: { x: 32, y: -32, z: 0 } },
          ],
          material: { type: 'Phong', param: { color: 0x586C5A } },
          position: { x: 0, y: 32, z: 0 },
        },
      ],
      attach: {
        get deviceState () {
          if (this.userData) {
            return this.userData.deviceState;
          }
          return false
        },
        set deviceState (v) {
          this.userData.deviceState = v;
          if (v) {
            if (!this.tween) {
              this.tween = new T3Tween({ z: 0 }, { z: 2 }, 2000, (o) => {
                this.children[0].rotation.z = o.z * Math.PI;
              });
            }
            this.tween.start();
          }
          else if (this.tween) {
            this.tween.stop();
          }
        },
      },
      userData: {
        deviceState: false,
        click: true,
        cursor: 'pointer',
      },
    },

    door: {
      layer: 'device',
      geometry: { type: 'Box', width: 100, height: 180, depth: 5, position: { x: -50, y: 0, z: 0 } },
      material: { type: 'Basic', texture: { url: require('assets/image/images/door_right.png') }, param: { color: 0x7f7f7f, opacity: 0.9, transparent: true } },
      userData: {
        deviceState: false,
        outline: true,
        click: true,
        cursor: 'pointer',
      },

      attach: {
        get deviceState () {
          if (this.userData) {
            return this.userData.deviceState;
          }
          return false
        },
        set deviceState (v) {
          this.userData.deviceState = v;
          this.rotation.y = (v ? -0.3 : 0) * Math.PI;
        },
      }
    },

    label: {
      material: {
        type: 'Phong',
        texture: {
          color: 0x9cb2d1,
          text: {
            value: '',
            size: { w: 512, h: 64 },
            font: 'normal 36px Microsoft YaHei',
            color: '#ffff00',
            backColor: '#808080',
          }
        },
        paramn: { transparent: true },
      },

      attach: {
        get text () {
          if (this.material && this.material.map)
            return this.material.map.text.text;
          return "";
        },
        set text (v) {
          this.material.map.text.text = v;
        },
      },
    },

    tip: {
      tagName: 'div',
      className: 'tip_pan',
      is2D: true,
      isSprite: true,
    },

    light: {
      layer: 'device',
      model: {
        type: 'Stl',
        url: './obj/light/light.stl',
        material: { type: 'Phong', param: { color: 0x808D8C } },
        scale: { x: 2, y: 2, z: 2 },
      },

      userData: {
        deviceState: false,
        outline: true,
        click: true,
        cursor: 'pointer',
      },

      attach: {
        get deviceState () {
          if (this.userData) {
            return this.userData.deviceState;
          }
          return false
        },
        set deviceState (v) {
          this.userData.deviceState = v;
          this.children[0].material.color.set(v ? 0xC0C040 : 0x606D6C);

          if (v) {
            if (!this.light) {
              this.light = new THREE.PointLight(0xF0F010, 0.5, 80);
              this.light.position.copy(this.position);
              this.light.position.x -= this.light.position.x > 0 ? 60 : -60;
              this.light.castShadow = true;
              t3.scene.add(this.light);
            }
          }
          else {
            if (this.light) {
              t3.scene.remove(this.light);
              this.light = null;
            }
          }
        },
      },
    },

    light2: {
      layer: 'device',
      userData: {
        outline: true,
        click: true,
        cursor: 'pointer',
      },
      attach: {
        get deviceState () {
          if (this.userData) {
            return this.userData.deviceState;
          }
          return false
        },
        set deviceState (v) {
          var that = this;

          that.userData.deviceState = v;
          that.children[0].material.color.set(v ? 0xC0C040 : 0x808D8C);
          that.children[1].display = v;

          if (v) {
            if (!that.tween) {
              that.tween = new T3Tween({ r: 0.7, g: 0.7, b: 0.7, rate: 4 }, { r: 0.8, g: 0.8, b: 0.2, rate: 3 }, 2000, (o) => {
                that.children[1].material.uniforms.viewRate.value = o.rate;
                //this.children[0].material.color.setRGB(o.r, o.g, o.b);
              });
            }
            that.tween.start();
          }
          else if (this.tween) {
            that.tween.stop();
          }
        },
      },
      childs: [
        {
          geometry: [
            { type: 'Cylinder', radiusTop: 10, radiusBottom: 10, height: 10, radiusSegments: 6, heightSegments: 1, position: { x: 0, y: -40, z: 0 } },
            { type: 'Sphere', radius: 20, segmentsWidth: 12, segmentsHeight: 12, scale: { x: 1, y: 2, z: 1 } },
          ],
          material: { type: 'Phong', param: { color: 0x808D8C } },
        },
        {
          display: false,
          geometry: { type: 'Sphere', radius: 40, segmentsWidth: 16, segmentsHeight: 16, scale: { x: 1, y: 1.25, z: 1 } },
          position: { x: 0, y: 10, z: 0 },
          material: "light_shader",
          events: {
            update: (o, p) => {
              let viewVector = new THREE.Vector3().subVectors(p.camera.position, o.getWorldPosition(new THREE.Vector3()));
              o.material.uniforms.viewVector.value = viewVector;
            }
          }
        },
      ],
    },

    light3: {
      layer: 'device',
      childs: [
        {
          geometry: { type: 'Cylinder', radiusTop: 6, radiusBottom: 6, height: 120, radiusSegments: 16, heightSegments: 1 },
          material: { type: 'Phong', param: { color: 0x909D9C } },
        },
        {
          display: false,
          geometry: { type: 'Cylinder', radiusTop: 10, radiusBottom: 10, height: 120, radiusSegments: 16, heightSegments: 1 },
          material: "light_shader",
          events: {
            update: (o, p) => {
              let viewVector = new THREE.Vector3().subVectors(p.camera.position, o.getWorldPosition(new THREE.Vector3()));
              o.material.uniforms.viewVector.value = viewVector;
            }
          }
        },
        {
          geometry: [
            { type: 'Box', width: 19, height: 128, depth: 1, position: { x: 0, y: 0, z: -9 } },
            { type: 'Box', width: 1, height: 128, depth: 18, position: { x: -9, y: 0, z: 0 } },
          ],
          material: { type: 'Phong', param: { color: 0x607080 } },
        },
      ],
      attach: {
        get deviceState () {
          if (this.userData) {
            return this.userData.deviceState;
          }
          return false
        },
        set deviceState (v) {
          this.userData.deviceState = v;
          this.children[0].material.color.set(v ? 0xD0D040 : 0x909D9C);
          this.children[1].material.uniforms.viewRate.value = 8;
          this.children[1].display = v;
        },
      },
      userData: {
        outline: true,
        click: true,
        cursor: 'pointer',
      },
    },

    alarm: {
      layer: 'device',
      childs: [
        {
          geometry: [
            { type: 'Sphere', radius: 16, segmentsWidth: 16, segmentsHeight: 16, scale: { x: 1, y: 1.25, z: 1 }, position: { x: 0, y: 8, z: 0 }, },
          ],
          scale: { x: 1, y: 0.4, z: 1 },
          material: { type: 'Phong', param: { color: 0x102010 } },
        },
        {
          geometry: [
            { type: 'Cylinder', radiusTop: 16, radiusBottom: 16, height: 16, radiusSegments: 16, heightSegments: 1 },
          ],
          scale: { x: 1, y: 0.4, z: 1 },
          material: { type: 'Phong', param: { color: 0xD0E0F0 } },
        },
      ],

      userData: {
        outline: true,
        cursor: 'pointer',
      },
      attach: {
        get deviceState () {
          if (this.userData) {
            return this.userData.deviceState;
          }
          return false
        },
        set deviceState (v) {
          var that = this;
          that.userData.deviceState = v;
          if (v) {
            if (!that.tween) {
              that.tween = new T3Tween({ r: 0.1, g: 0.1, b: 0.1 }, { r: [1, 1, 0.1, 0.1], g: [0.1, 1, 1, 0.1], b: 0.1 }, 1000, (o) => {
                this.children[0].material.color.setRGB(o.r, o.g, o.b);
              });
            }
            that.tween.start();
          }
          else if (that.tween) {
            that.tween.stop();
            that.children[0].material.color.set(this.listener.childs[0].material.param.color);
          }
        },
      },
    },

    water: {
      layer: 'device',
      childs: [
        {
          display: false,
          geometry: { type: 'Box', width: 96, height: 8, depth: 36 },
          water: {
            color: '#afafff',
            scale: 0.1,
            flowDirection: new THREE.Vector2(1, 1),
            normalMap0: { url: require('assets/image/images/water/Water_1_M_Normal.jpg') },
            normalMap1: { url: require('assets/image/images/water/Water_2_M_Normal.jpg') },
          },
        },
        {
          geometry: { type: 'Box', width: 100, height: 10, depth: 40 },
          subtract: { type: 'Box', width: 96, height: 10, depth: 36 },
          material: { type: 'Phong', param: { color: 0x707D7C } },
        },
      ],
      userData: {
        outline: true,
        cursor: 'pointer',
      },
      attach: {
        get deviceState () {
          if (this.userData) {
            return this.userData.deviceState;
          }
          return false
        },
        set deviceState (v) {
          this.userData.deviceState = v;
          this.children[0].display = v;
        },
      },
    },

    // water: {
    // 	childs: [
    // 		{
    // 			water: {
    // 				color: '#cfcfff',
    // 				scale: 0.002,
    // 				flowDirection: new THREE.Vector2( 1, 1 ),
    // 				textureWidth: 1024,
    // 				textureHeight: 1024,
    // 				normalMap0: {url: require('assets/image/images/water/Water_1_M_Normal.jpg')},
    // 				normalMap1: {url: require('assets/image/images/water/Water_2_M_Normal.jpg')},
    // 			},
    // 			position: {x: 0, y: 2, z: 0},
    // 			rotation: {x: -0.5, y: 0, z: 0.5},
    // 		},
    // 		{
    // 			material: {type: 'Phong', param: {color: 0x0, opacity: 0.3, transparent: true}},
    // 			position: {x: 0, y: 1, z: 0},
    // 			rotation: {x: -0.5, y: 0, z: 0.5},
    // 		},
    // 	],
    // 	events: {
    // 		init: function() {
    // 			var geometry = { type: 'Shape', path: [] };
    // 			const segment = 30;
    // 			for (var i = 0; i < segment; i++) {
    // 				var a = 2 * Math.PI * i / segment;
    // 				var x = Math.cos(a) * 100 + (40 * (Math.random() - 0.5));
    // 				var y = Math.sin(a) * 100 + (40 * (Math.random() - 0.5));
    // 				geometry.path.push({type: i ? 'line' : 'move', x: x, y: y});
    // 			}
    // 			this.childs[0].geometry = geometry;
    // 			this.childs[1].geometry = geometry;
    // 		},
    // 	},
    // 	userData: {
    // 		outline: true,
    // 		cursor: 'pointer',
    // 	},
    // },

    videoPlane: {
      childs: [
        {
          tagName: 'video',
          display: false,
          attributes: { hide: true, }
        },
        {
          geometry: { type: 'Plane', width: 900, height: 600 },
          material: { type: 'Phong', texture: { url: require('assets/image/images/novideo.png') }, param: { transparent: true, side: THREE.DoubleSide } },
        },
      ],
      events: {
        click: (o) => {
          o.close();
          o.display = false;
        },
      },
      attach: {
        open (id, flag) {
          var that = this;

          that.close();
          var video = that.children[0].element;
          that.mp = new MPlayer(video);
          that.mp.open("127.0.0.1", 8087, id, flag);
          that.mp.onstatechanged = (state) => {
            if (that.mp) {
              if (state) {
                that.children[1].material.map = that.player.loadTexture({ video: video });
                if (that.tween) {
                  that.tween.stop();
                }
              }
              else {
                var texture = _t3loader.loadTexture(require('assets/image/images/wait.png'), () => {
                  if (!that.tween) {
                    that.tween = new T3Tween({ r: 0 }, { r: 2 }, 4000, (o) => {
                      that.children[1].material.map.rotation = o.r * Math.PI;
                    });
                  }
                  that.tween.start();
                });
                texture.center.set(0.5, 0.5);
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                that.children[1].material.map = texture;
              }
            }
          };
          that.mp.onstatechanged(false);
        },
        close () {
          if (this.mp) {
            this.mp.close();
            this.mp = null;

            if (this.tween) {
              this.tween.stop();
            }
            this.children[1].material.map = _t3loader.loadTexture(require('assets/image/images/novideo.png'));
          }
        },
      },
    },

    videoCss: {
      tagName: 'div',
      className: 'video_pan',
      isSprite: true,
      innerHTML: "<video autoplay muted class='video_control'></video><img class='video_wait' src=require('assets/image/images/wait.png') />",
      events: {
        click: (o) => {
          o.close();
          o.display = false;
        },
      },
      attach: {
        open (id, flag) {
          var that = this;
          that.close();

          var e = that.element;

          that.mp = new MPlayer(e.firstChild);
          that.mp.open(path.streamIp, path.streamPort, id, flag);
          that.mp.onstatechanged = (state) => {
            if (that.mp) {
              var wait = e.lastChild;
              if (state) {
                wait.style.display = 'none';
                if (that.tween) {
                  that.tween.stop();
                }
              }
              else {
                wait.style.top = ((e.offsetHeight - wait.offsetHeight) / 2) + "px";
                wait.style.left = ((e.offsetWidth - wait.offsetWidth) / 2) + "px";
                wait.style.display = 'block';

                if (!that.tween) {
                  that.tween = new T3Tween({ r: 0 }, { r: 360 }, 4000, (o) => {
                    wait.style.transform = 'rotate(' + o.r + 'deg)';
                  });
                }
                that.tween.start();
              }
            }
          };
          that.mp.onstatechanged(false);
        },
        close () {
          if (this.mp) {
            this.mp.close();
            this.mp = null;

            if (this.tween) {
              this.tween.stop();
            }
          }
        },
      },
    },

    cameraPlane: {
      layer: 'device',
      childs: [
        {
          model: {
            type: 'Obj',
            mtl: './obj/camera/camera.mtl',
          },
          scale: { x: 0.05, y: 0.05, z: 0.05 },
        },
        {
          template: "videoPlane",
          scale: { x: 0.5, y: 0.5, z: 1 },
          display: false,
          position: { x: 0, y: 210, z: 0 },
          rotation: { x: 0, y: 0, z: 0 },
        },
      ],
      events: {
        init: function () {
          this.childs[0].model.url = this.modelUrl;
          if (this.rotation)
            this.childs[1].rotation.y = -this.rotation.y;
        },
        click: (o, p) => {
          o.children[1].display = true;
          o.children[1].open(o.listener.tag.id, 0);
        }
      },
      userData: {
        outline: true,
        click: true,
        cursor: 'pointer',
      },
    },

    cameraPlaneLeft: {
      template: "cameraPlane",
      modelUrl: './obj/camera/camera_left.obj',
    },

    cameraPlaneRight: {
      template: "cameraPlane",
      modelUrl: './obj/camera/camera_right.obj',
    },

    cameraCss: {
      layer: 'device',
      childs: [
        {
          model: {
            type: 'Obj',
            mtl: './obj/camera/camera.mtl',
          },
          scale: { x: 0.05, y: 0.05, z: 0.05 },
        },
        {
          template: "videoCss",
          scale: { x: 0.5, y: 0.5, z: 1 },
          display: false,
          position: { x: 0, y: 210, z: 0 },
          rotation: { x: 0, y: 0, z: 0 },
        },
      ],
      events: {
        init: function () {
          this.childs[0].model.url = this.modelUrl;
          if (this.rotation)
            this.childs[1].rotation.y = -this.rotation.y;
        },
        click: (o, p) => {
          o.children[1].display = true;
          o.children[1].open(o.listener.tag.id, 0);
        }
      },
      userData: {
        outline: true,
        click: true,
        cursor: 'pointer',
      },
      type: "camera"
    },
    cameraCssLeft: {
      template: "cameraCss",
      modelUrl: './obj/camera/camera_left.obj',
    },

    cameraCssRight: {
      template: "cameraCss",
      modelUrl: './obj/camera/camera_right.obj',
    },

    cameraBox: {
      layer: 'device',
      model: {
        type: 'Obj',
        mtl: './obj/camera/camera.mtl',
      },
      scale: { x: 0.05, y: 0.05, z: 0.05 },
      events: {
        init: function () {
          this.model.url = this.modelUrl;
        },
      },
      userData: {
        outline: true,
        click: true,
        cursor: 'pointer',
      },
      type: "camera"
    },
    cameraBoxLeft: {
      template: "cameraBox",
      modelUrl: './obj/camera/camera_left.obj',
    },
    cameraBoxRight: {
      template: "cameraBox",
      modelUrl: './obj/camera/camera_right.obj',
    },

    cameraDome: {
      layer: 'device',
      childs: [
        {
          geometry: { type: 'Sphere', radius: 20, segmentsWidth: 16, segmentsHeight: 16 },
          //subtract: {type: 'Box', width: 40, height: 20, depth: 40, position: {x: 0, y: 10, z:0}},
          material: { type: 'Phong', param: { color: 0x000000, transparent: true, opacity: 0.5 } },
        },
        {
          geometry: { type: 'Cylinder', radiusTop: 15, radiusBottom: 8, height: 10, radiusSegments: 12, heightSegments: 1 },
          material: { type: 'Phong', param: { color: 0x000000, specular: 0x111111, shininess: 100 } },
          position: { x: 0, y: -5, z: 0 },
        },
        {
          geometry: [
            { type: 'Cylinder', radiusTop: 20, radiusBottom: 22, height: 4, radiusSegments: 16, heightSegments: 1, position: { x: 0, y: 8, z: 0 } },
            { type: 'Cylinder', radiusTop: 22, radiusBottom: 22, height: 12, radiusSegments: 16, heightSegments: 1 },
            { type: 'Cylinder', radiusTop: 22, radiusBottom: 20, height: 4, radiusSegments: 16, heightSegments: 1, position: { x: 0, y: -8, z: 0 } },
          ],
          material: { type: 'Phong', param: { color: 0x9cb2d1, specular: 0x111111, shininess: 100 } },
          position: { x: 0, y: 10, z: 0 },
        },

        {
          geometry: [
            { type: 'Cylinder', radiusTop: 2, radiusBottom: 2, height: 12, radiusSegments: 8, heightSegments: 1 },
            { type: 'Cylinder', radiusTop: 2, radiusBottom: 2, height: 50, radiusSegments: 8, heightSegments: 1, position: { x: 4, y: 25, z: 0 }, rotation: { x: 0, y: 0, z: 0.5 } },
          ],
          material: { type: 'Phong', param: { color: 0xcfdfbf, specular: 0x111111, shininess: 200 } },
          position: { x: 0, y: 25, z: 0 },
        },
        {
          geometry: { type: 'Box', width: 2, height: 30, depth: 15 },
          material: { type: 'Phong', param: { color: 0x000000, specular: 0x111111, shininess: 100 } },
          position: { x: -50, y: 30, z: 0 },
        },
      ],
      userData: {
        outline: true,
        click: true,
        cursor: 'pointer',
      },
      type: "camera"
    },

    cameraDomeCss: {
      childs: [
        {
          template: "cameraDome",
        },
        {
          template: "videoCss",
          scale: { x: 0.5, y: 0.5, z: 1 },
          display: false,
          position: { x: 0, y: 210, z: 0 },
          rotation: { x: 0, y: 0, z: 0 },
        },
      ],
      events: {
        click: (o, p) => {
          o.children[1].display = true;
          o.children[1].open(o.listener.tag.id, 0);
        }
      },
      userData: {
        outline: true,
        click: true,
        cursor: 'pointer',
      },
    },

    device: {
      layer: 'device',
      childs: [
        {
          model: {
            type: 'Stl',
            url: './obj/device/device.stl',
            material: { type: 'Phong', param: { color: 0x808D8C } },
            scale: { x: 8, y: 8, z: 8 },
          },
        },
        {
          geometry: { type: 'Box', width: 22, height: 22, depth: 2 },
          material: [
            { type: 'Basic', param: { color: 0x8B8D8C } },
            { type: 'Basic', param: { color: 0x8B8D8C } },
            { type: 'Basic', param: { color: 0x8B8D8C } },
            { type: 'Basic', param: { color: 0x8B8D8C } },
            { type: 'Basic', param: { color: 0x8B8D8C } },
            { type: 'Basic', param: { color: 0x8B8D8C } },
          ],
          position: { x: 0, y: 0, z: 17 },
        },
        {
          tagName: 'div',
          isSprite: true,
          className: 'device_pan',
          position: { x: 0, y: 40, z: 0 },
          display: false,
        },
      ],
      events: {
        create: (o, p) => {
          o.children[1].material[4] = p.loadMaterial({ type: 'Phong', texture: { url: o.listener.ico, repeat: { x: 1, y: 1 } }, param: { transparent: true } });
          o.children[2].element.innerHTML = o.listener.html;
        },

        click: function (o, p) {
          o.children[2].display = !o.children[2].display;
          o.tip.display = !o.children[2].display;
        }
      },
      userData: {
        outline: true,
        click: true,
        cursor: 'pointer',
      },
    },

    deviceSprite: {
      layer: 'device',
      childs: [
        {
          sprite: {
            image: require('assets/image/images/ico.png'),
            width: 60,
            height: 75,
          },
          scale: { x: 0.5, y: 0.5, z: 0.5 },
        },
        {
          tagName: 'div',
          isSprite: true,
          className: 'device_pan',
          display: false,
        },
      ],
      events: {
        create: (o, p) => {
          o.children[0].sprite.material.map = p.loadTexture({ url: o.listener.ico, repeat: { x: 1, y: 1 } });
          o.children[1].element.innerHTML = o.listener.html;
        },

        click: function (o, p) {
          o.children[1].display = !o.children[1].display;
          o.tip.display = !o.children[1].display;
          o.children[0].display = !o.children[1].display;
        }
      },
      userData: {
        outline: true,
        click: true,
        cursor: 'pointer',
      },
      type: "device"
    },

    temphumi: {
      template: "deviceSprite",
      ico: require('assets/image/images/温湿度.png'),
      tip: { template: "tip", },
      events: {
        init: function () {
          this.html = `<table><tr><td rowspan=3 valign='top'><img src='${this.ico}' width=30 height=36 /></td>` +
            `<td class=title id='${this.tag.id}' colspan=2>${this.name}</td></tr>` +
            `<tr><td class=name>温度</td><td class=value id='${this.temp.id}'>${this.temp.value}</td><td class=unit>°</td></tr>` +
            `<tr><td class=name>湿度</td><td class=value id='${this.humi.id}'>${this.humi.value}</td><td class=unit>%</td></tr></table>`;
          this.tip.innerHTML = `${this.name}`;
        },
      },
    },

    cabinet: {
      geometry: { type: 'Box', width: 400, height: 200, depth: 100, position: { x: 0, y: 100, z: 0 } },
      material: [{ type: 'Phong', param: { color: 0x8B8D8C } },
      { type: 'Phong', param: { color: 0x8B8D8C } },
      { type: 'Phong', param: { color: 0x8B8D8C } },
      { type: 'Phong', param: { color: 0x8B8D8C } },
      { type: 'Phong', texture: { url: require('assets/image/images/gz4.png') }, param: {} },
      { type: 'Phong', param: { color: 0x8B8D8C } },]
    },
  },

  lights: [
    { type: 'Directional', color: 0xffffff, intensity: 0.5, position: { x: 0, y: 200, z: 0 }, },
    { type: 'Ambient', color: 0xffffff, intensity: 1, position: { x: 0, y: 0, z: 0 }, },
  ],

  objects: [
    {
      name: 'floor',
      geometry: { type: 'Box', width: 1600, height: 1100, depth: 1, position: { x: 0, y: -0.0, z: 0 }, rotation: { x: 0.5, y: 0, z: 0 } },
      material: { type: 'Basic', texture: { url: require('assets/image/images/floor.jpg'), repeat: { x: 10, y: 10 } }, param: { side: THREE.DoubleSide } },
      attach: {
        receiveShadow: true,
      },
    },
    {
      name: 'left_wall',
      template: "wall",
      position: { x: -810, y: 100, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
    },
    {
      name: 'right_wall',
      template: "wall",
      position: { x: 810, y: 100, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
    },
    {
      name: 'wall1',
      geometry: { type: 'Box', width: 10, height: 200, depth: 900, position: { x: -651, y: 100, z: 0 }, rotation: { x: 0, y: 0, z: 0 } },
      material: "wall"
    },
    {
      name: 'wall2',
      geometry: { type: 'Box', width: 10, height: 200, depth: 900, position: { x: -651, y: 100, z: 0 }, rotation: { x: 0, y: 1, z: 0 } },
      material: "wall"
    },
    {
      name: 'wall3',
      geometry: { type: 'Box', width: 1312, height: 200, depth: 10, position: { x: 0, y: 100, z: -455 } },
      material: "wall"
    },
    {
      name: 'wall4',
      geometry: { type: 'Box', width: 1312, height: 200, depth: 10, position: { x: 0, y: 100, z: 455 } },
      subtract: [
        { type: 'Box', width: 100, height: 180, depth: 10, position: { x: 0, y: 90, z: 455 } },
        { type: 'Box', width: 64, height: 64, depth: 10, position: { x: 450, y: 32, z: 455 } },
        { type: 'Box', width: 64, height: 64, depth: 10, position: { x: -450, y: 32, z: 455 } },
      ],
      material: [
        { type: 'Phong', param: { color: 0x9cb2d1 } },
        { type: 'Phong', param: { color: 0x9cb2d1 } },
        { type: 'Phong', param: { color: 0xd6e4ec } },
        { type: 'Phong', param: { color: 0xd6e4ec } },
        { type: 'Phong', param: { color: 0x9cb2d1 } },
        { type: 'Phong', param: { color: 0xafc0ca } },
      ],
    },

    {
      template: "cabinet",
      position: { x: -250, y: 0, z: -200 }
    },
    {
      template: "cabinet",
      position: { x: 250, y: 0, z: -200 }
    },
    {
      template: "cabinet",
      position: { x: -250, y: 0, z: 200 }
    },
    {
      template: "cabinet",
      position: { x: 250, y: 0, z: 200 }
    },

    {
      name: "title",
      childs: [
        {
          tag: {
            id: 21,
          },
          sprite: {
            text: {
              value: '智能配电房',
              size: { w: 512, h: 64 },
              font: 'normal 48px Microsoft YaHei',
              color: '#00ffff',
              backColor: '#808080C0',
            },
            param: { side: THREE.DoubleSide },
          },
          position: { x: 0, y: 280, z: -400 },
        },
      ]
    },


    {
      name: "time",
      childs: [
        {
          geometry: { type: 'Plane', width: 14, height: 14, depth: 2 },
          material: { type: 'Phong', texture: { url: require('assets/image/images/ico.png'), repeat: { x: 1, y: 1 } }, param: { side: THREE.DoubleSide, transparent: true } },
          position: { x: -50, y: 0, z: 1 },
        },
        {
          tag: { id: 'time1', },
          template: "label",
          geometry: { type: 'Plane', width: 128, height: 16, depth: 1 },
        },
      ],
      position: { x: -500, y: 160, z: 461 },
    },

    {
      name: 'camera1',
      template: "cameraBoxLeft",
      position: { x: -605, y: 150, z: 400 },
      rotation: { x: 0, y: 0, z: 0 },
      tag: { id: 385, },
      tip: { template: "tip", innerHTML: "1#摄像机", },
    },

    {
      name: 'camera2',
      template: "cameraBoxRight",
      position: { x: 605, y: 150, z: 400 },
      rotation: { x: 0, y: 1, z: 0 },
      tag: { id: 405, },
      tip: { template: "tip", innerHTML: "2#摄像机", }
    },

    {
      name: 'camera3',
      template: "cameraBoxLeft",
      position: { x: 605, y: 150, z: -400 },
      rotation: { x: 0, y: 1, z: 0 },
      tag: { id: 406, },
      tip: { template: "tip", innerHTML: "3#摄像机", },
    },
    // {
    //   name: 'camera4',
    //   template: "cameraCssRight",
    //   position: { x: -605, y: 150, z: -400 },
    //   rotation: { x: 0, y: 0, z: 0 },
    //   tag: { id: 407, },
    //   tip: { template: "tip", innerHTML: "4#摄像机", }
    // },

    {
      name: 'camera5',
      template: "cameraDome",
      position: { x: -595, y: 150, z: 0 },
      tag: { id: 407, },
      tip: { template: "tip", innerHTML: "4#摄像机", }
    },

    // {
    //   name: 'camera6',
    //   template: "cameraDome",
    //   position: { x: 200, y: 150, z: 400 },
    //   rotation: { x: 0, y: 0.5, z: 0 },
    //   tag: { id: 7, },
    //   tip: { template: "tip", innerHTML: "摄像机6", }
    // },

    // {
    //   name: 'camera7',
    //   template: "cameraDome",
    //   position: { x: -200, y: 150, z: -400 },
    //   rotation: { x: 0, y: -0.5, z: 0 },
    //   tag: { id: 8, },
    //   tip: { template: "tip", innerHTML: "摄像机7", }
    // },

    // {
    //   name: 'camera8',
    //   template: "cameraDome",
    //   position: { x: 595, y: 150, z: -200 },
    //   rotation: { x: 0, y: 1, z: 0 },
    //   tag: { id: 9, },
    //   tip: { template: "tip", innerHTML: "摄像机8", }
    // },

    {
      name: 'fire1',
      template: "fire",
      position: { x: -620, y: 0, z: -420 },
      rotation: { x: 0, y: 0, z: 0 },
    },

    {
      name: 'door1',
      template: "door",
      position: { x: 50, y: 90, z: 451 },
      rotation: { x: 0, y: 0, z: 0 },
      tag: { id: 403, },
      tip: { template: "tip", innerHTML: "门禁", }
    },
    {
      name: 'dehumidifier1',
      template: "dehumidifier",
      position: { x: 630, y: 60, z: 0 },
      rotation: { x: 0, y: -0.5, z: 0 },
      tag: { id: 71, },
      tip: { template: "tip", innerHTML: "除湿机1", }
    },
    {
      name: 'airconditioner1',
      template: "airconditioner",
      position: { x: 420, y: 160, z: -435 },
      rotation: { x: 0, y: 0, z: 0 },
      tag: { id: 404, },
      tip: { template: "tip", innerHTML: "空调1", }
    },

    {
      name: 'fan1',
      template: "fan",
      position: { x: 450, y: 32, z: 455 },
      tag: { id: 390, },
      tip: { template: "tip", innerHTML: "风机1", }
    },

    {
      name: 'fan2',
      template: "fan",
      position: { x: -450, y: 32, z: 455 },
      tag: { id: 391, },
      tip: { template: "tip", innerHTML: "风机2", }
    },

    {
      name: 'light1',
      template: "light3",
      tag: { id: 392, },
      position: { x: 0, y: 180, z: -440 },
      rotation: { x: 0.5, y: 0, z: 0.5 },
      tip: { template: "tip", innerHTML: "灯光", }
    },

    {
      name: '温湿度2',
      template: "temphumi",
      position: { x: -400, y: 218, z: 200 },
      tag: { id: 386, },
      temp: { id: 2535, value: '0' },
      humi: { id: 2536, value: '0' },
    },

    {
      name: '温湿度4',
      template: "temphumi",
      position: { x: 400, y: 218, z: 200 },
      tag: { id: 387, },
      temp: { id: 2538, value: '0' },
      humi: { id: 2539, value: '0' },
    },

    {
      name: '温湿度1',
      template: "temphumi",
      position: { x: -400, y: 218, z: -200 },
      tag: { id: 388, },
      temp: { id: 301, value: '0' },
      humi: { id: 302, value: '0' },
    },

    {
      template: "alarm",
      position: { x: 640, y: 180, z: 0 },
      rotation: { x: 0, y: 0, z: 0.5 },
      tag: { id: 393, },
    },

    {
      name: '水浸1',
      template: "water",
      position: { x: 625, y: 5, z: 200 },
      rotation: { x: 0, y: -0.5, z: 0 },
      tag: { id: 408, },

    },

    // {
    // 	childs: [
    // 		{
    // 			geometry: {type: 'Sphere', radius: 20, segmentsWidth: 16, segmentsHeight: 16},
    // 			subtract: {type: 'Box', width: 40, height: 20, depth: 40, position: {x: 0, y: 10, z:0}},
    // 			material: {type: 'Basic', param: {color: 0x000000, opacity: 0.4, transparent: true }},
    // 		},

    // 		{
    // 			geometry: [
    // 				{type: 'Sphere', radius: 24, segmentsWidth: 16, segmentsHeight: 16},
    // 				{type: 'Sphere', radius: 10, segmentsWidth: 16, segmentsHeight: 16, position: {x: 0, y: 37, z:0}, scale: {x: 1.5, y: 0.5, z: 1.5}}
    // 			],
    // 			subtract: {type: 'Box', width: 48, height: 24, depth: 48, position: {x: 0, y: -12, z:0}},
    // 			material: {type: 'Phong', param: {color: 0xa0a0c0, specular: 0x111111, shininess: 200}},
    // 		},

    // 		{
    // 			geometry: {type: 'Cylinder', radiusTop: 20, radiusBottom: 1, height: 15, radiusSegments: 12, heightSegments: 1},
    // 			material: {type: 'Phong', param: {color: 0xFFFFFF, specular: 0x111111, shininess: 100} },
    // 			position: {x: 0, y: -5, z: 0},
    // 		},
    // 		// {
    // 		// 	geometry: [
    // 		// 		{type: 'Cylinder', radiusTop: 20, radiusBottom: 22, height: 4, radiusSegments: 16, heightSegments: 1, position: {x: 0, y: 8, z: 0}},
    // 		// 		{type: 'Cylinder', radiusTop: 22, radiusBottom: 22, height: 12, radiusSegments: 16, heightSegments: 1},
    // 		// 		{type: 'Cylinder', radiusTop: 22, radiusBottom: 20, height: 4, radiusSegments: 16, heightSegments: 1, position: {x: 0, y: -8, z: 0}},
    // 		// 	], 
    // 		// 	material: {type: 'Phong', param: {color: 0x9cb2d1, specular: 0x111111, shininess: 100} },
    // 		// 	position: {x: 0, y: 10, z: 0},
    // 		// },

    // 		// {
    // 		// 	geometry: [
    // 		// 		{type: 'Cylinder', radiusTop: 2, radiusBottom: 2, height: 12, radiusSegments: 8, heightSegments: 1},
    // 		// 		{type: 'Cylinder', radiusTop: 2, radiusBottom: 2, height: 50, radiusSegments: 8, heightSegments: 1, position: {x: 4, y: 25, z: 0}, rotation: {x: 0, y: 0, z: 0.5}},
    // 		// 	], 
    // 		// 	material: {type: 'Phong', param: {color: 0xcfdfbf, specular: 0x111111, shininess: 200} },
    // 		// 	position: {x: 0, y: 25, z: 0},
    // 		// },
    // 		// {
    // 		// 	geometry: {type: 'Box', width: 2, height: 30, depth: 15},
    // 		// 	material: {type: 'Phong', param: {color: 0x000000, specular: 0x111111, shininess: 100} },
    // 		// 	position: {x: -50, y: 30, z: 0},
    // 		// },
    // 	],

    // 	position: {x: 0, y: 280, z: 0},
    // 	userData: { outline: true, click: true },
    // },

  ]
}
