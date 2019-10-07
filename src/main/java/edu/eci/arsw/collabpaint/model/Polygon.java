package edu.eci.arsw.collabpaint.model;

import java.util.ArrayList;

public class Polygon {

    ArrayList<Point> points = new ArrayList<>();

    public Polygon(){

    }

    public Polygon(Point pt){
        points.add(pt);
    }

    public void addPoint(Point pt){
        points.add(pt);
    }

    public void addPoint(int x, int y){
        Point pt = new Point(x,y);
        points.add(pt);
    }

    public boolean enoughPoints(){
        return points.size() >= 4;
    }

    public ArrayList<Point> getPoints() {
        return points;
    }
}
