

$("#start-button").click(()=>{
    showSummary();

    let pie = $(".pie");
    console.log(pie.children("svg").length);
    console.log(typeof pie.children("svg").length);
    if(pie.children("svg").length>=2){
        pie.empty();
    }


});

// 渲染结果
function renderOutput(result){
    $("#input-body").text(result.content);
}


function showSummary(){
    let body = $("#input-body").val();

    	  $.ajax({
						url:"/api/model",
						type: "post",
						dataType: "json",
						data: {"body":body},
						success: (d)=>{
							    window.location.hash = "#start-button";
						        renderOutput(d);

                                var treeChartData = {
                                    name:'情感分析',
                                    children:[],
                                };

								let arr = [];
								for(var prop in d){
                                    var json = {};
                                    json['"'+prop+'"'] = d[prop]
									arr.push(json);

									treeChartData.children.push({
									    name:prop+'('+d[prop]+')'
									});

								}

								console.log('================'+JSON.stringify(arr));
								console.log('=======treeChartData========='+JSON.stringify(treeChartData));

								//评价结果分析
								function pj(){
									var av={};

									for (var i in d){
										if (i!="id" && i!="content"){
											var sum=0;
											var count=0;

											for (var j in d[i]){
												count =count+1;
												if(d[i][j]!=-2){
													sum=sum+d[i][j];
												};
											};
											av[i]=sum/count;
										};
									};
									return av;
								};
								var pingjia;
								pingjia=pj();

							//感情分析
								function gq(){
									count={}
									for (var i in d){
										if (i!="id" && i!="content"){
											for (var j in d[i]){
												var c=Number(count[(d[i][j]).toString()])
												if (isNaN(c)) {c=0};
												count[(d[i][j]).toString()]=1+c;

											};
										};
									};

								return count;
								};
								ganqing=gq()
								if (isNaN(ganqing["0"])){ganqing["0"]=0};
								if (isNaN(ganqing["1"])){ganqing["1"]=0};
								if (isNaN(ganqing["-1"])){ganqing["-1"]=0};
								if (isNaN(ganqing["-2"])){ganqing["-2"]=0};

								var radar_data = [
										  [//Location
											{axis:"位置",value:pingjia.location},
											{axis:"服务",value:pingjia.service},
											{axis:"价格",value:pingjia.price},

											{axis:"环境",value:pingjia.environment},
											{axis:"菜品",value:pingjia.dish},
											{axis:"其他",value:pingjia.others},


										  ]
										];

								var radar_data2 = [
										  [//Location
											{axis:"正向感情",value:ganqing["1"]/20},

											{axis:"中性感情",value:ganqing["0"]/20},
											{axis:"负向感情",value:ganqing["-1"]/20},

											{axis:"感情方向不明确",value:ganqing["-2"]/20},

										  ]
										];

								//////////////////////////////////////////////////////////////
								//////////////////// Draw the Chart //////////////////////////
								//////////////////////////////////////////////////////////////

								var color = d3.scale.ordinal()
									.range(["#EDC951","#CC333F","#00A0B0"]);

								var radarChartOptions = {
								  w: width,
								  h: height,
								  margin: margin,
								  maxValue: 1,
								  minValue: -2,
								  levels: 3,
								  labelFactor:1.5,
								  roundStrokes: true,
								  color: color
								};

								var radarChartOptions2 = {
								  w: width,
								  h: height,
								  margin: margin,
								  maxValue: 1,
								  levels: 4,
								  roundStrokes: true,
								  color: color
								};

								//Call function to draw the Radar chart
//								RadarChart(".radarChart", arr, radarChartOptions);
//								RadarChart(".radarChart2", radar_data2, radarChartOptions2);
								draw(".pie",d);

								treeChart(treeChartData);

  							  //  barChart();
						}
					});

}

//樹狀圖
function treeChart(data){



         var width =  1000,
                    height =  1000;


        var cluster = d3.layout.cluster()
            .size([width, height - 200]);

        var diagonal = d3.svg.diagonal()
            .projection(function(d) {
                return [d.y, d.x];
            });

        var svg = d3.select(".pie").append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(40,0)");


        // d3.json("data.json", function(error, root) {
            var root = data;

            console.log('------------------'+JSON.stringify(root));
            console.log('------------------=====================');

            var nodes = cluster.nodes(root);
            var links = cluster.links(nodes);

            console.log(nodes);
            console.log(links);

            var link = svg.selectAll(".link")
                .data(links)
                .enter()
                .append("path")
                .attr("class", "link")
                .attr("d", diagonal);

            var node = svg.selectAll(".node")
                .data(nodes)
                .enter()
                .append("g")
                .attr("class", "node")
                .attr("transform", function(d) {
                    return "translate(" + d.y + "," + d.x + ")";
                })

            node.append("circle")
                .attr("r", 4.5);

            node.append("text")
                .attr("dx", function(d) {
                    return d.children ? -8 : 8;
                })
                .attr("dy", 3)
                .style("text-anchor", function(d) {
                    return d.children ? "end" : "start";
                })
                .text(function(d) {
                    return d.name;
                });

}


