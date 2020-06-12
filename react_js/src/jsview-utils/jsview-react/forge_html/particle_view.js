/*
 * @Author: ChenChanghua
 * @Date: 2020-06-12 11:17:13
 * @LastEditors: ChenChanghua
 * @LastEditTime: 2020-06-12 17:25:28
 * @Description: file content
 */ 
import Forge from "../ForgeDefine"

class Texture {
    constructor(texture_manager, gl_context, onload) {
        this._TextureManager = texture_manager;
        this._GL = gl_context;
        this._Loaded = false;
        this._OnLoad = onload;
        this.TextureId;
        this._TextureSource;
    }
    
    _setGLTexture() {
        this.TextureId = this._GL.createTexture();
        //1.对纹理图像进行Y轴反转
        // this._GL.pixelStorei(this._GL.UNPACK_FLIP_Y_WEBGL, 1);
        //2.开启0号纹理单元
        this._GL.activeTexture(this._GL.TEXTURE0);
        //3.向target绑定纹理对象
        this._GL.bindTexture(this._GL.TEXTURE_2D, this.TextureId);
        //4.配置纹理参数
        this._GL.texParameteri(this._GL.TEXTURE_2D, this._GL.TEXTURE_MIN_FILTER, this._GL.LINEAR);
        //5.配置纹理图像
        this._GL.texImage2D(this._GL.TEXTURE_2D, 0, this._GL.RGBA, this._GL.RGBA, this._GL.UNSIGNED_BYTE, this._TextureSource);
    }

    loaded() {
        return this._Loaded;
    }

    recycle() {
        this._TextureManager.recycle(this._TextureSource);
    }
}
Texture.IMAGE = Symbol("Texture.IMAGE");
Texture.COLOR = Symbol("Texture.COLOR");

class ImageTexutre extends Texture{
    constructor(texture_manager, gl_context, onload, url) {
        super(texture_manager, gl_context, onload);
        this.Url = url;
        this._TextureSource = new Image();
        this._TextureSource.onload = () => {
            this._setGLTexture();
            this._Loaded = true;
            if (this._OnLoad) {
                this._OnLoad();
            }
        }
        this._TextureSource.src = url;
    }
}

class ColorCanvas{
    constructor() {
        this._Canvas = originDocument.createElement("canvas");
        this._Canvas.setAttribute("width", "1px");
        this._Canvas.setAttribute("height", "1px");
        this._Canvas.setAttribute("style", "position: absolute;");
        document.body.appendChild(this._Canvas);

        this._GL = this._Canvas.getContext("2d");
    }

    getColorImageData(r, g, b, a) {
        let image_data = this._GL.createImageData(1, 1);
        image_data.data[0] = r;
        image_data.data[1] = g;
        image_data.data[2] = b;
        image_data.data[3] = a;
        return image_data;
    }
}
let sColorCanvas = null;

let parseColor = (color_str) => {
    if (!color_str) { return null; }
    color_str = color_str.trim();
    if (color_str.indexOf("rgba") == 0) {
        let index1 = color_str.indexOf("(");
        let index2 = color_str.indexOf(")");
        let value_str = color_str.substr(index1 + 1, index2 - index1 - 1);
        let str_l = value_str.split(",");
        return str_l.map((value, index) => {
            return index == 3 ? Math.ceil(parseFloat(value) * 255) : parseInt(value);
        });
    } else if (color_str.indexOf("#") == 0) {
        let value_str = color_str.substr(1);
        let l = value_str.length;
        if (l == 6 || l == 8) {
            if (l == 6) {
                value_str += "FF";
            }
            let value = parseInt("0x" + value_str);
            return [
                value >> 24 & 0xFF,
                value >> 16 & 0xFF,
                value >> 8 & 0xFF,
                value & 0xFF,
            ]
        } else {
            return null;
        }
    } else {
        return null;
    }
}

