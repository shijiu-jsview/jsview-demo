import React from 'react';
import { SimpleWidget, VERTICAL } from "../../utils/JsViewEngineWidget/index_widget";
import { FocusBlock } from "../../utils/JsViewReactTools/BlockDefine";
import createStandaloneApp from "../../utils/JsViewReactTools/StandaloneApp";

const urlList = [
  "http://oss.image.51vtv.cn/homepage/20210209/0365e073eaed9304e449022df630058c.jpg",
  "http://oss.image.51vtv.cn/homepage/20210209/03d8ab4a3e25093427cf2496a6428d8e.jpg",
  "http://oss.image.51vtv.cn/homepage/20210209/0afb44177a89e8881f4ff95ac0fb14df.jpg",
  "http://oss.image.51vtv.cn/homepage/20210209/1466120d4016ec41b46f987321092c11.png",
  "http://oss.image.51vtv.cn/homepage/20210209/1b3023addca51c2f5ca2fe46757df8ca.jpg",
  "http://oss.image.51vtv.cn/homepage/20210209/27bda620942566673ab449a3ef765321.png",
  "http://oss.image.51vtv.cn/homepage/20210209/27f3eb1cf751d1507e5d34a895d3223f.jpg",
  "http://oss.image.51vtv.cn/homepage/20210209/29c2729b1cca3af0a9570cb1dfac3fb7.jpg",
  "http://oss.image.51vtv.cn/homepage/20210209/2e2cf6c29c19594fb5e1f82b05ad2e06.jpg",
  "http://oss.image.51vtv.cn/homepage/20210209/30a8375956bb7e860978c6f4989da53f.jpg",
  "http://oss.image.51vtv.cn/homepage/20210209/31d4e770fce5d74a162ca09623aca346.jpg",
  "http://oss.image.51vtv.cn/homepage/20210209/32b2fec48fcf65bb9f13f667613a1424.jpg",
  "http://oss.image.51vtv.cn/homepage/20210209/3728bc2aa7ecbd52e9b1e4806c61c9f0.png",
  "http://oss.image.51vtv.cn/homepage/20210209/3eef568feaa09b58a5ca8bab47ba91a9.jpg",
  "http://oss.image.51vtv.cn/homepage/20210209/4ae77d89649b64543888d6ff5e6b7565.jpg",
  "http://oss.image.51vtv.cn/homepage/20210209/587cf9d9e4ed5f0212a9c0502bd6a6c3.jpg",
  "http://oss.image.51vtv.cn/homepage/20210209/6308cd48ce12cff6d98c82b50365afde.jpg",
  "http://oss.image.51vtv.cn/homepage/20210209/6324e8186c9c34da1fb47390684e5b12.jpg",
  "http://oss.image.51vtv.cn/homepage/20210209/6c8800282453421c3c1a0104fc6dbd57.png",
  "http://oss.image.51vtv.cn/homepage/20210209/6db464091e2483d5000ed91f8ad56a2f.jpg",
  "http://oss.image.51vtv.cn/homepage/20210209/701a79067b15689d715353cbf8612cea.jpg",
  "http://oss.image.51vtv.cn/homepage/20210209/70a97b64fc4d004bbf296f67f924aa58.jpg",
  "http://oss.image.51vtv.cn/homepage/20210209/722eab99b4f1abe8b628d4a58f3e9b9d.jpg",
  "http://oss.image.51vtv.cn/homepage/20210209/7369ae6d849c0092d548890dd958c6f4.jpg",
  "http://oss.image.51vtv.cn/homepage/20210209/7b906d4c59639eae35848e24f3ab3ac4.jpg",
  "http://oss.image.51vtv.cn/homepage/20210209/8ee99d146f76afb888b4e98610a061f4.png",
  "http://oss.image.51vtv.cn/homepage/20210209/91a5ee408c5206050ab5ebb2c296d387.jpg",
  "http://oss.image.51vtv.cn/homepage/20210209/930afd2ff378d41e3e886f0e6a1e8bb5.jpg",
  "http://oss.image.51vtv.cn/homepage/20210209/936d3738c8238beeb84fe264acbd13af.jpg",
  "http://oss.image.51vtv.cn/homepage/20210209/9405e6ee62b2e3b4a61e9eb88aba4650.jpg",
  "http://oss.image.51vtv.cn/homepage/20210209/96034489fe1cdc4fdee4d6366985f754.jpg",
  "http://oss.image.51vtv.cn/homepage/20210209/9a2a06df2ffdd61286ddfc599afd6e44.jpg",
  "http://oss.image.51vtv.cn/homepage/20210209/9cabc68da1a5012fe737ffdce51f60b4.jpg",
  "http://oss.image.51vtv.cn/homepage/20210209/a8e8c40c70ac6f0a7ff4cec9d3b487e1.jpg",
  "http://oss.image.51vtv.cn/homepage/20210209/b2e684c470d57cafacc2e8905ef8e458.png",
  "http://oss.image.51vtv.cn/homepage/20210209/b3469245d73aa3a5f383ac5d350f83cc.jpg",
  "http://oss.image.51vtv.cn/homepage/20210209/b622ad1e83c92d5e8ecb8b1d6255dbfb.png",
  "http://oss.image.51vtv.cn/homepage/20210209/bf0c272440fe522fb0eb43e80eaee69a.jpg",
  "http://oss.image.51vtv.cn/homepage/20210209/bfdcd31bf00d68435a04d7301f6deb59.jpg",
  "http://oss.image.51vtv.cn/homepage/20210209/c0454139190a7d5bf617d483ca709c08.jpg",
  "http://oss.image.51vtv.cn/homepage/20210209/c395815fd927b08edf749f90c100557f.jpg",
  "http://oss.image.51vtv.cn/homepage/20210209/ce0dd3608c9fc329e132199963e7df01.jpg",
  "http://oss.image.51vtv.cn/homepage/20210209/cf6ff9c82cc98a758ae60a2b4804cc32.png",
  "http://oss.image.51vtv.cn/homepage/20210209/d9de7ab118040ef2a331c28286860bf0.jpg",
  "http://oss.image.51vtv.cn/homepage/20210209/decea78c72b43798cf176847d2769bc4.jpg",
  "http://oss.image.51vtv.cn/homepage/20210209/e0c913e39f2846e511b5777474add0d9.jpg",
  "http://oss.image.51vtv.cn/homepage/20210209/e2f7f11fd65e914272145f031d0cb15e.jpg",
  "http://oss.image.51vtv.cn/homepage/20210209/ea6df28105bac42c7d3fc55789d0a1bd.jpg",
  "http://oss.image.51vtv.cn/homepage/20210209/f5d48b51be29716ffa575dfbc4eaca4b.jpg",
  "http://oss.image.51vtv.cn/homepage/20210209/fc98ba38607e66d58cd4b56e677c6469.jpg",
  "http://oss.image.51vtv.cn/homepage/20210205/07b3e1292df56ee2cd52c3e7860135d5.png",
  "http://oss.image.51vtv.cn/homepage/20210205/0cf8df4a8507df4031060cd18fa19faf.jpg",
  "http://oss.image.51vtv.cn/homepage/20210205/233cb83e11f22227a0b716009a57e80c.jpg",
  "http://oss.image.51vtv.cn/homepage/20210205/2791e962be5fe291f4cd4c68ac1ee9a5.jpg",
  "http://oss.image.51vtv.cn/homepage/20210205/4360940a589e8f9317e75b5808dc4035.png",
  "http://oss.image.51vtv.cn/homepage/20210205/75dd85615512d98ac15054146b3e310b.png",
  "http://oss.image.51vtv.cn/homepage/20210205/914547044fb8198cd63ad2cbfb8a3c79.jpg",
  "http://oss.image.51vtv.cn/homepage/20210205/b39da18b7a174f9578f59428bfecef6a.jpg",
  "http://oss.image.51vtv.cn/homepage/20210204/07b3e1292df56ee2cd52c3e7860135d5.png",
  "http://oss.image.51vtv.cn/homepage/20210204/09528038671aa8ae3e3932f2dc73c08b.jpg",
  "http://oss.image.51vtv.cn/homepage/20210204/16b71201c622df5fe18d886689ca4452.png",
  "http://oss.image.51vtv.cn/homepage/20210204/233cb83e11f22227a0b716009a57e80c.jpg",
  "http://oss.image.51vtv.cn/homepage/20210204/30e901da12001275c9ccbd25e96ad75f.jpg",
  "http://oss.image.51vtv.cn/homepage/20210204/376d04a648d639669051a53065434732.png",
  "http://oss.image.51vtv.cn/homepage/20210204/3b92815640a6d1b86002c80348f44dd3.png",
  "http://oss.image.51vtv.cn/homepage/20210204/408bf35437be04078bb91cfa92819182.png",
  "http://oss.image.51vtv.cn/homepage/20210204/4c14694bcb89fa429d115fcdc2213788.png",
  "http://oss.image.51vtv.cn/homepage/20210204/4e3bc314a1e11b7753bb2c1f777a6aef.png",
  "http://oss.image.51vtv.cn/homepage/20210204/77abeea31610c9677a80f69628f636a1.png",
  "http://oss.image.51vtv.cn/homepage/20210204/8bee45508968f95d43c8c73eef8667dc.png",
  "http://oss.image.51vtv.cn/homepage/20210204/a6d04e352d4bf1c6fb8b59fc53757686.jpg",
  "http://oss.image.51vtv.cn/homepage/20210204/ac24f12335b62eed6bdd1e0cf4686184.jpeg",
  "http://oss.image.51vtv.cn/homepage/20210204/be380b2de21166dd59229e9ae27e7fe4.jpg",
  "http://oss.image.51vtv.cn/homepage/20210204/c14f977bf961589f724e5fb9eb0197c1.png",
  "http://oss.image.51vtv.cn/homepage/20210204/cdc64d92f2bee6f2ef1faa2a615a1c84.png",
  "http://oss.image.51vtv.cn/homepage/20210204/f8a4d1633003076f70efd99159605455.jpg",
  "http://oss.image.51vtv.cn/homepage/20210203/09528038671aa8ae3e3932f2dc73c08b.jpg",
  "http://oss.image.51vtv.cn/homepage/20210203/0ba307d89710e54cabed99d2bc0a9814.jpg",
  "http://oss.image.51vtv.cn/homepage/20210203/2e684ae66280ecd93bfb00550d91df1f.png",
  "http://oss.image.51vtv.cn/homepage/20210203/30e901da12001275c9ccbd25e96ad75f.jpg",
  "http://oss.image.51vtv.cn/homepage/20210203/331829597c389d8c085c08d6223be4af.jpeg",
  "http://oss.image.51vtv.cn/homepage/20210203/511940ed7e97646c0912881238906e4f.jpg",
  "http://oss.image.51vtv.cn/homepage/20210203/5d00d3b4a9c0d0662322a64b018962b5.jpg",
  "http://oss.image.51vtv.cn/homepage/20210203/72ccecaabcc4501b17b2c89a081188ea.jpg",
  "http://oss.image.51vtv.cn/homepage/20210203/93e6759e26e33518ecc7044d18c12daa.jpg",
  "http://oss.image.51vtv.cn/homepage/20210203/a351655e9a1f73a154bccaaca229400f.jpg",
  "http://oss.image.51vtv.cn/homepage/20210203/a61076f65c1b019770c6ee9e7d07df4d.png",
  "http://oss.image.51vtv.cn/homepage/20210203/b3242982c1245266ade943ed182ab884.jpg",
  "http://oss.image.51vtv.cn/homepage/20210203/be380b2de21166dd59229e9ae27e7fe4.jpg",
  "http://oss.image.51vtv.cn/homepage/20210203/bed0fde2adbced0f800d410fdc051810.jpg",
  "http://oss.image.51vtv.cn/homepage/20210203/c82a166504a895a3c0ceb20e8eafd07e.jpg",
  "http://oss.image.51vtv.cn/homepage/20210203/cd74b954a09d598f092c69cbb40c9f13.jpg",
  "http://oss.image.51vtv.cn/homepage/20210203/cf6ff9c82cc98a758ae60a2b4804cc32.png",
  "http://oss.image.51vtv.cn/homepage/20210203/d31e36ef2e4c7ff1a24010641463c8a7.jpg",
  "http://oss.image.51vtv.cn/homepage/20210203/e0f91ab82a16a19663d6e49074a1de31.jpg",
  "http://oss.image.51vtv.cn/homepage/20210203/e3e049ca93d3ad2150e31702233ad355.png",
  "http://oss.image.51vtv.cn/homepage/20210203/e4239e4a65712b54a6610da660f3cb57.jpg",
  "http://oss.image.51vtv.cn/homepage/20210203/f3c9801a7ef91a98568c4c5e7a52d0e7.jpg",
  "http://oss.image.51vtv.cn/homepage/20210202/03559bd60cf5afd29fb4934f8308c726.jpg",
  "http://oss.image.51vtv.cn/homepage/20210202/066aff6929f67173fe354a24713a4f68.jpg",
  "http://oss.image.51vtv.cn/homepage/20210202/22317a7229c95e86be310636d8506aa8.png",
  "http://oss.image.51vtv.cn/homepage/20210202/27bb881aca60179a28c90a737623dbe1.png",
  "http://oss.image.51vtv.cn/homepage/20210202/3a83ada90d299316b12e89ae0310c686.jpg",
  "http://oss.image.51vtv.cn/homepage/20210202/3df95704a7138c65708c7a30b652b1b9.png",
  "http://oss.image.51vtv.cn/homepage/20210202/3ea1054506b90af665f1f2dbcaf3d174.png",
  "http://oss.image.51vtv.cn/homepage/20210202/43edb9c0391508b78436e7a2fd2ad829.jpg",
  "http://oss.image.51vtv.cn/homepage/20210202/45618493740d5091f67828060427db38.jpg",
  "http://oss.image.51vtv.cn/homepage/20210202/46d6ad1b343cb6ab12803eb63a8b2ac2.jpg",
  "http://oss.image.51vtv.cn/homepage/20210202/690522c632bde0184dd9674a4ce0980c.png",
  "http://oss.image.51vtv.cn/homepage/20210202/69a2ca07f01fd2320d2a1129cfaff4cd.png",
  "http://oss.image.51vtv.cn/homepage/20210202/69a9e76508d146e67008093304c42120.jpg",
  "http://oss.image.51vtv.cn/homepage/20210202/6ad5aa9fc9993c68c7e60b4e169f692f.png",
  "http://oss.image.51vtv.cn/homepage/20210202/7b2aa0c21e0b7cbe7db4eb2ce41e1189.png",
  "http://oss.image.51vtv.cn/homepage/20210202/7d9e316e59dd16bec5ef559ffb5d03e4.png",
  "http://oss.image.51vtv.cn/homepage/20210202/7eedd5a5f35804995b6369f45f55422b.jpg",
  "http://oss.image.51vtv.cn/homepage/20210202/91a5e13e74ea52075e1bc4406243df74.jpg",
  "http://oss.image.51vtv.cn/homepage/20210202/92e4810c5dab1ee56309a936d2f42c2f.jpg",
  "http://oss.image.51vtv.cn/homepage/20210202/958acd2f31575f47b8db27c72ab7078a.png",
  "http://oss.image.51vtv.cn/homepage/20210202/9791590cb8192cdc2232d1c0e2cf2161.png",
  "http://oss.image.51vtv.cn/homepage/20210202/9fa8a04ae29511be5a797adb64b793c9.jpg",
  "http://oss.image.51vtv.cn/homepage/20210202/adeeece39bf4b36e66ab801205b109bf.jpg",
  "http://oss.image.51vtv.cn/homepage/20210202/ca7fa87eb0e01c781adf7ded51dd58b5.jpg",
  "http://oss.image.51vtv.cn/homepage/20210202/cb309d8171b00b0f5f8aa0c18ac66d49.png",
  "http://oss.image.51vtv.cn/homepage/20210202/d6d4d7ec8f17e635a7534e85d3543ea7.jpg",
  "http://oss.image.51vtv.cn/homepage/20210202/db3ec7079608eac6104571475d1d2a5d.png",
  "http://oss.image.51vtv.cn/homepage/20210202/dc5f6780fbe1e341cf389afec56a9f8a.jpg",
  "http://oss.image.51vtv.cn/homepage/20210202/e1ea082e9de93d37e52e7f90c52193a3.jpg",
  "http://oss.image.51vtv.cn/homepage/20210202/ee730fde2e85d4f57d7fc0ac4dca0578.jpg",
  "http://oss.image.51vtv.cn/homepage/20210202/ef8aea6ff1835ae29c96a02e30cbf171.jpg",
  "http://oss.image.51vtv.cn/homepage/20210202/fb7c94b7b8aaaebbc3e30230831e70c7.jpg",
  "http://oss.image.51vtv.cn/homepage/20210201/2d0ce98c3936d124822411922501bfc7.png",
  "http://oss.image.51vtv.cn/homepage/20210201/32863aa606e877a7d92b2b367ffdede9.png",
  "http://oss.image.51vtv.cn/homepage/20210201/6d5177c20ccab6aa08e2784a2df35e28.png",
  "http://oss.image.51vtv.cn/homepage/20210201/74b7b8db27ff554469d82cd832a85a9f.jpg",
  "http://oss.image.51vtv.cn/homepage/20210201/9925b05289924175714e29d77c718c92.jpeg",
  "http://oss.image.51vtv.cn/homepage/20210201/aa28085263343e65051fcdf389247a63.png",
  "http://oss.image.51vtv.cn/homepage/20210201/cf6ff9c82cc98a758ae60a2b4804cc32.png",
  "http://oss.image.51vtv.cn/homepage/20210201/f66a86b8548349854d0a9a37862a36f5.png",
  "http://oss.image.51vtv.cn/homepage/20210126/0897378aa7f61412150046a700728d53.jpg",
  "http://oss.image.51vtv.cn/homepage/20210126/150e4a8a91c7aff424cab89a23020b54.jpg",
  "http://oss.image.51vtv.cn/homepage/20210126/18461be714992a4d434d340929394287.jpg",
  "http://oss.image.51vtv.cn/homepage/20210126/1c5a3a9c0a4127673f26f56be450bb70.jpg",
  "http://oss.image.51vtv.cn/homepage/20210126/245d6204ff81c1bbb7bc02559a4400a1.jpg",
  "http://oss.image.51vtv.cn/homepage/20210126/330b3e41b7d79023daa17379c2a0c366.jpg",
  "http://oss.image.51vtv.cn/homepage/20210126/48d2660734f0bdaa65d3c1cdaddaea58.jpg",
  "http://oss.image.51vtv.cn/homepage/20210126/56cbb5dde1c5468a5a4035da2996a279.jpg",
  "http://oss.image.51vtv.cn/homepage/20210126/699710a4ef7f5d3f2fcca1698b3585ee.jpg",
  "http://oss.image.51vtv.cn/homepage/20210126/6a60abe9b528813e0103e64385bc4548.jpg",
  "http://oss.image.51vtv.cn/homepage/20210126/6cde2224c18ca482ed9fd302bad1ef37.jpg",
  "http://oss.image.51vtv.cn/homepage/20210126/6f209132ab481a7a8f8ee960b6d38f9d.png",
  "http://oss.image.51vtv.cn/homepage/20210126/708d30d025c6af13e02b7d74ed71b853.jpg",
  "http://oss.image.51vtv.cn/homepage/20210126/75cae06005ec97e5c68dd726fd954c80.jpg",
  "http://oss.image.51vtv.cn/homepage/20210126/79be9e50defc23c9cf27b6e4d3557715.jpg",
  "http://oss.image.51vtv.cn/homepage/20210126/7ade1aff468a714a4952b879407f0dda.jpg",
  "http://oss.image.51vtv.cn/homepage/20210126/834af2f27c80f1b5649e4fc85528f8b2.jpg",
  "http://oss.image.51vtv.cn/homepage/20210126/b2416486477f88446cd32034dd86913e.png",
  "http://oss.image.51vtv.cn/homepage/20210126/b4a6242d05ebb706b97af2591ac93613.jpg",
  "http://oss.image.51vtv.cn/homepage/20210126/b6236bd4fb8d47f3e0d92ff22768712d.jpg",
  "http://oss.image.51vtv.cn/homepage/20210126/b96f14f213284eda5012172618a35d3b.jpg",
  "http://oss.image.51vtv.cn/homepage/20210126/bf2107b3698a52e049d4fb9888e414fe.jpg",
  "http://oss.image.51vtv.cn/homepage/20210126/c46efead037285885d9040f43f3492a4.png",
  "http://oss.image.51vtv.cn/homepage/20210126/c560347ad13d0d09a3d4e1bb2ac89939.jpg",
  "http://oss.image.51vtv.cn/homepage/20210126/cd2cab8ae4295e01cd58253f0a28d38a.jpg",
  "http://oss.image.51vtv.cn/homepage/20210126/d9410b47a10a72f6bd834618fbfbdb63.jpg",
  "http://oss.image.51vtv.cn/homepage/20210126/f49ef8b3e180a87f4398f2774b6a64bb.jpg",
  "http://oss.image.51vtv.cn/homepage/20210126/f6b094f4f060516fc746eba8752fc95f.jpg",
  "http://oss.image.51vtv.cn/homepage/20210120/08aa64361a76057a936acd9d4e52deea.jpg",
  "http://oss.image.51vtv.cn/homepage/20210120/12b6d2ce7fef880bac9cdf5a4f597e8c.png",
  "http://oss.image.51vtv.cn/homepage/20210120/1f5782bc2beebf417c5fd2adada87254.jpg",
  "http://oss.image.51vtv.cn/homepage/20210120/4c6f0bdae3f916286709894164fbabed.jpg",
  "http://oss.image.51vtv.cn/homepage/20210120/6e49a315cbb44cbf2ab88bd61b19f6b2.jpg",
  "http://oss.image.51vtv.cn/homepage/20210120/80fcd313f18c2461ea4c57adca22a13b.jpg",
  "http://oss.image.51vtv.cn/homepage/20210120/850263b2f4ac20693066bffcbb2d723a.jpg",
  "http://oss.image.51vtv.cn/homepage/20210120/bb754b4afc86bc17e57f1444d0938cbb.jpg",
  "http://oss.image.51vtv.cn/homepage/20210120/c90bd75eba1b9c72b2b44fb0ad726166.png",
  "http://oss.image.51vtv.cn/homepage/20210120/cf6ff9c82cc98a758ae60a2b4804cc32.png",
  "http://oss.image.51vtv.cn/homepage/20210120/e01f7846b9275a936a2585f4ad8af56d.png",
  "http://oss.image.51vtv.cn/homepage/20210119/052aee1bb6088e306e92f291a697abb1.png",
  "http://oss.image.51vtv.cn/homepage/20210119/075409a3adab7de6279ece1087450e96.jpg",
  "http://oss.image.51vtv.cn/homepage/20210119/0e8b26fdb0e1105c2e764854bbaec424.png",
  "http://oss.image.51vtv.cn/homepage/20210119/11606bed6bd50f22197e562ea3a9e352.jpg",
  "http://oss.image.51vtv.cn/homepage/20210119/192491e0ebea2e53171f6f2996975557.png",
  "http://oss.image.51vtv.cn/homepage/20210119/27f099cd259ed99b41ac55644156b329.jpg",
  "http://oss.image.51vtv.cn/homepage/20210119/305b76132b1ff08523942fd8521fa48e.png",
  "http://oss.image.51vtv.cn/homepage/20210119/36c9beacca8a475a4c5c40119a59a638.jpg",
  "http://oss.image.51vtv.cn/homepage/20210119/3f7872fa4c8377ac519df62b54feaaf0.jpg",
  "http://oss.image.51vtv.cn/homepage/20210119/43f9eadb526ca4f0a8c97a6d7f58e3fd.jpg",
  "http://oss.image.51vtv.cn/homepage/20210119/5c640c74d132e1ab8bd991c4810467aa.jpg",
  "http://oss.image.51vtv.cn/homepage/20210119/6350f650daa5d24a33b952e65bf30980.jpg",
  "http://oss.image.51vtv.cn/homepage/20210119/706f75cc134deffd66ab71ea88bd48cf.jpg",
  "http://oss.image.51vtv.cn/homepage/20210119/72f36915efc8f095517370ab85a33993.jpg",
  "http://oss.image.51vtv.cn/homepage/20210119/74853e8d4ee92d3d97926e26479aa0e5.jpg",
  "http://oss.image.51vtv.cn/homepage/20210119/7639ec683e5fc5a4359de52e6f3ce20a.jpg",
  "http://oss.image.51vtv.cn/homepage/20210119/79637cde587b70e4d02f6fc568f5ab67.jpg",
  "http://oss.image.51vtv.cn/homepage/20210119/7b85b9c16a3983c789d5d8fb7c4de981.jpg",
  "http://oss.image.51vtv.cn/homepage/20210119/878817deae40402ce8621f37221a048c.jpg",
  "http://oss.image.51vtv.cn/homepage/20210119/89974ef71e1d8d43db962ec4c78f2558.jpg",
  "http://oss.image.51vtv.cn/homepage/20210119/c0e6f8bb6314d43b6291e02c7a4dd8ad.jpg",
  "http://oss.image.51vtv.cn/homepage/20210119/c71ade6ebdaf3c10af5aaae2a0194230.jpg",
  "http://oss.image.51vtv.cn/homepage/20210119/f7ebbca79748ba955aac66e6fb1e4488.png",
  "http://oss.image.51vtv.cn/homepage/20210119/f97df482516779afb447b9ff9fa4f020.png",
  "http://oss.image.51vtv.cn/homepage/20210112/003dc31d9387f63b4eb2f71fd7be39f8.jpg",
  "http://oss.image.51vtv.cn/homepage/20210112/047f92901fbfb2471347ca82dbb3d194.jpg",
  "http://oss.image.51vtv.cn/homepage/20210112/09e3b30671cfd68bc8d72dcdeff6cb49.png",
  "http://oss.image.51vtv.cn/homepage/20210112/0f9e37671c3d955bee9cd7edb60777da.jpg",
  "http://oss.image.51vtv.cn/homepage/20210112/15a789a7be01dbb59faed370f0ecf513.jpg",
  "http://oss.image.51vtv.cn/homepage/20210112/1b5fc133d7a72cda80d30f58c2c7cb51.jpg",
  "http://oss.image.51vtv.cn/homepage/20210112/21850ab05cabf37f135cef2f58a9f312.jpg",
  "http://oss.image.51vtv.cn/homepage/20210112/24de55575213cd891075af5037211913.jpg",
  "http://oss.image.51vtv.cn/homepage/20210112/2a5eea67259b017c3e95232233c5b7da.jpg",
  "http://oss.image.51vtv.cn/homepage/20210112/33d7f2d0237d90fdc7bfe9a60fac2b07.jpg",
  "http://oss.image.51vtv.cn/homepage/20210112/3ea222e852bd5fd4847b1bc1590aa219.jpg",
  "http://oss.image.51vtv.cn/homepage/20210112/64cedc99deb2f5c1b15bc455415fbc1e.jpg",
  "http://oss.image.51vtv.cn/homepage/20210112/71608b817698cfe5a5fc279fd2ec4180.jpg",
  "http://oss.image.51vtv.cn/homepage/20210112/7403712eaeec3a74d519499133a4cf30.jpg",
  "http://oss.image.51vtv.cn/homepage/20210112/7b886954aa4d7015b74aa24fcbd91606.jpg",
  "http://oss.image.51vtv.cn/homepage/20210112/7d3e6534651e24d22506c332c328fff9.jpg",
  "http://oss.image.51vtv.cn/homepage/20210112/7e151d6d295cbdc3f96a3bbd7bdcdc5a.jpg",
  "http://oss.image.51vtv.cn/homepage/20210112/7f8ab01b5e96ef7e944eaccd73da0166.jpg",
  "http://oss.image.51vtv.cn/homepage/20210112/865831134f5ecfe414f4d6c3070c510a.jpg",
  "http://oss.image.51vtv.cn/homepage/20210112/8d3fa93b3a10726e3bc3167d0632b3c0.png",
  "http://oss.image.51vtv.cn/homepage/20210112/94e3f58530ce24b5e5ee9058c0881835.jpg",
  "http://oss.image.51vtv.cn/homepage/20210112/a2f030dd1c595a8a87b317054403f48e.jpg",
  "http://oss.image.51vtv.cn/homepage/20210112/a577d7521f8379f19de30c2d2de1b1f0.jpg",
  "http://oss.image.51vtv.cn/homepage/20210112/af9c4da2fd667d7a66631095f9ed34b3.jpg",
  "http://oss.image.51vtv.cn/homepage/20210112/bc56f9d8c52f16461d2ce64336f63299.jpg",
  "http://oss.image.51vtv.cn/homepage/20210112/bcbf58edf74a5091e1334f8b336d32e2.jpg",
  "http://oss.image.51vtv.cn/homepage/20210112/ca8fa53d6dbf9384dc4c80bd48696a7e.png",
  "http://oss.image.51vtv.cn/homepage/20210112/cf6ff9c82cc98a758ae60a2b4804cc32.png",
  "http://oss.image.51vtv.cn/homepage/20210112/d5373b6c13f958bad48bb4d009f499b6.jpg",
  "http://oss.image.51vtv.cn/homepage/20210112/d816a32a0c0953c21306c524d6fb10e5.jpg",
  "http://oss.image.51vtv.cn/homepage/20210112/d9e42610c08e350eb2c30f718ee1bce6.jpg",
  "http://oss.image.51vtv.cn/homepage/20210112/e26564086d8dd74767b70ad616598112.jpg",
  "http://oss.image.51vtv.cn/homepage/20210112/e7217e6b7861ee65ed81cfcac6798892.jpg",
  "http://oss.image.51vtv.cn/homepage/20210112/eebdc81a92208ce5161b0891b1979ebd.jpg",
  "http://oss.image.51vtv.cn/homepage/20210112/f225ba492766f1f1db0d474570581f68.jpg",
]
const data = [];

