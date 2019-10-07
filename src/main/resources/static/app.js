var app = (function () {

    class Point{
        constructor(x,y){
            this.x=x;
            this.y=y;
        }        
    }

    class Polygon{
        constructor(points){
            this.points = points;
        }
    }
    
    var stompClient = null;

    var addPointToCanvas = function (point) {        
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");
        ctx.beginPath();
        ctx.arc(point.x, point.y, 1, 0, 2 * Math.PI);
        ctx.stroke();
    };

    var addPolygonToCanvas = function(Polygon){
      var canv = document.getElementById("canvas");
      var canvasctx = canv.getContext('2d');
      c2.fillStyle = '#f00';
      c2.beginPath();
      for(var i=0;i<Polygon.points.){
      }
      c2.moveTo(0, 0);
      c2.lineTo(100,50);
      c2.lineTo(50, 100);
      c2.lineTo(0, 90);
      c2.closePath();
      c2.fill();
    };
    
    
    var getMousePosition = function (evt) {
        canvas = document.getElementById("canvas");
        var rect = canvas.getBoundingClientRect();
        stompClient.send("/topic/newpoint"+$('#identif').val(),{},JSON.stringify({x:evt.clientX-rect.left,y:evt.clientY-rect.top}));
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    };


    var connectAndSubscribe = function () {
        console.info('Connecting to WS...');
        var socket = new SockJS('/stompendpoint');
        stompClient = Stomp.over(socket);
        
        //subscribe to /topic/newpoint when connections succeed
        stompClient.connect({}, function (frame) {
            console.log('Connected: ' + frame);
            stompClient.subscribe('/topic/newpoint', function (eventbody) {
                var extract = JSON.parse(eventbody.body);
                var pnt = new Point(extract.x,extract.y);
                addPointToCanvas(pnt);
            });
        });
    };

    var connectAndSubscribeWithID = function (id) {
        console.info('Connecting to WS...');
        var socket = new SockJS('/stompendpoint');
        stompClient = Stomp.over(socket);

        //subscribe to /topic/newpointID when connections succeed
        stompClient.connect({}, function (frame) {
            console.log('Connected: ' + frame);
            stompClient.subscribe('/topic/newpoint'+ id, function (eventbody) {
                var extract = JSON.parse(eventbody.body);
                var pnt = new Point(extract.x,extract.y);
                addPointToCanvas(pnt);
            });
            stompClient.subscribe('/topic/newpolygon'+id, function(eventbody){
                var extract2 = JSON.parse(eventbody.body);
                var poly = new Polygon(extract2.points);
                var canv = document.getElementById("canvas");
                var canvasctx = canv.getContext('2d');
                canvasctx.fillStyle = '#f00';
                canvasctx.beginPath();
                for(var i=0;i<poly.points.length;i++){
                    if(i===0){
                        canvasctx.moveTo(points[i].x, points[i].y);
                    }else{
                        canvasctx.lineTo(points[i].x, points[i].y);
                    }
                }
                c2.closePath();
                c2.fill();
            });
        });
    };
    
    

    return {

        init: function () {
            var can = document.getElementById("canvas");
            //var canctxt = can.getContext('2d');
            //var res = can.addEventListener('mousedown',getMousePosition,false);

            //websocket connection
            //connectAndSubscribe();
        },

        publishPoint: function(px,py){
            var pt=new Point(px,py);
            console.info("publishing point at "+pt);
            addPointToCanvas(pt);

            //publicar el evento
            stompClient.send("/topic/newpoint",{},JSON.stringify(pt));
        },

        connect: function(id){
            if(document.getElementById('identif') && document.getElementById('identif').value){
                var can = document.getElementById("canvas");
                can.addEventListener('mousedown',getMousePosition,false);
                connectAndSubscribeWithID(id);
            } else {
                alert("Insert an ID");
            }
        },

        disconnect: function () {
            if (stompClient !== null) {
                stompClient.disconnect();
            }
            setConnected(false);
            console.log("Disconnected");
        }
    };

})();