class ColorTexture extends Texture{
    constructor(texture_manager, gl_context, onload, color) {
        super(texture_manager, gl_context, onload);
        if (sColorCanvas == null) {
            sColorCanvas = new ColorCanvas();
        }
        this.Color = color;
        let result = parseColor(this.Color);
        this._TextureSource = sColorCanvas.getColorImageData(...result);
        this._setGLTexture();
        this._Loaded = true;
        if (this._OnLoad) {
            this._OnLoad();
        }
    }
}

class TextureManager{
    constructor() {
        this._TextureMap = {};
    }

    getTexture(type, gl_context, onload, res_str) {
        let texture;
        if (this._TextureMap[res_str]) {
            texture = this._TextureMap[res_str].texture;
            this._TextureMap[res_str].useCount++
        } else {
            switch(type) {
                case Texture.IMAGE:
                    texture = new ImageTexutre(this, gl_context, onload, res_str);
                    break;
                case Texture.COLOR:
                    texture = new ColorTexture(this, gl_context, onload, res_str);
                    break;
            }
            this._TextureMap[res_str] = {
                texture: texture,
                useCount: 1
            }
        }
        return texture;
    }

    recycle(res_str) {
        if (this._TextureMap[res_str]) {
            this._TextureMap[res_str].useCount--;
            if (this._TextureMap[res_str].useCount < 0) {
                delete this._TextureMap[res_str];
            }
        }
    }
}
let sTextureManager = new TextureManager();

let random = (min, max) => Math.random() * (max - min) + min;

class ParticleView{
    constructor(view_id, setting, texture, view_size, element) {
        this._ViewId = view_id;
        this._Type = setting.type;
        this._ParticleNum = setting.particleNum;
        this._DeltaAngle = setting.deltaAngle / 180 * Math.PI;
        this._DeltaWidthFact = setting.deltaWidth / view_size.width;
        this._PointSizeMin = setting.pointSizeMin;
        this._PointSizeMax = setting.pointSizeMax;
        this._SpeedMin = setting.speedMin;
        this._SpeedMax = setting.speedMax;
        this._LifeMin = setting.lifeMin / 1000;
        this._LifeMax = setting.lifeMax / 1000;
        this._AddNumSpeed = setting.addNumSpeed;
        this._AcceletateX = setting.accelerateX;
        this._AcceletateY = setting.accelerateY;
        this._Texture = texture;
        this._Buffer = new Float32Array(this._ParticleNum * 7);
        this._AddedParticleNum = 0;
        this._Element = element;

        this._StartTime = -1;
        this._LastFrameTime = -1;
        this._Stopped = false;

        this._getTransform = this._getTransform.bind(this);
    }

    _getTransform() {
        let cur_element = this._Element.jsvMainView.Element;
        let ele_width = pxToNum(cur_element.style.width);
        let ele_height = pxToNum(cur_element.style.height);
        let total_transform = new WebKitCSSMatrix();
        while(cur_element.parentElement) {
            let style = getComputedStyle(cur_element);
            if (style.transform) {
                let origin_str = style.transformOrigin ? style.transformOrigin : style.webkitTransformOrigin;
                if (origin_str) {
                    let list = pxToNum(origin_str);
                    let translate1 = new WebKitCSSMatrix("translate(-" + list[0] + "px,-" + list[1] + "px)");
                    let translate2 = new WebKitCSSMatrix("translate(" + list[0] + "px," + list[1] + "px)");
                    let translate3 = new WebKitCSSMatrix("translate(" + cur_element.offsetLeft + "px," + cur_element.offsetTop + "px)");
                    let transform = new WebKitCSSMatrix(style.transform);
                    total_transform = translate3.multiply(translate2.multiply(transform.multiply(translate1.multiply(total_transform))))
                } else {
                    total_transform = new WebKitCSSMatrix(style.transform).multiply(total_transform);
                }
            }
            cur_element = cur_element.parentElement;
        }
        let size_matrix = new WebKitCSSMatrix();
        size_matrix.m11 = 0;
        size_matrix.m12 = 0;
        size_matrix.m14 = 1;
        size_matrix.m21 = ele_width;
        size_matrix.m22 = 0;
        size_matrix.m24 = 1;
        size_matrix.m31 = 0;
        size_matrix.m32 = ele_height;
        size_matrix.m43 = 1;
        size_matrix.m41 = ele_width;
        size_matrix.m42 = ele_height;
        size_matrix.m44 = 1;
        total_transform = total_transform.multiply(size_matrix);
        
        let result = [total_transform.m11, total_transform.m12, total_transform.m21, total_transform.m22, total_transform.m31, total_transform.m32, total_transform.m41, total_transform.m42];
        return result; 
    }

