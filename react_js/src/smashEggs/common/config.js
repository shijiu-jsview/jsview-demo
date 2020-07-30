const Data = {
  //speed: 200,
  //主角不同状态时的碰撞体积大小, top + hieght =110
  role_bodySize:{
    run:{left:70,top:20,width:20,height:90},
    jump:{left:70,top:30,width:20,height:80},
    roll:{left:70,top:50,width:20,height:60}
  },
  //地板图片宽高信息w,h
  floors: {
    easy: [
      {w:800,h:174},
      {w:500,h:176},
      {w:250,h:174},
      {w:300,h:224},
      {w:300,h:176},
      {w:150,h:174}],
    middle: [
      {w:250,h:209},
      {w:250,h:209},
      {w:250,h:220},
      {w:250,h:249},
      {w:200,h:181},
      {w:500,h:190},
      {w:500,h:228}],
    hard: [
      {w:700,h:442},
      {w:200,h:200},
      {w:1000,h:340},
      {w:800,h:362},
      {w:300,h:300}],
  },

  //障碍物宽高信息w,h,以及碰撞体积大小bodysize
  obstacles: {
    easy: [{w:100,h:384,bodySize:{left:0,top:0,width:100,height:380}},{w:54,h:90,bodySize:{left:6,top:20,width:42,height:70}}],
    middle: [{w:100,h:60,bodySize:{left:10,top:10,width:80,height:50}}],
    hard: [{w:66,h:54,bodySize:{left:0,top:0,width:66,height:54}},{w:330,h:448,bodySize:{left:270,top:95,width:20,height:215}},{w:50,h:80,bodySize:{left:0,top:0,width:50,height:80}}]
  },

  coin:{w:48,h:48},

/**配置信息
 *    所有位置均为相对于图片左上角。
 *    floorInfo: arr：地板序列 times：循环次数，y：地板高度, distance:地板间距离/数组表示随机值
 *    obsInfo: value:对应难度的对应障碍物(1==obstacles[middle[0]])  
           x:距离对应地板组开始的位置(0表示此地板最开始位置) y:障碍物距离地板的距离(0表示刚好在地板上,向上为负值)
 *    coinInfo: num:金币的数量
           x:距离对应地板组开始的位置(0表示此地板最开始位置) y:金币距离地板的距离(0表示刚好在地板上,向上为负值)
 */
            
  config:{
    easy:[{floorInfo:{arr:[6,4,2,4,4,6], y:460, distance:[0]},
            obsInfo:[{value:1,x:1356,y:-76}],
            coinInfo:[{x:860,y:-48},
              {x:950,y:-48},
              {x:1040,y:-48}]},
          {floorInfo:{arr:[1,2,4], y:460, distance:[200]},
            obsInfo:[{value:2,x:480,y:0}],
            coinInfo:[{x:500,y:-128},{x:1230,y:-128}]},
          {floorInfo:{arr:[3,5,2,2,3], y:460, distance:[200]},
            obsInfo:[{value:2,x:900,y:-78}],
            coinInfo:[{x:250,y:-80},{x:340,y:-180},{x:410,y:-80}]}
          ],
    middle:[{floorInfo:{arr:[1,4,7,2,1], y:460, distance:[200]},
              obsInfo:[{value:1,x:368,y:0},{value:1,x:870,y:-200}],
              coinInfo:[{x:524,y:-48},{x:1030,y:-148}]},
            {floorInfo:{arr:[3,5,5,3,7,5], y:460, distance:[200]},
              obsInfo:[{value:1,x:200,y:-78}],
              coinInfo:[{x:520,y:-40},
                {x:600,y:-40},
                {x:680,y:-40},
                {x:1000,y:-180},
                {x:1070,y:-220},
                {x:11400,y:-180}]},
            {floorInfo:{arr:[1,4,5,6,5,5,5], y:460, distance:[200]},
              obsInfo:[{value:1,x:230,y:-200},{value:1,x:680,y:0},{value:1,x:1200,y:-78}],
              coinInfo:[{x:520,y:-248}]}
            ],
    hard:[{floorInfo:{arr:[4,1], y:460, distance:[200]},
            obsInfo:[
                    {value:1,x:270,y:0},
                    {value:1,x:350,y:-60},
                    {value:1,x:780,y:0},
                    // {value:2,x:230,y:0},
                    {value:3,x:1280,y:-160}],
            coinInfo:[{x:1080,y:-150}]},
         {floorInfo:{arr:[2,3,2,2], y:460, distance:[200]},
            obsInfo:[
              // {value:3,x:220,y:0},
                    {value:3,x:270,y:0},
                    {value:3,x:320,y:0},
                    {value:1,x:730,y:-80},
                    // {value:2,x:630,y:0},
                    {value:3,x:1280,y:-80},
                    {value:3,x:1280,y:-160}],
            coinInfo:[{x:954,y:-150}]},
         {floorInfo:{arr:[3,4], y:460, distance:[200]},
            obsInfo:[
              // {value:2,x:0,y:0},
                    {value:1,x:630,y:0},
                    {value:1,x:630,y:-60},
                    {value:1,x:1020,y:0},
                    {value:3,x:1380,y:-80}],
            coinInfo:[{x:300,y:-160},{x:460,y:-250},{x:500,y:-160}]}
          ]
  },

  
	/** data: role_left、role_top 主角起始位置
	 *        *_num 不同难度的关卡数量  
   *        #_speed 不同难度的关卡速度 
	 *
	 */
  data:{
    role_left:100,
    role_top:350,

    // easy_num:1,
    // middle_num:1,
    easy_num:2,
    middle_num:2,
    easy_speed:400,
    middle_speed:450,
    hard_speed:500,

    floorListWidth:[1700,1800,2000],


    //主角不同状态时的碰撞体积大小, top + hieght =110
    role_bodySize:{
      run:{left:70 + 100,top:20 + 350,width:20,height:90},
      jump:{left:70 + 100,top:30 + 350,width:20,height:80},
      roll:{left:70 + 100,top:50 + 350,width:20,height:60},
      fail:{left:0,top:0,width:0,height:0}
    }
  }

}
export default Data