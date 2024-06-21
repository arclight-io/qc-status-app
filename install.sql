/*
安装之前，请将 prefix_ 替换为你自己的表前缀
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for desns_tiezi
-- ----------------------------
DROP TABLE IF EXISTS `prefix_tiezi`;
CREATE TABLE `prefix_tiezi`  (
  `domain` varchar(128) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `tid` bigint UNSIGNED NOT NULL,
  `sender` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `parent_domain` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NULL DEFAULT NULL,
  `parent_tid` bigint NULL DEFAULT NULL,
  `content_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `sendtime` bigint NOT NULL,
  PRIMARY KEY (`domain`, `tid`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_bin ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;