    _updateParticleInfo(index, edge_vector_x, edge_vector_y, center_vec_x, center_vec_y, angle, current) {
        let random_width_fact = random(-this._DeltaWidthFact, this._DeltaWidthFact);
        this._Buffer[index * 7] = random_width_fact * edge_vector_x + center_vec_x;
        this._Buffer[index * 7 + 1] = random_width_fact * edge_vector_y + center_vec_y;
        this._Buffer[index * 7 + 2] = angle + random(-this._DeltaAngle, this._DeltaAngle);
        this._Buffer[index * 7 + 3] = random(this._SpeedMin, this._SpeedMax);
        this._Buffer[index * 7 + 4] = current;
        this._Buffer[index * 7 + 5] = random(this._LifeMin, this._LifeMax);
        this._Buffer[index * 7 + 6] = random(this._PointSizeMin, this._PointSizeMax);
    }

    onDrawFrame(gl, program, vbo) {
        if (!this._Texture.loaded() || this._Stopped) {
            return;
        }
        if (this._StartTime < 0) {
            this._StartTime = Date.now();
        }
        if (this._LastFrameTime < 0) {
            this._LastFrameTime = this._StartTime;
        }
        let source_position = this._getTransform();
        for (let i = 0; i < source_position.length; i++) {
            if (i % 2 == 0) {
                source_position[i] = source_position[i] * 2 / window.innerWidth - 1
            } else {
                //style的坐标系和gl的坐标系y轴相反
                source_position[i] = 1 - source_position[i] * 2 / window.innerHeight;
            }
        }
        let current = (Date.now() - this._StartTime) / 1000.0;
        let edge_vx = source_position[2] - source_position[0];
        let edge_vy = source_position[3] - source_position[1];
        let center_x = (source_position[2] + source_position[0]) / 2.0;
        let center_y = (source_position[3] + source_position[1]) / 2.0;
        let length = Math.sqrt(edge_vx * edge_vx + edge_vy * edge_vy);
        let per_vx = -edge_vy / length;
        let per_vy = edge_vx / length;
        let angle = per_vy > 0 ? Math.acos(per_vx) : 2 * Math.PI - Math.acos(per_vx);
        if (this._Type == 0) {
            if (this._AddedParticleNum < this._ParticleNum) {
                for (let i = 0; i < this._ParticleNum; i++) {
                    this._updateParticleInfo(i, edge_vx, edge_vy, center_x, center_y, angle, current);
                }
                this._AddedParticleNum = this._ParticleNum;
            } else {
                let all_done = true;
                for (let i = 0; i < this._ParticleNum; i++) {
                    if (this._Buffer[i * 7 + 4] + this._Buffer[i * 7 + 5] > current) {
                        all_done = false;
                        break;
                    }
                }
                if (all_done) {
                    this._Stopped = true;
                }
            }
        } else {
            if (this._AddedParticleNum < this._ParticleNum) {
                let add_num = Math.round((Date.now() - this._LastFrameTime) * this._AddNumSpeed);
                if (this._AddedParticleNum + add_num > this._ParticleNum)
                    add_num = this._ParticleNum - this._AddedParticleNum;
                for (let i = 0; i < add_num; i++) {
                    this._updateParticleInfo(this._AddedParticleNum + i, edge_vx, edge_vy, center_x, center_y, angle, current);
                }
                this._AddedParticleNum += add_num;
            } else {
                //更新过期的粒子
                for (let i = 0; i < this._ParticleNum; i++) {
                    if (this._Buffer[i * 7 + 4] + this._Buffer[i * 7 + 5] < current) {
                        this._updateParticleInfo(i, edge_vx, edge_vy, center_x, center_y, angle, current);
                    }
                }
            }
        }
        let uTime = gl.getUniformLocation(program, 'uTime');
        gl.uniform1f(uTime, current);
        let uAccelerate = gl.getUniformLocation(program, 'uAccelerate');
        gl.uniform2f(uAccelerate, this._AcceletateX, this._AcceletateY);
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this._Texture.TextureId);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this._Buffer)
        gl.drawArrays(gl.POINTS, 0, this._AddedParticleNum);
    }

    recycle() {
        this._Buffer = null;
        this._Texture.recycle();
        this._Stopped = true;
    }
}

