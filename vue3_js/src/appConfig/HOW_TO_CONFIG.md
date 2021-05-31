app_data文件夹用来记录APP的设定信息，包括APP的全球唯一标识，签名信息

1. 全球唯一标识AppName设定方法:
   修改app_config.json文件中的AppName信息，一般命名方法为 domain/子应用名

2. 签名信息，使用RSA签名，设定方法:
   使用在线生成工具生成RSA钥匙对，例如 http://www.metools.info/code/c80.html
   注意选择设定信息有三点要注意:
   A. 秘钥长度固定为 2048 bit
   B. 秘钥格式固定为 PKCS#8
   (生成出的公钥以 -----BEGIN PUBLIC KEY----- 开头，而非 -----BEGIN RSA PUBLIC KEY-----)
   C. 密码不要设置
   将生成的公钥复制粘贴到文件app_sign_public_key.pem中，内容可以参照 app_sign_public_key_sample.pem 文件
   同理，将私钥复制粘贴到文件app_sign_private_key.crt中
   
   JsView签名原理说明:
   在进行js build时，会将 main.jsv.xxxx.js (包含AppName具体值)文件的md5值用私钥进行编码，编码出的内容和公钥一起写入到该文件的文件头中，JsView加载后用公钥反编码出该md5值，和文件的md5进行比对，若md5一致则认为此公钥合法，然后此公钥会和AppName进行映射，作为设定快捷访问地址等权限控制的调用作为参考，以防止其他APP对本APP(以AppName为查询键)的私有内容进行非法访问和破坏。
   
   注意: 私钥(app_sign_private_key.crt)不要被泄漏，私钥若泄漏，则其他APP可以伪装AppName，查询本APP的私有内容，覆盖本APP设定的快捷访问地址。
   