for (let i = 0; i < urlList.length; i++) {
  let obj = {
    url: urlList[i],
    w: 200,
    h: 200,
    id: i
  }
  data.push(obj);
}

class Item extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      focus: false,
    }
  }

  focus() {
    this.setState({
      focus: true,
    })
  }

  blur() {
    this.setState({
      focus: false,
    })
  }

  render() {
    let item = this.props.data;
    let w = item.w - 10;
    let h = item.h - 10;
    return (
      <div>
        <div>
          <img style={{ width: w, height: h, fontSize: "20px" }} src={`url(${item.url})`} />
          <div style={{ width: w, height: h, color: "#FFFFFF", fontSize: "20px", backgroundColor: "rgba(0,0,0,0.3)" }}>
            {item.id + "\n" + item.url}
          </div>
        </div>

        {this.state.focus ? <div style={{ left: w - 20, top: 0, width: 20, height: 20, backgroundColor: "#00FF00" }}></div> : null}
      </div>
    )
  }
}

class MainScene extends FocusBlock {
  constructor(props) {
    super(props);
    this._measures = this._measures.bind(this);
  }

  _measures(item) {
    return SimpleWidget.getMeasureObj(item.w, item.h, true, false);
  }

  _renderItem(item, on_edge, query, view_obj) {
    return (
      <Item ref={ele => view_obj.view = ele} data={item} />
    )
  }

