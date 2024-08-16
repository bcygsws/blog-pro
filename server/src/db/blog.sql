/*
 Navicat Premium Data Transfer

 Source Server         : localhost_3306
 Source Server Type    : MySQL
 Source Server Version : 80034
 Source Host           : localhost:3306
 Source Schema         : blog

 Target Server Type    : MySQL
 Target Server Version : 80034
 File Encoding         : 65001

 Date: 17/08/2024 05:38:10
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for admin
-- ----------------------------
DROP TABLE IF EXISTS `admin`;
CREATE TABLE `admin`  (
  `id` bigint(0) NOT NULL,
  `account` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `token` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of admin
-- ----------------------------
INSERT INTO `admin` VALUES (1, 'admin', '123456', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiYWNjb3VudCI6ImFkbWluIiwicGFzc3dvcmQiOiIxMjM0NTYiLCJpYXQiOjE3MjM4MzUyODcsImV4cCI6MTcyMzg0MjQ4N30.CyKAAZGOHzntioAs58_yQKX5PIbnbEF2w5Kof4ROn0g');

-- ----------------------------
-- Table structure for blog
-- ----------------------------
DROP TABLE IF EXISTS `blog`;
CREATE TABLE `blog`  (
  `id` bigint(0) NOT NULL,
  `category_id` bigint(0) NULL DEFAULT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `create_time` bigint(0) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of blog
-- ----------------------------
INSERT INTO `blog` VALUES (566843563062324, 1, '倚天屠龙记明教五散人', '明初，明教在时任教主张无忌的领导下，逐渐壮大；在江湖上，成为一支重要的抗元力量；待张无忌归隐后，明教在朱元璋、徐达等人领导下，逐步攻灭陈友谅、张士诚等义军势力，最终统一天下，建立明朝', 1716226341763);
INSERT INTO `blog` VALUES (566844003078312, 2, '金庸先生：飞雪连天射白鹿，笑书神侠倚碧鸳！', '行女哀辞-情忽忽而失度', 1716239261258);
INSERT INTO `blog` VALUES (566892788713941, 1, '明教壮大了', '明初，明教在时任教主张无忌的领导下，逐渐壮大；在江湖上，成为一支重要的抗元力量；待张无忌归隐后，明教在朱元璋、徐达等人领导下，逐步攻灭陈友谅、张士诚等义军势力，最终统一天下，建立明朝', 1716238359744);
INSERT INTO `blog` VALUES (570034181755949, 567504011911237, 'fdasf', '<p>hellofasd</p>', 1717005301405);
INSERT INTO `blog` VALUES (570038629855331, 568658331349061, '许家印破产', '许家印商业德国的崩溃', 1717006387367);
INSERT INTO `blog` VALUES (570075966087437, 568662000779333, '完美中锋范巴斯滕', '足球ffgaggggggggg', 1717015502658);
INSERT INTO `blog` VALUES (570091409068111, 568658331349061, '成龙新电影宣发', '<p>hello<img src=\"http://localhost:8080/upload/570090275553349.jpg\" alt=\"本地上传图片\" data-href=\"\" style=\"\"/></p>', 1717019272917);
INSERT INTO `blog` VALUES (570092814852175, 568662000779333, '相逢何必曾相识', '<p>hello<img src=\"https://s1.imagehub.cc/images/2023/07/13/img32.md.jpeg\" alt=\"\" data-href=\"\" style=\"\"/></p>', 1717019616126);
INSERT INTO `blog` VALUES (570093839786153, 568658331349061, '莫愁前路无知己', '<p>hello<img src=\"https://s1.imagehub.cc/images/2023/07/13/img32.md.jpeg\" alt=\"\" data-href=\"\" style=\"\"/></p>', 1717019866354);
INSERT INTO `blog` VALUES (570406890934541, 568662374527045, '开国中将温玉成', '<p><br></p><p>温玉成（1915-1989），江西兴国人，开国中将，中国人民解放军优秀的军事指挥员和政治工作者，曾任人民解放军副总参谋长兼北京卫戍区司令员、成都军区第一副司令员等职务。1955年被授予中将军衔。<sup><em> [1]</em></sup>荣获八一勋章、独立自由勋章、解放勋章。是中国共产党第七次、第九次全国代表大会代表，第九届中央委员会委员。1989年10月29日在南京逝世。</p>', 1717096294857);
INSERT INTO `blog` VALUES (570805838061737, 568920250589253, '杭州西湖旅游爆火', '<p>杭州西湖风景名胜区，位于浙江省杭州市西湖区龙井路1号，分为湖滨区、湖心区、北山区、南山区和钱塘区，总面积达59.04平方千米，其中湖面6.38平方千米，外围保护区面积35.64平方千米。<sup><em> [13] [22]</em></sup></p><p>杭州西湖风景名胜区主要景点122处，其中：特级景点26处，一级景点25处，二级景点39处，三级景点21处，四级景点11处；有国家重点文物保护单位5处，省级文物保护单位35处，市级文物保护单位25处，还有39处文物保护点和各类专题博物馆点缀其中。<sup><em> [13]</em></sup><sup> [22]</sup></p>', 1717193694058);
INSERT INTO `blog` VALUES (571352784179369, 567504011911237, '成龙新电影杀青', '<p>hello冯大哥反反复复fdsaaaaaaaaaaaaaafd</p>', 1717327225825);
INSERT INTO `blog` VALUES (571400739172621, 567504011911237, '于和伟新剧杀青', '<p>hello阿凡达是是是少时诵诗书是撒是撒是撒是撒深</p>', 1717338933587);
INSERT INTO `blog` VALUES (571402217017463, 1, '《破碎的梦》', '<p>hello发生顶顶顶顶的点点滴滴哒哒哒哒哒哒哒哒哒</p>', 1717339623193);
INSERT INTO `blog` VALUES (571404570443945, 2, '电影《花木兰》全国公映票房创纪录', '<p>hellofsasfaaaaaaaaaaaaaaaaaaaaf</p>', 1717339868956);
INSERT INTO `blog` VALUES (571404872843533, 1, '音乐展演《二泉映月》', '<p>hello发生顶顶顶顶的点点滴滴哒哒哒哒哒哒哒哒哒哒哒哒 </p><p><img src=\"http://localhost:8081/upload/597658284322885.gif\" alt=\"本地上传图片\" data-href=\"\" style=\"\"/></p>', 1723749470229);
INSERT INTO `blog` VALUES (571718602887337, 567504011911237, '测试1', '<p>hello11</p>', 1717416537033);
INSERT INTO `blog` VALUES (597651822899269, 567504011911237, '金庸武侠世界', '<p>abc金庸武侠世界：岁月静好</p>', 1723835316487);
INSERT INTO `blog` VALUES (5717187510436753, 568661791567941, 'hello', '<p>测试1</p>', 1717416573204);

-- ----------------------------
-- Table structure for category
-- ----------------------------
DROP TABLE IF EXISTS `category`;
CREATE TABLE `category`  (
  `id` bigint(0) NOT NULL,
  `name` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of category
-- ----------------------------
INSERT INTO `category` VALUES (1, '唱响金曲');
INSERT INTO `category` VALUES (2, '阿里影业');
INSERT INTO `category` VALUES (567504011911237, '娱乐新闻');
INSERT INTO `category` VALUES (568658331349061, '财经新闻');
INSERT INTO `category` VALUES (568661791567941, '金融板块');
INSERT INTO `category` VALUES (568662000779333, '足球新闻');
INSERT INTO `category` VALUES (568662374527045, '人生知己');
INSERT INTO `category` VALUES (568913852596293, '农业频道');
INSERT INTO `category` VALUES (568920250589253, '都市生活圈');

-- ----------------------------
-- Table structure for my_list
-- ----------------------------
DROP TABLE IF EXISTS `my_list`;
CREATE TABLE `my_list`  (
  `id` bigint(0) NOT NULL,
  `art_id` bigint(0) NULL DEFAULT NULL,
  `img` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `content` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `com_time` bigint(0) NULL DEFAULT NULL,
  `fav` bigint(0) NULL DEFAULT NULL,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of my_list
-- ----------------------------
INSERT INTO `my_list` VALUES (597652069474373, 597651822899269, 'https://s1.imagehub.cc/images/2023/07/13/img20.th.jpeg', '测试abc', 1723747949774, 13, '597652069474374');
INSERT INTO `my_list` VALUES (597652157009989, 597651822899269, 'https://s1.imagehub.cc/images/2023/07/13/img20.th.jpeg', '测试-一身转战三千里', 1723747971145, 4, '597652157009990');
INSERT INTO `my_list` VALUES (597652211568709, 597651822899269, 'https://s1.imagehub.cc/images/2023/07/13/img20.th.jpeg', '测试-理论力学', 1723747984465, 4, '597652211568710');
INSERT INTO `my_list` VALUES (597652265807941, 597651822899269, 'https://s1.imagehub.cc/images/2023/07/13/img30.th.jpeg', '测试-abcdefg', 1723747997707, 2, 'admin');
INSERT INTO `my_list` VALUES (597652351520837, 597651822899269, 'https://s1.imagehub.cc/images/2023/07/13/img30.th.jpeg', '测试-xyz', 1723748018633, 9, '597652351520838');
INSERT INTO `my_list` VALUES (597652519518277, 597651822899269, 'https://s1.imagehub.cc/images/2023/07/13/img30.th.jpeg', '测试-红尘', 1723748059648, 2, '597652519518278');
INSERT INTO `my_list` VALUES (597652570566725, 597651822899269, 'https://s1.imagehub.cc/images/2023/07/13/img30.th.jpeg', '测试-haghhaag', 1723748072111, 2, '597652570566726');
INSERT INTO `my_list` VALUES (597652607488069, 597651822899269, 'https://s1.imagehub.cc/images/2023/07/13/img30.th.jpeg', '测试-aghghghg', 1723748081125, 2, '597652607488070');
INSERT INTO `my_list` VALUES (597652810108997, 597651822899269, 'https://s1.imagehub.cc/images/2023/07/13/img30.th.jpeg', '测试-哈孤鸿寡鹄gag', 1723748130593, 2, '597652810108998');
INSERT INTO `my_list` VALUES (597652887822405, 597651822899269, 'https://s1.imagehub.cc/images/2023/07/13/img20.th.jpeg', '测试-湖广会馆', 1723748149566, 2, '597652887822406');
INSERT INTO `my_list` VALUES (597652954406981, 597651822899269, 'https://s1.imagehub.cc/images/2023/07/13/img30.th.jpeg', '测试-哈孤鸿寡鹄gagfafgg', 1723748165822, 4, '597652954406982');
INSERT INTO `my_list` VALUES (597653140471877, 597651822899269, 'https://s1.imagehub.cc/images/2023/07/13/img30.th.jpeg', '测试-hghgfaggghfalfajlfaf', 1723748211248, 1, '597653140471878');
INSERT INTO `my_list` VALUES (597653364584517, 597651822899269, 'https://s1.imagehub.cc/images/2023/07/13/img27.th.jpeg', '测试-ashggggggggggggggggggaera', 1723748265964, 7, 'admin');
INSERT INTO `my_list` VALUES (597653774065733, 597651822899269, 'https://s1.imagehub.cc/images/2023/06/28/img4.th.jpeg', '测试-hfahghagxfafagfafaffafxxfaaf', 1723748365934, 1, '597653774065734');
INSERT INTO `my_list` VALUES (597655548735557, 5717187510436753, 'https://s1.imagehub.cc/images/2023/07/13/img27.th.jpeg', '测试-abcdefg', 1723748799203, 0, '597655548735558');
INSERT INTO `my_list` VALUES (597655608782917, 5717187510436753, 'https://s1.imagehub.cc/images/2023/07/13/img20.th.jpeg', '测试-阿合格寡核苷酸发顺丰噶司法过', 1723748813863, 2, '597655608782918');
INSERT INTO `my_list` VALUES (597655649235013, 5717187510436753, 'https://s1.imagehub.cc/images/2023/06/28/img4.th.jpeg', '测试-哈哈嗝孤鸿寡鹄嘎哈尴尬啥', 1723748823739, 1, '597655649235014');
INSERT INTO `my_list` VALUES (597655782891589, 5717187510436753, 'https://s1.imagehub.cc/images/2023/07/13/img20.th.jpeg', '测试-fagghbhag发啊怪咖好尬', 1723748856371, 0, '597655782895685');
INSERT INTO `my_list` VALUES (597655876677701, 5717187510436753, 'https://s1.imagehub.cc/images/2023/07/13/img20.th.jpeg', 'ceshi-fashgjgahghgagaggaagga', 1723748879267, 1, '597655876677702');
INSERT INTO `my_list` VALUES (597655916269637, 5717187510436753, 'https://s1.imagehub.cc/images/2023/07/13/img20.th.jpeg', 'ceshi-ahsghahgagghghaggagh', 1723748888933, 3, '597655916269638');
INSERT INTO `my_list` VALUES (597655957069893, 5717187510436753, 'https://s1.imagehub.cc/images/2023/07/13/img21.th.jpeg', '测试-ajhghghg', 1723748898894, 3, '597655957069894');
INSERT INTO `my_list` VALUES (597656522715205, 570038629855331, 'https://s1.imagehub.cc/images/2023/07/13/img21.th.jpeg', '测试-xjy', 1723749036991, 4, '597656522715206');
INSERT INTO `my_list` VALUES (597658057556037, 570805838061737, 'https://s1.imagehub.cc/images/2023/07/13/img21.th.jpeg', 'fafasfasfa', 1723749411708, 2, '597658057556038');
INSERT INTO `my_list` VALUES (598002282672197, 597651822899269, 'https://s1.imagehub.cc/images/2023/07/13/img27.th.jpeg', '测试-xxx', 1723833451043, 14, '598002282672198');
INSERT INTO `my_list` VALUES (598004253724741, 597651822899269, 'https://s1.imagehub.cc/images/2023/07/13/img27.th.jpeg', '测试-ABCDEFGHIJKLMN', 1723833932257, 9, '598004253724742');
INSERT INTO `my_list` VALUES (598007183401029, 597651822899269, 'https://s1.imagehub.cc/images/2023/07/13/img20.th.jpeg', '测试-南方科技大学', 1723834647510, 0, '598007183401030');
INSERT INTO `my_list` VALUES (598009529462853, 597651822899269, 'https://s1.imagehub.cc/images/2023/07/13/img21.th.jpeg', '测试-xxxx', 1723835220279, 0, '598009529462854');
INSERT INTO `my_list` VALUES (598017340809285, 597651822899269, 'https://s1.imagehub.cc/images/2023/07/13/img27.th.jpeg', '测试-abcdefgfsaf', 1723837127346, 0, '598017340809286');
INSERT INTO `my_list` VALUES (598019646001221, 597651822899269, 'https://s1.imagehub.cc/images/2023/06/28/img4.th.jpeg', '测试-abcdefgaffafagg', 1723837690137, 4, '598019646001222');

SET FOREIGN_KEY_CHECKS = 1;
