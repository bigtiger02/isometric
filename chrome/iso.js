var Iso = (function(){
  var totalContributions,totalContributionDateRange,
    largestContribution,largestContributionTime,
    longestContributions,longestContributionDateRange,
    currentContributions,lastActiveTime;

    function Iso(){
      this._fetchData();
      this._initUI();
      this.renderIsometricChart();
    }

    Iso.prototype._fetchData = function(){
      //总贡献度
      $(".statistic-table tr:nth-child(2)").find("td:nth-child(1)").each(function(){
        totalContributions = $(this).find(".count").html().replace("度","");
        totalContributionDateRange = $(this).find(".duration").html();
      });
      //最长活跃度
      $(".statistic-table tr:nth-child(2)").find("td:nth-child(2)").each(function(){
        longestContributions = $(this).find(".count").html().replace("天","");
        longestContributionDateRange = $(this).find(".duration").html();
      });
      //当前活跃度
      $(".statistic-table tr:nth-child(2)").find("td:nth-child(3)").each(function(){
        currentContributions = $(this).find(".count").html().replace("天","");
        lastActiveTime = $(this).find(".duration").html();
      });
      //最大天提交量
      $('.daily-activeness-graph').find("rect").each(function(){
          var contribCount = parseInt($(this).attr('data-count'));
          var contribDate = $(this).attr('data-date');
          if(largestContribution){
            if(contribCount > largestContribution){
              largestContribution = contribCount;
              largestContributionTime = contribDate;
            }
          }else{
              largestContribution = contribCount;
              largestContributionTime = contribDate;
          }
      });
    }

    Iso.prototype._initUI = function(){
      $(".statistic-table").wrap('<div class="origin-tab-container"></div>');
      $(".origin-tab-container").wrap('<div class="iso-container"></div>');
      var isoHtml = '<div class="iso-tab-container">'
                    +'<div class="iso-stats-top"><table>'
                    +'<tr><td class="iso-td">活跃度<span class="iso-stats-cnt">'+totalContributions+'</span></td><td class="iso-meta-td"><span class="iso-stats-unit">过去一年</span><span class="iso-stats-date">'+totalContributionDateRange+'</span></td></tr>'
                    +'<tr><td class="iso-td">最大活跃度<span class="iso-stats-cnt">'+largestContribution+'</span></td><td class="iso-meta-td"><span class="iso-stats-unit">发生时间</span><span class="iso-stats-date">'+largestContributionTime+'</span></td></tr>'
                    +'</table></div>'
                    +'<div class="iso-stats-bottom"><table>'
                    +'<tr><td class="iso-td">最长连续活跃<span class="iso-stats-cnt">'+longestContributions+'</span></td><td class="iso-meta-td"><span class="iso-stats-unit">天</span><span class="iso-stats-date">'+longestContributionDateRange+'</span></td></tr>'
                    +'<tr><td class="iso-td">当前连续活跃<span class="iso-stats-cnt">'+currentContributions+'</span></td><td class="iso-meta-td"><span class="iso-stats-unit">天</span><span class="iso-stats-date">'+lastActiveTime+'</span></td></tr>'
                    +'</table></div>'
                    +'<canvas id="isometric-canvas" width="620px" height="400px"></canvas>'
                    +'</div>';
      $(".iso-container").prepend(isoHtml);
      $(".iso-container").wrap('<div id="iso-coding-contributions"></div>');

      var tabHtml = '<div class="iso-header">'
                    +'<span class="title">Iso metric for coding with ❤️</span>'
                    +'<span class="iso-toggle">'
                    +'<a href="#" class="iso-toggle-option tooltipped squares"></a>'
                    +'<a href="#" class="iso-toggle-option tooltipped cubes active"></a>'
                    +'</span>'
                    +'</div>';
      $("#iso-coding-contributions").prepend(tabHtml);
      $("#iso-coding-contributions").attr("data-time",new Date().getTime());
      $(".iso-toggle").find(".squares").click(function(){
        $(".iso-toggle").find(".cubes").removeClass("active");
        $(this).addClass("active");
        $(".iso-tab-container").hide();
        $(".origin-tab-container").show();
      });
      $(".iso-toggle").find(".cubes").click(function(){
        $(".iso-toggle").find(".squares").removeClass("active");
        $(this).addClass("active");
        $(".iso-tab-container").show();
        $(".origin-tab-container").hide();
      });
    }

    Iso.prototype.renderIsometricChart = function(){
      var GH_OFFSET, MAX_HEIGHT, SIZE, canvas, contribCount, pixelView, point, self;
      SIZE = 10;
      GH_OFFSET = 13;
      MAX_HEIGHT = 80;

      canvas = document.getElementById('isometric-canvas');
      point = new obelisk.Point(97, 120);
      pixelView = new obelisk.PixelView(canvas, point);
      contribCount = null;
      self = this;
      $('.daily-activeness-graph').find("g>g").each(function(g) {
        var x;
        x = parseInt(((($(this)).attr('transform')).match(/(\d+)/))[0] / GH_OFFSET);
        $(this).find('rect').each(function(r) {
          var color, cube, cubeHeight, dimension, fill, p3d, y;
          //r = ($(this)).get(0);
          y = parseInt((($(this)).attr('y')) / GH_OFFSET);
          fill = $(this).attr('fill');
          contribCount = parseInt(($(this)).attr('data-count'));

          cubeHeight = 3;
          cubeHeight += parseInt(MAX_HEIGHT / largestContribution * contribCount);

          dimension = new obelisk.CubeDimension(SIZE, SIZE, cubeHeight);
          color = self.getSquareColor(fill);
          cube = new obelisk.Cube(dimension, color, false);
          p3d = new obelisk.Point3D(SIZE * x, SIZE * y, 0);
          pixelView.renderObject(cube, p3d);
        });
      });
    }

    Iso.prototype.getSquareColor = function(fill) {
      var color;
      return color = (function() {
        var COLORS = [new obelisk.CubeColor().getByHorizontalColor(0xeeeeee),
                  new obelisk.CubeColor().getByHorizontalColor(0xd6e685),
                  new obelisk.CubeColor().getByHorizontalColor(0x8cc665),
                  new obelisk.CubeColor().getByHorizontalColor(0x44a340),
                  new obelisk.CubeColor().getByHorizontalColor(0x1e6923)];
        switch (fill) {
          case '#eeeeee':
            return COLORS[0];
          case '#d6e685':
            return COLORS[1];
          case '#8cc665':
            return COLORS[2];
          case '#44a340':
            return COLORS[3];
          case '#1e6923':
            return COLORS[4];
        }
      })();
    };

    return Iso;
})();

$(function() {
  //由于coding的图表为异步加载，处理异步加载偶尔延迟的情况
  var time = setInterval(function(){
    if($('.daily-activeness-graph').length > 0){
      if(!$("#iso-coding-contributions").attr("data-time")){
        new Iso();
      }
    }
  },1000);
});
