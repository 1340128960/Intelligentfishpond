// 地理数据
const geoData = {
    provinces: {
        '广东省': {
            avgTemp: 22,
            altitude: '平原为主',
            cities: {
                '广州市': {
                    climate: '亚热带季风气候',
                    suitability: 0.9,
                    counties: ['天河区', '海珠区', '越秀区', '白云区', '黄埔区', '番禺区']
                },
                '深圳市': {
                    climate: '亚热带海洋性气候',
                    suitability: 0.85,
                    counties: ['福田区', '罗湖区', '南山区', '宝安区', '龙岗区', '龙华区']
                }
            }
        },
        '福建省': {
            avgTemp: 20,
            altitude: '丘陵山地为主',
            cities: {
                '福州市': {
                    climate: '亚热带海洋性季风气候',
                    suitability: 0.88,
                    counties: ['鼓楼区', '台江区', '仓山区', '马尾区', '晋安区']
                },
                '厦门市': {
                    climate: '亚热带海洋性季风气候',
                    suitability: 0.87,
                    counties: ['思明区', '湖里区', '集美区', '海沧区', '同安区']
                }
            }
        },
        '浙江省': {
            avgTemp: 18,
            altitude: '丘陵山地为主',
            cities: {
                '杭州市': {
                    climate: '亚热带季风气候',
                    suitability: 0.86,
                    counties: ['上城区', '下城区', '江干区', '拱墅区', '西湖区']
                },
                '宁波市': {
                    climate: '亚热带海洋性季风气候',
                    suitability: 0.85,
                    counties: ['海曙区', '江北区', '北仑区', '镇海区', '鄞州区']
                }
            }
        },
        '江苏省': {
            avgTemp: 17,
            altitude: '平原为主',
            cities: {
                '南京市': {
                    climate: '亚热带季风气候',
                    suitability: 0.83,
                    counties: ['玄武区', '秦淮区', '建邺区', '鼓楼区', '浦口区']
                },
                '苏州市': {
                    climate: '亚热带季风气候',
                    suitability: 0.84,
                    counties: ['姑苏区', '虎丘区', '吴中区', '相城区', '吴江区']
                }
            }
        },
        '湖南省': {
            avgTemp: 19,
            altitude: '丘陵山地为主',
            cities: {
                '长沙市': {
                    climate: '亚热带季风气候',
                    suitability: 0.82,
                    counties: ['芙蓉区', '天心区', '岳麓区', '开福区', '雨花区']
                },
                '株洲市': {
                    climate: '亚热带季风气候',
                    suitability: 0.81,
                    counties: ['天元区', '荷塘区', '芦淞区', '石峰区', '渌口区']
                }
            }
        }
    }
}; 