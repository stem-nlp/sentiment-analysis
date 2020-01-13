
function fillOutput(result){
}

$("#start-button").click(()=>{
    showSummary();
});

// 渲染结果
function renderOutput(result){
    $("#input-body").text(result.content);
}



function showSummary(){
    let body = $("#input-body").val();

    // http 请求
//    $.ajax({
//        url:"/api/model",
//        type: "post",
//        dataType: "json",
//        data: {"body":body},
//        success: (response)=>{
//            window.location.hash = "#start-button";
//            renderOutput(response);
//        }
//    });


    	  $.ajax({
						url:"/api/model",
						type: "post",
						dataType: "json",
						data: {"body":body},
						success: (d)=>{
							    window.location.hash = "#start-button";
						        renderOutput(d);

								let arr = [];
								for(var prop in d){
                                    var json = {};
                                    json['"'+prop+'"'] = d[prop]
									arr.push(json);
								}

								console.log('================'+JSON.stringify(arr));

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

								/*var radar_data3=[];
								var tmp_data=[];
								for (var i in d){
									if (i!="id" && i!="content"){
										for (var j in d[i]){
											tmp_data.push({axis:i+"-"+j,value:d[i][j]})
										};
									};
								};
								radar_data3=[tmp_data];*/
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
								draw(".pie",d)


						}
					});

}


