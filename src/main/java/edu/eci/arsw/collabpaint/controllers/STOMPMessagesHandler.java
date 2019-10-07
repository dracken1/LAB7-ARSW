package edu.eci.arsw.collabpaint.controllers;

import edu.eci.arsw.collabpaint.model.Polygon;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import edu.eci.arsw.collabpaint.model.Point;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Controller
public class STOMPMessagesHandler {

    @Autowired
    SimpMessagingTemplate msgt;

    Map<String, Polygon> polygons = new ConcurrentHashMap<>(100);

    @MessageMapping("/newpoint.{numdibujo}")
    public void handlePointEvent(Point pt,@DestinationVariable String numdibujo) throws Exception {

        if(polygons.containsKey(numdibujo)) {
            polygons.get(numdibujo).addPoint(pt);
            System.out.println("Nuevo punto recibido en el servidor!:"+pt);
            msgt.convertAndSend("/topic/newpoint"+numdibujo, pt);
            if(polygons.get(numdibujo).enoughPoints()){
                msgt.convertAndSend("/topic/newpolygon"+numdibujo, polygons.get(numdibujo));
                polygons.remove(numdibujo);
            }
        } else {
            Polygon pol = new Polygon(pt);
            polygons.put(numdibujo,pol);
        }
    }


}