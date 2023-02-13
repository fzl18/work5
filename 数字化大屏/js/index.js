var app = new Vue({
    el: '#app',
    data: {
        message: '',
        companyProfile: {
            groupTotalRevenueIndustryRanking:{
                honoraryTitle: '集团总收入行业排名',
                rank: '',
            },
            profitTaxAndProfitIndustryRanking:{
                honoraryTitle: '利税和利润行业排名',
                rank: '',
            },
            perCapitaOutputValueRanking:{
                honoraryTitle: '人均产值排名',
                rank: '',
            },
            marketShareOfHighEndConveyorBelts: {
                honoraryTitle: '高端输送带市占率',
                rank: '',
            },  
            nationalEnterpriseTechnologyCenter:{
                honoraryTitle: '国家企业技术中心',
                rank: '',
            },
            nationalScienceAndTechnologyProgressAward:{
                honoraryTitle: '国家科学技术进步奖',
                rank: '',
            },
            yearsRevenueTrendOptions: yearsRevenueTrendSet()
        },
        greenIndex: {},
        technology: {
            introduce: [
                { active: true, year: '2010', desc: '2014.11成立全国石油和化工行业高性能输送带新材料及先进制造工程实验室;获得国家、省级重点新产品:2个;国家、行业标准制修订4项;' },
                { active: false, year: '2011', desc: '2015.;获得国家、省级重点新产品:2个;国家、行业标准制修订4项;' },
                { active: false, year: '2012', desc: '2016.11成立全国石油和化工行业高性能输送带新材料及先进制造工程实验室;:2个;国家、行业标准制修订4项;' },
                { active: false, year: '2013', desc: '2014.11成立全国石油和化工行业高性能输送带新材料及先进制造工程实验室;获得国家、省级重点新产品:2个;国家、行业标准制修订4项;' },
                { active: false, year: '2014', desc: '2014.11成立全国石油和化工行业高性能输送带新材料及先进制造工程实验室;获得国家、省级重点新产品:2个;国家、行业标准制修订4项;' },
                { active: false, year: '2015', desc: '2014.11成立全国石油和化工行业高性能输送带新材料及先进制造工程实验室;获得国家、省级重点新产品:2个;国家、行业标准制修订4项;' },
                { active: false, year: '2016', desc: '2014.11成立全国石油和化工行业高性能输送带新材料及先进制造工程实验室;获得国家、省级重点新产品:2个;国家、行业标准制修订4项;' },
                { active: false, year: '2017', desc: '2014.11成立全国石油和化工行业高性能输送带新材料及先进制造工程实验室;获得国家、省级重点新产品:2个;国家、行业标准制修订4项;' },
                { active: false, year: '2018', desc: '2014.11成立全国石油和化工行业高性能输送带新材料及先进制造工程实验室;获得国家、省级重点新产品:2个;国家、行业标准制修订4项;' },
                { active: false, year: '2019', desc: '2014.11成立全国石油和化工行业高性能输送带新材料及先进制造工程实验室;获得国家、省级重点新产品:2个;国家、行业标准制修订4项;' },
                { active: false, year: '2020', desc: '2014.11成立全国石油和化工行业高性能输送带新材料及先进制造工程实验室;获得国家、省级重点新产品:2个;国家、行业标准制修订4项;' },
            ],
            active: {
                year: '',
                desc: ''
            }
        },
        customerData: {},
        map: {
            mapData: [
                {
                    name: 'Azerbaijan',
                    data:
                    {
                        value: 100,
                        isBranch: false,
                        isDistributor: false,
                        types: "1,2,3",
                    }
                },
                {
                    name: 'United States of America',
                    data:
                    {
                        value: 100,
                        isBranch: false,
                        isDistributor: false,
                        types: "1,2,3",
                    }
                },
                {
                    name: 'Paraguay',
                    data:
                    {
                        value: 100,
                        isBranch: false,
                        isDistributor: false,
                        types: "1,2,3",
                    }
                },
                {
                    name: 'Mongolia',
                    data:
                    {
                        value: 100,
                        isBranch: false,
                        isDistributor: true,
                        types: "1,2,3",
                    }
                },
            ],
        },
        sales: {},
    },
    mounted() {
        //公司概况
        this.initCompanyProfile()
        //绿色指数
        this.initGreenIndex()
        //科技指数
        this.initTechnology()
        //研发
        this.initResearch()
        //客户分布
        this.initCustomerData()
        //地图部分
        this.initMap()
        //营销
        this.initSales()
        //客户服务
        this.initCustomerService()
        //员工
        this.initStaff()
        //质检
        this.initInspector()
        //运营
        this.initOperate()
    },
    methods: {
        //公司概况
        initCompanyProfile() {
            //签约订单量年度趋势
            let yearsRevenueTrendChart = echarts.init(this.$refs.yearsRevenueTrendChart)
            yearsRevenueTrendChart.setOption(this.companyProfile.yearsRevenueTrendOptions)
        },
        //绿色指数
        initGreenIndex() {
            //签约订单量年度趋势
            let carbonEmissionsTrendChart = echarts.init(this.$refs.carbonEmissionsTrendChart)
            let carbonEmissionsTrendOptions = carbonEmissionsTrendSet
            // 增加了一个隐藏的x轴，用来控制线图的点的位置
            carbonEmissionsTrendOptions.xAxis[1] = {
                type: 'value',
                max: carbonEmissionsTrendOptions.xAxis[0].data.length * 100,
                show: false
            }
            carbonEmissionsTrendOptions.series[2].data = carbonEmissionsTrendOptions.series[2].data.map((x, i) => [31 + i * 100, x])
            carbonEmissionsTrendOptions.series[3].data = carbonEmissionsTrendOptions.series[3].data.map((x, i) => [68 + i * 100, x])
            carbonEmissionsTrendChart.setOption(carbonEmissionsTrendOptions)
        },
        //科技指数
        initTechnology() {
            //轮播
            let swiper = new Swiper('.swiper-container', {
                effect: 'coverflow',
                loop: true,
                grabCursor: true,
                centeredSlides: true,
                autoplay: true,
                delay: 3000,
                slidesPerView: 'auto',
                coverflowEffect: {
                    rotate: 50,
                    stretch: 0,
                    depth: 100,
                    modifier: 1,
                    slideShadows: true,
                },
                pagination: {
                    el: '.swiper-pagination',
                },
            });

            //
            this.technology.active = {
                year: this.technology.introduce.length > 0 ? this.technology.introduce[0].year : '',
                desc: this.technology.introduce.length > 0 ? this.technology.introduce[0].desc : '',
            }
            //时间轴
            let index = 0
            let that = this
            function sell() {
                let myVar = setInterval(() => {
                    that.technology.introduce.forEach(item => item.active = false)
                    that.$set(that.technology.introduce[index], 'active', true)
                    that.$set(that.technology.active, 'year', that.technology.introduce[index].year)
                    that.$set(that.technology.active, 'desc', that.technology.introduce[index].desc)
                    document
                        .getElementById('second')
                        .setAttribute('style', '-webkit-transform:rotate' + '(' + -index * 6 + 'deg)')
                    index += 1
                    if (index >= that.technology.introduce.length) index = 0
                }, 3000)
            }
            sell()

            //仪表盘1
            let dashboardChart_1 = echarts.init(this.$refs.dashboardChart_1)
            let dashboardChartOptions_1 = dashboardSet({ name: '主持修订', value: 6 },{ name: '参与修订', value: 4 })
            dashboardChart_1.setOption(dashboardChartOptions_1)
            //仪表盘2
            let dashboardChart_2 = echarts.init(this.$refs.dashboardChart_2)
            let dashboardChartOptions_2 = dashboardSet({ name: '省级重点', value: 6 },{ name: '国家重点', value: 6 })
            dashboardChart_2.setOption(dashboardChartOptions_2)
        },
        //研发
        initResearch() {
            //改进玫瑰图
            let improvementChart = echarts.init(this.$refs.improvementChart)
            let improvementOptions = improvementSet()
            improvementChart.setOption(improvementOptions)

            //产品认证/奖项年度统计
            let productYearCountChart = echarts.init(this.$refs.productYearCountChart)
            let productYearCountOptions = productYearCountSet
            productYearCountChart.setOption(productYearCountOptions)

            //改进项目年度统计
            let improvementProjectYearChart = echarts.init(this.$refs.improvementProjectYearChart)
            let improvementProjectYearOptions = improvementProjectYearCount
            improvementProjectYearChart.setOption(improvementProjectYearOptions)
        },
        //客户分布
        initCustomerData() {

            //客户年度趋势-柱状图
            let customerYearTrendChart = echarts.init(this.$refs.customerYearTrendChart)
            let customerYearTrendOptions = customerYearTrendSet
            customerYearTrendChart.setOption(customerYearTrendOptions)

            //国内外客户占比-饼图
            // let customerNumberProplChart = echarts.init(this.$refs.customerNumberProplChart)
            // let customerNumberProplOptions = customerYearTrendSet
            // customerYearTrendChart.setOption(customerNumberProplOptions)

            //国外客户占比趋势
            let foreignCustomerTrendChart = echarts.init(this.$refs.foreignCustomerTrendChart)
            let foreignCustomerTrendOptions = foreignCustomerTrendSet
            foreignCustomerTrendChart.setOption(foreignCustomerTrendOptions)

            //客户行业分布
            let customerIndustryChart = echarts.init(this.$refs.customerIndustryChart)
            let customerIndustryOption = customerIndustrySet
            customerIndustryChart.setOption(customerIndustryOption)

            // let a = this.$refs.customerNumberProplChart
            // Highcharts.setOptions({
            //     colors: ['#FF4C4C', '#00AAD2']
            // });
            // $('#customerNumberProplChart').highcharts({
            //     chart: {
            //         type: 'pie',
            //         selectionMarkerFill: '#000',
            //         backgroundColor: 'transparent',
            //         options3d: {
            //             enabled: true,
            //             alpha: 55,//调整立体倾斜角度
            //             beta: 0,
            //         },
            //         plotBackgroundImage: "../assets/pie_bg.png",
            //     },
            //     title: {
            //         text: ''
            //     },
            //     tooltip: {
            //         pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            //     },
            //     plotOptions: {
            //         pie: {
            //             allowPointSelect: true,
            //             cursor: 'pointer',
            //             depth: 35,//调整立体高度
            //             startAngle: 90,
            //             slicedOffset: 60,
            //             dataLabels: {
            //                 enabled: true,
            //                 format: '{point.name}:{point.percentage:.1f}%',
            //                 // backgroundColor: '#ffffff',
            //                 borderColor: '#333333',
            //                 borderRadius: 4,
            //                 borderWidth: 2,
            //                 fontSize: 50
            //             }
            //         }
            //     },
            //     series: [{
            //         type: 'pie',
            //         name: '浏览器占比',
            //         data: [
            //             {
            //                 y: 25,
            //                 name: "线下消费",
            //                 color: "#b0aca4"
            //             }, {
            //                 y: 75,
            //                 name: "线上消费",
            //                 color: "#a78e36"
            //             }
            //         ]
            //     }]
            // })
        },
        //地图部分
        initMap() {
            let mapChart = echarts.init(this.$refs.map)
            let mapOption = mapChartSet
            mapOption.series = setMapSeries(this.map.mapData)
            mapChart.setOption(mapOption);

            //雷达图
            let radarChart = echarts.init(this.$refs.radarChart)
            let radarOption = continentRadarSet
            radarChart.setOption(radarOption);
        },
        //营销
        initSales() {
            //签约订单量年度趋势
            let contractOrderTrendChart = echarts.init(this.$refs.contractOrderTrendChart)
            let contractOrderTrendOptions = contractOrderTrendSet
            contractOrderTrendChart.setOption(contractOrderTrendOptions)

            //国内外销量趋势
            let homeAndAbroadSalesTrendChart = echarts.init(this.$refs.homeAndAbroadSalesTrendChart)
            let homeAndAbroadSalesTrendOptions = homeAndAbroadSalesTrendSet
            homeAndAbroadSalesTrendChart.setOption(homeAndAbroadSalesTrendOptions)

            //新特产品销量趋势
            let newProductsalesTrendChart = echarts.init(this.$refs.newProductsalesTrendChart)
            let newProductsalesTrendOptions = newProductsalesTrendSet
            newProductsalesTrendChart.setOption(newProductsalesTrendOptions)

            //新特产品销量占比趋势
            let newProductsalesProportionTrendChart = echarts.init(this.$refs.newProductsalesProportionTrendChart)
            let newProductsalesProportionTrendOptions = newProductsalesProportionTrendSet
            newProductsalesProportionTrendChart.setOption(newProductsalesProportionTrendOptions)

            //本年度发货产品排名及占比
            let yearProductRankAndProportionChart = echarts.init(this.$refs.yearProductRankAndProportionChart)
            let yearProductRankAndProportionOptions = yearProductRankAndProportionSet
            yearProductRankAndProportionChart.setOption(yearProductRankAndProportionOptions)
        },
        //客户服务
        initCustomerService() {
            //本年度客户满意度
            let customerSatisfactionChart = echarts.init(this.$refs.customerSatisfactionChart)
            let customerSatisfactionOptions = customerServcePercentSet(85, '本年度客户满意度')
            customerSatisfactionChart.setOption(customerSatisfactionOptions)

            //客诉处理满意度
            let processingSatisfactionChart = echarts.init(this.$refs.processingSatisfactionChart)
            let processingSatisfactionOptions = customerServcePercentSet(25, '客诉处理满意度')
            processingSatisfactionChart.setOption(processingSatisfactionOptions)

            //客户准时交付率
            let ontimeDeliveryRateChart = echarts.init(this.$refs.ontimeDeliveryRateChart)
            let ontimeDeliveryRateOptions = customerServcePercentSet(60, '客户准时交付率')
            ontimeDeliveryRateChart.setOption(ontimeDeliveryRateOptions)

            //客户满意度趋势
            let customerSatisfactionTrendChart = echarts.init(this.$refs.customerSatisfactionTrendChart)
            let customerSatisfactionTrendOptions = customerSatisfactionTrendSet()
            customerSatisfactionTrendChart.setOption(customerSatisfactionTrendOptions)

            //客户准时交付率年度趋势
            let ontimeDeliveryRateTrendChart = echarts.init(this.$refs.ontimeDeliveryRateTrendChart)
            let ontimeDeliveryRateTrendOptions = customerSatisfactionTrendSet()
            ontimeDeliveryRateTrendChart.setOption(ontimeDeliveryRateTrendOptions)

            //客户服务量年度趋势
            let customerServiceVolumeTrendChart = echarts.init(this.$refs.customerServiceVolumeTrendChart)
            let customerServiceVolumeTrendOptions = customerServiceVolumeTrendSet()
            customerServiceVolumeTrendChart.setOption(customerServiceVolumeTrendOptions)
        },
        //员工
        initStaff() {
            //专业经验年限员工分布及占比
            zyjynxygfbzbSetData = [
                {
                    name: "<3年",
                    value: 146
                },
                {
                    name: "3-5年",
                    value: 75
                },
                {
                    name: "5-10年",
                    value: 84
                },
                {
                    name: ">10年",
                    value: 113
                }
            ];
            let zyjynxygfbzbChart = echarts.init(this.$refs.zyjynxygfbzbChart)
            let zyjynxygfbzbOptions = zyjynxygfbzbSet(zyjynxygfbzbSetData)
            zyjynxygfbzbChart.setOption(zyjynxygfbzbOptions)

            //员工文化程度统计
            let StatisticsOfEmployeeEducationLevelChart = echarts.init(this.$refs.StatisticsOfEmployeeEducationLevelChart)
            let StatisticsOfEmployeeEducationLevelOptions = StatisticsOfEmployeeEducationLevelSet(['大专以下', '大专', '本科', '硕士', '博士'], [250, 55, 66, 6, 1])
            StatisticsOfEmployeeEducationLevelChart.setOption(StatisticsOfEmployeeEducationLevelOptions)

            //员工岗位分布及占比
            employeePositionsData = [
                {
                    name: "管理人员",
                    value: 100
                },
                {
                    name: "间接员工",
                    value: 75
                },
                {
                    name: "直接员工",
                    value: 50
                },
                {
                    name: "后勤人员",
                    value: 25
                }
            ];
            let employeePositionsChart = echarts.init(this.$refs.employeePositionsChart)
            let employeePositionsOptions = employeePositionsSet(employeePositionsData)
            employeePositionsChart.setOption(employeePositionsOptions)

            //专业人才统计
            let zyrctjChart = echarts.init(this.$refs.zyrctjChart)
            let zyrctjOptions = zyrctjSet()
            zyrctjChart.setOption(zyrctjOptions)
        },
        //质检
        initInspector() {
            //客户服务量年度趋势
            let cpbmqxlChart = echarts.init(this.$refs.cpbmqxlChart)
            let cpbmqxlOptions = inspectorSet('百米缺陷率（%）', '2021', ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'], [0.7, 1.15, 1.08, 1.1, 1.13, 1.02, 1.5], [0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6])
            cpbmqxlChart.setOption(cpbmqxlOptions)

            //原材料批次合格率趋势
            let yclpchglChart = echarts.init(this.$refs.yclpchglChart)
            let yclpchglOptions = inspectorSet('合格率（%）', '2021', ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'], [0.7, 1.15, 1.08, 1.1, 1.13, 1.02, 1.5], [0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6])
            yclpchglChart.setOption(yclpchglOptions)
        },
        //运营
        initOperate(){
            //电能耗月度趋势
            let electricConsumeMonthTrendSet = echarts.init(this.$refs.electricConsumeMonthTrendSet)
            let electricConsumeMonthTrendOptions = operateSet_1('电（度）', '2021', ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'], [0.7, 1.15, 1.08, 1.1, 1.13, 1.02, 1.5], [0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6])
            electricConsumeMonthTrendSet.setOption(electricConsumeMonthTrendOptions)

            //硫化OEE月度趋势
            let vulcanizationOeeMonthTrendSet = echarts.init(this.$refs.vulcanizationOeeMonthTrendSet)
            let vulcanizationOeeMonthTrendOptions = operateSet_1('OEE（%）', '2021', ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'], [0.7, 1.15, 1.08, 1.1, 1.13, 1.02, 1.5], [0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6])
            vulcanizationOeeMonthTrendSet.setOption(vulcanizationOeeMonthTrendOptions)

            //密炼OEE月度趋势
            let internalMixingMonthTrendSet = echarts.init(this.$refs.internalMixingMonthTrendSet)
            let internalMixingMonthTrendOptions = operateSet_1('OEE（%）', '2021', ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'], [0.7, 1.15, 1.08, 1.1, 1.13, 1.02, 1.5], [0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6])
            internalMixingMonthTrendSet.setOption(internalMixingMonthTrendOptions)

            //水能耗月度趋势
            let waterMonthTrendSet = echarts.init(this.$refs.waterMonthTrendSet)
            let waterMonthTrendOptions = operateSet_1('水（吨）', '2021', ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'], [0.7, 1.15, 1.08, 1.1, 1.13, 1.02, 1.5], [0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6])
            waterMonthTrendSet.setOption(waterMonthTrendOptions)

            //气能耗月度趋势
            let steamMonthTrendSet = echarts.init(this.$refs.steamMonthTrendSet)
            let steamMonthTrendOptions = operateSet_1('汽（吨）', '2021', ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'], [0.7, 1.15, 1.08, 1.1, 1.13, 1.02, 1.5], [0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6])
            steamMonthTrendSet.setOption(steamMonthTrendOptions)

            //硫化产量月度趋势（面积）
            let vulcanizationYieldMonthTrendSet = echarts.init(this.$refs.vulcanizationYieldMonthTrendSet)
            let vulcanizationYieldMonthTrendOptions = operateSet_2(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'], [0.7, 1.15, 1.08, 1.1, 1.13, 1.02, 1.5], [0.2, 0.6, 0.77, 0.5, 0.43, 0.8, 0.54, 0.66, 0.88, 0.45, 0.8, 0.7])
            vulcanizationYieldMonthTrendSet.setOption(vulcanizationYieldMonthTrendOptions)
        },
        getTimelineYearStyle(i) {
            return `transform: rotate(${i * 6}deg) translateX(188px);`
        },
        getTimelineTickStyle(i) {
            return `transform: rotate(${i * 6}deg) translateX(160px);`
        },
    },
})