  _onItemBlur(data, qurey, view_obj) {
    if (view_obj && view_obj.view) {
      view_obj.view.blur();
    }
  }

  _onItemFocus(item, pre_dege, query, view_obj) {
    if (view_obj && view_obj.view) {
      view_obj.view.focus();
    }
  }

  onKeyDown(ev) {
    if (ev.keyCode === 10000 || ev.keyCode === 27) {
      if (this._NavigateHome) {
        this._NavigateHome();
      }
    }
    return true;
  }

  onFocus() {
    this.changeFocus(`${this.props.branchName}/widget1`);
  }

  renderContent() {
    return (
      <div style={{ width: 1920, height: 1080, backgroundColor: "#334C4C" }}>
        <div style={{ left: 50, top: 20, width: 1000, height: 200, color: "#FFFFFF", fontSize: "30px" }}>
          {`加载中就移出屏幕的图片，会取消下载和解码以提升速度`}
        </div>
        <div style={{ left: 50, top: 100 }}>
          <SimpleWidget
            width={1000}
            height={600}
            direction={VERTICAL}
            data={data}
            renderItem={this._renderItem}
            onItemFocus={this._onItemFocus}
            onItemBlur={this._onItemBlur}
            measures={this._measures}
            branchName={`${this.props.branchName}/widget1`}
          />
        </div>
      </div>
    );
  }
}

const App = createStandaloneApp(MainScene);

export {
  App, // 独立运行时的入口
  MainScene as SubApp, // 作为导航页的子入口时
};
