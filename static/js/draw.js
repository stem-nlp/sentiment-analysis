function draw(id,d){


  var width = 300,
      height = 300,
      radius = Math.min(width, height) / 2,
      innerRadius = 0.3 * radius;

  var pie = d3.layout.pie()
      .sort(null)
      .value(function(d) { return d.width; });

  var arc = d3.svg.arc()
    .innerRadius(function (d) { 
      return (innerRadius);
    })
    .outerRadius(function (d) { 
      return (radius - innerRadius) * (d.data.score)/3 + innerRadius; 
    });

  var outlineArc = d3.svg.arc()
          .innerRadius(innerRadius)
          .outerRadius(radius);

  var innerlineArc = d3.svg.arc()
          .innerRadius(innerRadius)
          .outerRadius((radius-innerRadius)/3+innerRadius);

  var middlelineArc = d3.svg.arc()
          .innerRadius(innerRadius)
          .outerRadius((radius-innerRadius)/3*2+innerRadius);


  var svg = d3.select(id).append("svg")
      .attr("width", width*3)
      .attr("height", height*1.3)
      .append("g")
      .attr("transform", "translate(" + width*3 / 2 + "," + height*1.3 / 2 + ")");

  function color16(){//十六进制颜色随机
    var r = Math.floor((Math.random()+0.05)*256);
    var g = Math.floor((Math.random()+0.05)*256);
    var b = Math.floor((Math.random()+0.05)*256);
    var color = '#'+r.toString(16)+g.toString(16)+b.toString(16);
    return color;
  }

//    var data=[];
//    for (var i in d){
//      if (i!="id" && i!="content"){
//        for (var j in d[i]){
//          data.push({color:color16(),label: i+"-"+j,score: d[i][j]+2,width: 1})
//        };
//      };
//    };
//
//    var data=[];
//    for (var i in d){
//      if (i!="id" && i!="content"){data.push({color:color16(),label: i,score: d[i]+2,width: 1})};
//    };

    var data=[];
    for (var i in d){
      if (i!="id" && i!="content"){data.push({color:color16(),label: i,score: Number(d[i])+2,width: 1})};
    };

    var path = svg.selectAll(".solidArc")
        .data(pie(data))
        .enter().append("path")
        .attr("fill", function(d) { return d.data.color; })
        .attr("class", "solidArc")
        .attr("stroke", "gray")
        .attr("d", arc);

    var outerPath = svg.selectAll(".outlineArc")
        .data(pie(data))
        .enter().append("path")
        .attr("fill", "none")
        .attr("stroke", "gray")
        .attr("class", "outlineArc")
        .attr("d", outlineArc); 

    var innerPath = svg.selectAll(".innerlineArc")
        .data(pie(data))
        .enter().append("path")
        .attr("fill", "none")
        .attr("stroke", "gray")
        .attr("class", "innerlineArc")
        .attr("d", innerlineArc); 


    var middlePath = svg.selectAll(".middlelineArc")
        .data(pie(data))
        .enter().append("path")
        .attr("fill", "none")
        .attr("stroke", "gray")
        .attr("class", "middlelineArc")
        .attr("d", middlelineArc); 


    svg.append("svg:text")
      .attr("class", "aster-score")
      .attr("dy", ".35em")
      .attr("text-anchor", "middle") // text-align: right
      .text("评价详情");


    svg.append('g').attr('class', 'lines')
    svg.append('g').attr('class', 'labels')

          function getMidAngle(d) {
            return (d.endAngle + d.startAngle) / 2;
          }

          const slices = pie(data);
          const innerArc = d3.svg.arc().innerRadius(innerRadius).outerRadius(radius*1.8);

          const endPoints = [];
          const pivotArc = d3.svg.arc().innerRadius(innerRadius).outerRadius(radius*2);
          const line = svg.select('.lines').selectAll('polyline').data(slices);
          line.enter()
            .append('polyline')
            .attr('points', (d, i) => {
              const slice = slices[i];

              const innerCentroid = innerArc.centroid(slice);
              const x1 = innerCentroid[0];
              const y1 = innerCentroid[1];

              const pivotPoint = pivotArc.centroid(slice);
              const x2 = pivotPoint[0];
              const y2 = pivotPoint[1];

              const midAngle = getMidAngle(slice);
              const x3 = x2 + (midAngle > Math.PI ? -20 : 20);
              const y3 = y2;

              endPoints[i] = [x3, y3];

              return `${x1},${y1} ${x2},${y2} ${x3},${y3}`;
            })
            .attr('fill', 'none')
            .attr('stroke', function(d) { return d.data.color; });

          line.exit().remove();

          const label = svg.select('.labels').selectAll('text').data(slices);
          label.enter()
            .append('text')
            .text((d) => {
              const value = d.data.score-2;
              const label = d.data.label;
              return `${label}: ${value}`;
            })
            .attr('transform', (d, i) => {
              const x = endPoints[i][0] + (getMidAngle(d) > Math.PI ? -10 : 10);
              const y = endPoints[i][1] + 5;

              return `translate(${x}, ${y})`;
            })
            .attr('text-anchor', (d) => {
              const midAngle = getMidAngle(d);
              return midAngle > Math.PI ? 'end' : 'start';
            });

          label.exit().remove();
};