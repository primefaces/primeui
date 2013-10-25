/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package org.primefaces.primeui.service;

import java.util.Comparator;
import org.primefaces.primeui.domain.Car;

public class LazySorter implements Comparator<Car> {

    private String sortField;
    
    private int sortOrder;
    
    public LazySorter(String sortField, int sortOrder) {
        this.sortField = sortField;
        this.sortOrder = sortOrder;
    }

    public int compare(Car car1, Car car2) {
        try {
            Object value1 = Car.class.getField(this.sortField).get(car1);
            Object value2 = Car.class.getField(this.sortField).get(car2);

            int value = ((Comparable)value1).compareTo(value2);
            
            return sortOrder * value;
        }
        catch(Exception e) {
            e.printStackTrace();
            throw new RuntimeException();
        }
    }
}