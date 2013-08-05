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
import java.util.List;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import org.primefaces.primeui.domain.TreeNode;

@Path("/tree")
public class TreeService {
    
    @GET
    @Path("/all")
    @Produces(MediaType.APPLICATION_JSON)
    public Collection<TreeNode> getSuggestions() {
        List<TreeNode> nodes = new ArrayList<TreeNode>();
        
        TreeNode node0 = new TreeNode("Node 0", "0");
        TreeNode node1 = new TreeNode("Node 1", "1");
        TreeNode node2 = new TreeNode("Node 2", "2");
        
        TreeNode node00 = new TreeNode("Node 0.0", "0_0");
        node00.getChildren().add(new TreeNode("Node 0.0.0", "0_0_0"));
        node00.getChildren().add(new TreeNode("Node 0.0.1", "0_0_1"));
        
        TreeNode node01 = new TreeNode("Node 0.1", "0_1");
        node01.getChildren().add(new TreeNode("Node 0.1.0", "0_1_0"));
        
        node0.getChildren().add(node00);
        node0.getChildren().add(node01);
        
        TreeNode node10 = new TreeNode("Node 1.0", "1_0");
        node10.getChildren().add(new TreeNode("Node 1.0.0", "1_0_0"));
        TreeNode node11 = new TreeNode("Node 1.1", "1_1");
        
        node1.getChildren().add(node10);
        node1.getChildren().add(node11);
        
        nodes.add(node0);
        nodes.add(node1);
        nodes.add(node2);

        return nodes;
    }
    
    @GET
    @Path("{query}")
    @Produces(MediaType.APPLICATION_JSON)
    public Collection<TreeNode> getSuggestions(@PathParam("query") String rootkey) {
        List<TreeNode> nodes = new ArrayList<TreeNode>();
        boolean leaf = (rootkey.split("_").length < 4) ? false : true;
        
        for(int i = 0; i < 3; i++) {
            String nodekey = rootkey.equals("root") ? String.valueOf(i) : rootkey + "_" + i;
            nodes.add(new TreeNode("Node " + nodekey.replaceAll("_", "\\."), nodekey, leaf));
        }

        return nodes;
    }
}
