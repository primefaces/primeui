/*
 * Copyright 2009-2013 PrimeTek.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.primefaces.primeui.service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import javax.servlet.ServletContext;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import org.primefaces.primeui.domain.Car;

@Path("/cars")
public class CarService {
    
    @Context
    private ServletContext context;
    
    @GET
    @Path("/list")
    @Produces(MediaType.APPLICATION_JSON)
    public Collection<Car> loadCars() {
        return (Collection<Car>) ((Map<String,Object>) context.getAttribute("puicache")).get("eagerCars");
    }
    
    @GET
    @Path("/lazylist/{first}")
    @Produces(MediaType.APPLICATION_JSON)
    public Collection<Car> lazyLoadCars(@PathParam("first") int first) {
        List<Car> cars = (List<Car>) ((Map<String,Object>) context.getAttribute("puicache")).get("lazyCars");
        
        return cars.subList(first, (first + 5));
    }
    
    @GET
    @Path("/lazylist/{first}/{sortfield}/{sortorder}")
    @Produces(MediaType.APPLICATION_JSON)
    public Collection<Car> lazyLoadCars(@PathParam("first") int first, @PathParam("sortfield") String sortField, @PathParam("sortorder") int order) {
        List<Car> cars = (List<Car>) ((Map<String,Object>) context.getAttribute("puicache")).get("lazyCars");

        if(sortField != null) {
            Collections.sort(cars, new LazySorter(sortField, order));
        }
        
        return cars.subList(first, (first + 5));
    }
}