function barChart(){
$.get("/api/getmodel", function(d) {


				var dom = document.getElementById("container");
				var myChart = echarts.init(dom);
				var app = {};
				option = null;
				var xAxisData = [];
				var data1 = [];
				var data2 = [];
				var data3 = [];
				var data4 = [];


				for (var prop in d) {

					if(!isNaN(d[prop]) && prop != 'id'){
						xAxisData.push(prop);
						data1.push(parseInt(d[prop]));

					}


				}

				console.log('===xAxisData===='+JSON.stringify(xAxisData))
				console.log('====data1==='+JSON.stringify(data1))


				// for (var i = 0; i < 10; i++) {
				// 	xAxisData.push('Class' + i);
				// 	data1.push((Math.random() * 2).toFixed(2));
				// 	data2.push(-Math.random().toFixed(2));
				// 	data3.push((Math.random() * 5).toFixed(2));
				// 	data4.push((Math.random() + 0.3).toFixed(2));
				// }

				var emphasisStyle = {
					itemStyle: {
						barBorderWidth: 1,
						shadowBlur: 10,
						shadowOffsetX: 0,
						shadowOffsetY: 0,
						shadowColor: 'rgba(0,0,0,0.5)'
					}
				};

				option = {
					backgroundColor: '#eee',
					legend: {
						data: ['bar', 'bar2', 'bar3', 'bar4'],
						left: 10,
						top:10,
					},
					brush: {
						toolbox: ['rect', 'polygon', 'lineX', 'lineY', 'keep', 'clear'],
						xAxisIndex: 0
					},
					toolbox: {
						feature: {
							magicType: {
								type: ['stack', 'tiled']
							},
							dataView: {}
						}
					},
					tooltip: {},
					xAxis: {
						data: xAxisData,
						name: 'X Axis',
						axisLine: {
							onZero: true
						},
						splitLine: {
							show: false
						},
						splitArea: {
							show: false
						},
						axisLabel:{
							rotate:45,
						}
					},
					yAxis: {
						inverse: true,
						splitArea: {
							show: false
						}
					},
					grid: {
						left: 100,
						bottom:'20%',
					},
					visualMap: {
						type: 'continuous',
						dimension: 1,
						text: ['High', 'Low'],
						inverse: true,
						itemHeight: 200,
						calculable: true,
						min: -2,
						max: 6,
						top: 60,
						left: 10,
						inRange: {
							colorLightness: [0.4, 0.8]
						},
						outOfRange: {
							color: '#bbb'
						},
						controller: {
							inRange: {
								color: '#2f4554'
							}
						}
					},
					series: [{
							name: 'bar',
							type: 'bar',
							stack: 'one',
							emphasis: emphasisStyle,
							data: data1,
							itemStyle: {
									color: '#a9cbd0'
							}
						},
						/*
						{
							name: 'bar2',
							type: 'bar',
							stack: 'one',
							emphasis: emphasisStyle,
							data: data2
						},
						{
							name: 'bar3',
							type: 'bar',
							stack: 'two',
							emphasis: emphasisStyle,
							data: data3
						},
						{
							name: 'bar4',
							type: 'bar',
							stack: 'two',
							emphasis: emphasisStyle,
							data: data4
						}
						*/
					]
				};

				myChart.on('brushSelected', renderBrushed);

				function renderBrushed(params) {
					var brushed = [];
					var brushComponent = params.batch[0];

					for (var sIdx = 0; sIdx < brushComponent.selected.length; sIdx++) {
						var rawIndices = brushComponent.selected[sIdx].dataIndex;
						brushed.push('[Series ' + sIdx + '] ' + rawIndices.join(', '));
					}

					myChart.setOption({
						title: {
							backgroundColor: '#333',
							text: 'SELECTED DATA INDICES: \n' + brushed.join('\n'),
							bottom: 0,
							right: 0,
							width: 100,
							textStyle: {
								fontSize: 12,
								color: '#fff'
							}
						}
					});
				};
				if (option && typeof option === "object") {
					myChart.setOption(option, true);
				}



			});
}
