<?php

$CC = array();

// 直辖市, 特别行政区
$CC['北京'] = '54511';
$CC['天津'] = '54517';
$CC['重庆'] = '57516';
$CC['上海'] = '58367';
$CC['香港'] = '45005';
$CC['澳门'] = '45011';

// 省,自治区
$CC['河北'] = array('石家庄' => '53698', '唐山' => '54534', '秦皇岛' => '54449', '邯郸' => '53892', '邢台' => '53798', '保定' => '54602', '张家口' => '54401', '承德' => '54423', '沧州' => '54616', '廊坊' => '54515', '衡水' => '54702');
$CC['山西'] = array('太原' => '53772', '大同' => '53487', '阳泉' => '53782', '长治' => '53882', '晋城' => '53976', '朔州' => '53578', '晋中' => '53778', '运城' => '53959', '忻州' => '53674', '临汾' => '53868', '吕梁地' => '71037');
$CC['内蒙古'] = array('呼和浩特' => '53463', '包头' => '53446', '乌海' => '53512', '赤峰' => '54218', '通辽' => '54135', '鄂尔多斯' => '53543', '呼伦贝尔' => '99999', '乌兰察布' => '70402', '锡林郭勒' => '60149', '巴彦淖尔' => '70381', '阿拉善' => '60356', '兴安' => '60001');
$CC['辽宁'] = array('沈阳' => '54342', '大连' => '54662', '鞍山' => '54339', '抚顺' => '54353', '本溪' => '54346', '丹东' => '54497', '锦州' => '54337', '葫芦岛' => '54453', '营口' => '54471', '盘锦' => '54338', '阜新' => '54237', '辽阳' => '54347', '铁岭' => '54249', '朝阳' => '54324');
$CC['吉林'] = array('长春' => '54161', '吉林' => '54172', '四平' => '54157', '辽源' => '54260', '通化' => '54363', '白山' => '54371', '松原' => '50946', '白城' => '50936', '延边' => '99999');
$CC['黑龙江'] = array('哈尔滨' => '50953', '齐齐哈尔' => '50745', '鹤岗' => '50775', '双鸭山' => '50884', '鸡西' => '50978', '大庆' => '50842', '伊春' => '50774', '牡丹江' => '54094', '佳木斯' => '50873', '七台河' => '50971', '黑河' => '50468', '绥化' => '50853', '大兴安岭' => '50442');
$CC['江苏'] = array('南京' => '58238', '徐州' => '58027', '连云港' => '58044', '淮安' => '58145', '宿迁' => '58131', '盐城' => '58151', '扬州' => '58245', '泰州' => '58246', '南通' => '58259', '镇江' => '58248', '常州' => '58343', '无锡' => '58354', '苏州' => '58357');
$CC['浙江'] = array('杭州' => '58457', '宁波' => '58563', '温州' => '58659', '嘉兴' => '58452', '湖州' => '58450', '绍兴' => '58453', '金华' => '58549', '衢州' => '58633', '舟山' => '58477', '台州' => '58660', '丽水' => '58646');
$CC['安徽'] = array('合肥' => '58321', '芜湖' => '58334', '蚌埠' => '58221', '淮南' => '58224', '马鞍山' => '58336', '淮北' => '58116', '铜陵' => '58429', '安庆' => '58424', '黄山' => '58437', '滁州' => '58236', '阜阳' => '58203', '宿州' => '58122', '巢湖' => '58326', '六安' => '58311', '亳州' => '58102', '池州' => '58427', '宣城' => '58433');
$CC['福建'] = array('福州' => '58847', '厦门' => '59134', '三明' => '58828', '莆田' => '58946', '泉州' => '59137', '漳州' => '59126', '南平' => '58834', '龙岩' => '58927', '宁德' => '58846');
$CC['江西'] = array('南昌' => '58606', '景德镇' => '58527', '萍乡' => '57786', '九江' => '58502', '新余' => '57796', '鹰潭' => '58627', '赣州' => '57993', '吉安' => '57799', '宜春' => '57793', '抚州' => '58617', '上饶' => '58637');
$CC['山东'] = array('济南' => '54823', '青岛' => '54857', '淄博' => '54830', '枣庄' => '58024', '东营' => '54736', '潍坊' => '54843', '烟台' => '54765', '威海' => '54774', '济宁' => '54915', '泰安' => '54827', '日照' => '54945', '莱芜' => '54828', '临沂' => '54938', '德州' => '54714', '聊城' => '54806', '滨州' => '54734', '菏泽' => '54906');
$CC['河南'] = array('郑州' => '57083', '开封' => '57091', '洛阳' => '57073', '平顶山' => '57171', '焦作' => '53982', '鹤壁' => '53990', '新乡' => '53986', '安阳' => '53898', '濮阳' => '54900', '许昌' => '57089', '漯河' => '57186', '三门峡' => '57051', '南阳' => '57178', '商丘' => '58005', '信阳' => '57297', '周口' => '57195', '驻马店' => '57290');
$CC['湖北'] = array('武汉' => '57494', '黄石' => '58407', '襄樊' => '57278', '十堰' => '57256', '荆州' => '57476', '宜昌' => '57461', '荆门' => '57377', '鄂州' => '57496', '孝感' => '57482', '黄冈' => '57498', '咸宁' => '57590', '随州' => '57381', '恩施' => '57447');
$CC['湖南'] = array('长沙' => '57687', '株洲' => '57780', '湘潭' => '57773', '衡阳' => '57872', '邵阳' => '57766', '岳阳' => '57584', '常德' => '57662', '张家界' => '57558', '益阳' => '57674', '郴州' => '57972', '永州' => '57866', '怀化' => '57749', '娄底' => '57763', '湘西' => '60880');
$CC['广东'] = array('广州' => '59287', '深圳' => '59493', '珠海' => '59488', '汕头' => '59316', '韶关' => '59082', '河源' => '59293', '梅州' => '59117', '惠州' => '59298', '汕尾' => '59501', '东莞' => '59289', '中山' => '59485', '江门' => '59473', '佛山' => '59279', '阳江' => '59663', '湛江' => '59658', '茂名' => '59659', '肇庆' => '59278', '清远' => '59280', '潮州' => '59312', '揭阳' => '59315', '云浮' => '59471');
$CC['广西'] = array('南宁' => '59432', '柳州' => '59046', '桂林' => '57957', '梧州' => '59265', '北海' => '59644', '防城港' => '59635', '钦州' => '59632', '贵港' => '59249', '玉林' => '59453', '百色' => '59211', '贺州' => '59065', '河池' => '59023', '来宾' => '59242', '崇左' => '59425');
$CC['海南'] = array('海口' => '59758', '三亚' => '59948');
$CC['四川'] = array('成都' => '56294', '自贡' => '56396', '攀枝花' => '56666', '泸州' => '57602', '德阳' => '56198', '绵阳' => '56196', '广元' => '57206', '遂宁' => '57405', '内江' => '57504', '乐山' => '56386', '南充' => '57411', '宜宾' => '56492', '广安' => '57415', '达州' => '57328', '眉山' => '56391', '雅安' => '56287', '巴中' => '57313', '资阳' => '56298', '阿坝' => '56171', '甘孜' => '56146', '凉山' => '56571');
$CC['贵州'] = array('贵阳' => '57816', '六盘水' => '56693', '遵义' => '57713', '安顺' => '57806', '铜仁地' => '57741', '毕节地' => '57707', '黔西南' => '57907', '黔东南' => '57825', '黔南' => '60902');
$CC['云南'] = array('昆明' => '56778', '曲靖' => '56783', '玉溪' => '56875', '保山' => '56748', '昭通' => '56586', '思茅' => '56964', '临沧' => '56951', '丽江' => '56651', '文山' => '56994', '红河' => '56975', '西双版纳' => '60839', '楚雄' => '56768', '大理' => '56751', '德宏' => '56844', '怒江' => '56533', '迪庆' => '60843');
$CC['西藏'] = array('拉萨' => '55591', '那曲' => '55299', '昌都' => '56137', '山南' => '55598', '日喀则' => '55578', '阿里' => '55437', '林芝' => '56312');
$CC['陕西'] = array('西安' => '57036', '铜川' => '53947', '宝鸡' => '57016', '咸阳' => '57048', '渭南' => '57045', '延安' => '53845', '汉中' => '57127', '榆林' => '53646', '安康' => '57245', '商洛' => '57143');
$CC['甘肃'] = array('兰州' => '52889', '金昌' => '52675', '白银' => '52896', '天水' => '57006', '嘉峪关' => '70980', '武威' => '52679', '张掖' => '52652', '平凉' => '53915', '酒泉' => '52533', '庆阳' => '53829', '定西' => '52995', '陇南' => '60472', '甘南' => '50741', '临夏' => '52984');
$CC['青海'] = array('西宁' => '52866', '海东' => '52875', '海北' => '52754', '黄南' => '56065', '海南' => '52856', '果洛' => '56043', '玉树' => '56029', '海西' => '52737');
$CC['宁夏'] = array('银川' => '53614', '石嘴山' => '53518', '吴忠' => '53612', '固原' => '53817');
$CC['新疆'] = array('乌鲁木齐' => '51463', '克拉玛依' => '51243', '吐鲁番' => '51573', '哈密' => '52203', '和田' => '51828', '阿克苏' => '51628', '喀什' => '51709', '克孜勒苏' => '70791', '巴音郭楞' => '70827', '昌吉' => '51368', '博尔塔拉' => '60692', '伊犁' => '71051', '塔城' => '51133', '阿勒泰' => '51076');
$CC['台湾'] = array('台北' => '58968', '阿莲' => null, '安定' => null, '安平' => null, '八德' => null, '八里' => null, '白河' => null, '白沙' => null, '板桥' => null, '褒忠' => null, '宝山' => null, '卑南' => null, '北斗' => null, '北港' => null, '北门' => null, '北埔' => null, '北投' => null, '补子' => null, '布袋' => null, '草屯' => null, '长宾' => null, '长治' => null, '潮州' => null, '车城' => null, '成功' => null, '城中' => null, '池上' => null, '春日' => null, '刺桐' => null, '高雄' => '59554', '花莲' => null, '基隆' => null, '嘉义' => null, '苗栗' => null, '南投' => null, '屏东' => null, '台东' => '59562', '台南' => '59358', '台中' => '59158', '桃园' => null, '新竹' => null, '宜兰' => '59162', '彰化' => null);
//$CC['海外'] = array('其它地区' => null, '阿根廷' => null, '埃及' => null, '爱尔兰' => '03969', '奥地利' => '11034', '奥克兰' => null, '澳大利亚' => null, '巴基斯坦' => null, '巴西' => null, '保加利亚' => '15614', '比利时' => '06451', '冰岛' => '04030', '朝鲜' => null, '丹麦' => '06180', '德国' => '10385', '俄罗斯' => '27612', '法国' => '07149', '菲律宾' => '98429', '芬兰' => '02974', '哥伦比亚' => null, '韩国' => null, '荷兰' => '06240', '加拿大' => null, '柬埔寨' => null, '喀麦隆' => null, '老挝' => '48940', '卢森堡' => null, '罗马尼亚' => null, '马达加斯加' => null, '马来西亚' => null, '毛里求斯' => null, '美国' => null, '秘鲁' => null, '缅甸' => null, '墨西哥' => null, '南非' => null, '尼泊尔' => null, '挪威' => '01384', '葡萄牙' => '08579', '日本' => null, '瑞典' => '02464', '瑞士' => '06700', '斯里兰卡' => null, '泰国' => null, '土耳其' => '17128', '委内瑞拉' => null, '文莱' => null, '乌克兰' => '33345', '西班牙' => '08181', '希腊' => '16716', '新加坡' => '48698', '新西兰' => null, '匈牙利' => '12843', '以色列' => null, '意大利' => '16242', '印度' => null, '印度尼西亚' => '96747', '英国' => '03772', '越南' => null, '智利' => null);