let VERTEX_SHADER_SRC = 
    "attribute vec2 aPosition;"
    +"attribute vec2 aSpeed;"
    +"attribute vec2 aLife;"
    +"attribute float aPointSize;"
    +"uniform float uTime;"
    +"uniform vec2 uAccelerate;"
    +"varying float alpha;"
    +"void main() {"
    +"  float use_time = (uTime - aLife.x) / 10.0;"
    +"  float x = aSpeed.y * cos(aSpeed.x) * use_time + 0.5 * uAccelerate.x * use_time * use_time;"
    +"  float y = aSpeed.y * sin(aSpeed.x) * use_time + 0.5 * uAccelerate.y * use_time * use_time;"
    +"  float percent = (uTime - aLife.x) / aLife.y;"
    +"  alpha = percent > 1.0 ? 0.0 : cos(1.57 * percent);"
    +"  gl_PointSize = aPointSize;"
    +"  gl_Position = vec4(x + aPosition.x, y + aPosition.y, 0.0, 1.0);"
    +"}"

let FRAGMENT_SHADER_SRC = 
    "precision mediump float;"
    +"uniform sampler2D uTexture;"
    +"varying float alpha;"
    +"void main(void) {"
    +"  vec4 texture = texture2D(uTexture, gl_PointCoord) * alpha;"
    +"  gl_FragColor = texture;"
    +"}";

let PARTICLE_VIEW_ID = 0;
let MAX_PARTICLE_NUM = 100;
class ParticleManager {
    constructor() {
        this._Inited = false;
        this._Canvas;
        this._GL;
        this._GLProgram;
        this._VBO;
        this._ParticleViewMap = {};
        this._LoopStarted = false;
        this._onDrawFrame = this._onDrawFrame.bind(this);
    }
    
    _initCanvas() {
        this._Canvas = originDocument.createElement("canvas");
        this._Canvas.setAttribute("width", window.innerWidth + "px");
        this._Canvas.setAttribute("height", window.innerHeight + "px");
        this._Canvas.setAttribute("style", "position: absolute;");
        document.body.appendChild(this._Canvas);

        this._GL = this._Canvas.getContext('webgl');
        if (!this._GL) {
            console.error("init webgl failed");
            return;
        }
        //编译着色器
        let  vertShader = this._GL.createShader(this._GL.VERTEX_SHADER);
        this._GL.shaderSource(vertShader, VERTEX_SHADER_SRC);
        this._GL.compileShader(vertShader);

        let  fragShader = this._GL.createShader(this._GL.FRAGMENT_SHADER);
        this._GL.shaderSource(fragShader, FRAGMENT_SHADER_SRC);
        this._GL.compileShader(fragShader);
        //合并程序
        this._GLProgram = this._GL.createProgram();
        this._GL.attachShader(this._GLProgram, vertShader);
        this._GL.attachShader(this._GLProgram, fragShader);
        this._GL.linkProgram(this._GLProgram);

        let buffer_array = new Float32Array(MAX_PARTICLE_NUM * 7);
        let FSIZE = buffer_array.BYTES_PER_ELEMENT;
        this._VBO = this._GL.createBuffer();
        this._GL.bindBuffer(this._GL.ARRAY_BUFFER, this._VBO);
        this._GL.bufferData(this._GL.ARRAY_BUFFER, buffer_array, this._GL.STATIC_DRAW);
        
        let aPosition = this._GL.getAttribLocation(this._GLProgram, "aPosition");
        this._GL.vertexAttribPointer(aPosition, 2, this._GL.FLOAT, false, FSIZE * 7, 0);
        this._GL.enableVertexAttribArray(aPosition);

        let aSpeed = this._GL.getAttribLocation(this._GLProgram, "aSpeed");
        this._GL.vertexAttribPointer(aSpeed, 2, this._GL.FLOAT, false, FSIZE * 7, FSIZE * 2);
        this._GL.enableVertexAttribArray(aSpeed);

        let aLife = this._GL.getAttribLocation(this._GLProgram, "aLife");
        this._GL.vertexAttribPointer(aLife, 2, this._GL.FLOAT, false, FSIZE * 7, FSIZE * 4);
        this._GL.enableVertexAttribArray(aLife);

        let aPointSize = this._GL.getAttribLocation(this._GLProgram, "aPointSize");
        this._GL.vertexAttribPointer(aPointSize, 1, this._GL.FLOAT, false, FSIZE * 7, FSIZE * 6);
        this._GL.enableVertexAttribArray(aPointSize);

        this._GL.useProgram(this._GLProgram);
        let uTexture = this._GL.getUniformLocation(this._GLProgram, 'uTexture');
        this._GL.uniform1i(uTexture, 0);
    
        this._GL.enable(this._GL.BLEND);
        this._GL.blendFunc(this._GL.ONE, this._GL.ONE_MINUS_SRC_ALPHA);
        this._Inited = true;
    }

    _onDrawFrame() {
        this._GL.clear(this._GL.COLOR_BUFFER_BIT);
        this._GL.useProgram(this._GLProgram);

        for (let id in this._ParticleViewMap) {
            this._ParticleViewMap[id].onDrawFrame(this._GL, this._GLProgram, this._VBO);
        }

        window.requestAnimationFrame(this._onDrawFrame);
    }

    addParticle(setting, texture_url, view_size, element) {
        if (!this._Inited) {
            this._initCanvas();
        }
        let view_id = PARTICLE_VIEW_ID++;
        let texture;
        if (texture_url.indexOf("rgba") == 0 || texture_url.indexOf("#") == 0) {
            texture = sTextureManager.getTexture(Texture.COLOR, this._GL, null, texture_url);
        } else {
            texture = sTextureManager.getTexture(Texture.IMAGE, this._GL, null, texture_url);
        }
        this._ParticleViewMap[view_id] = new ParticleView(view_id, setting, texture, view_size, element);
        if (!this._LoopStarted) {
            this._LoopStarted = true;
            window.requestAnimationFrame(this._onDrawFrame);
        }
        return view_id;
    }

    recycleView(id) {
        if (this._ParticleViewMap[id]) {
            this._ParticleViewMap[id].recycle();
            delete this._ParticleViewMap[id];
        }
    }
}
Forge.sParticleManager = new ParticleManager();

let pxToNum = px => {
    if (px.indexOf(" ") >=0 ) {
        let list = px.split(" ");
        return list.map(str => parseInt(str.substr(0, str.length - 2)))
    } else {
        return parseInt(px.substr(0, px.length - 2))
    }
}
