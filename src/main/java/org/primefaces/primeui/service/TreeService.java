/*
 * Copyright 2009-2015 PrimeTek.
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
import org.primefaces.primeui.domain.Document;
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
    
    @GET
    @Path("/documents")
    @Produces(MediaType.APPLICATION_JSON)
    public Collection<TreeNode> getDocuments() {
        List<TreeNode> root = new ArrayList<TreeNode>();
        
		TreeNode documents = new TreeNode(new Document("Documents", "-", "Folder"));
		TreeNode pictures = new TreeNode(new Document("Pictures", "-", "Folder"));
		TreeNode movies = new TreeNode(new Document("Movies", "-", "Folder"));
        
        root.add(documents);
        root.add(pictures);
        root.add(movies);
		
		TreeNode work = new TreeNode(new Document("Work", "-", "Folder"));
		TreeNode primefaces = new TreeNode(new Document("PrimeFaces", "-", "Folder"));
        documents.getChildren().add(work);
        documents.getChildren().add(primefaces);
		
		//Documents
		TreeNode expenses = new TreeNode("document", new Document("Expenses.doc", "30 KB", "Word Document"));
		TreeNode resume = new TreeNode("document", new Document("Resume.doc", "10 KB", "Word Document"));
		TreeNode refdoc = new TreeNode("document", new Document("RefDoc.pages", "40 KB", "Pages Document"));
        work.getChildren().add(expenses);
        work.getChildren().add(resume);
        primefaces.getChildren().add(refdoc);
		
		//Pictures
		TreeNode barca = new TreeNode("picture", new Document("barcelona.jpg", "30 KB", "JPEG Image"));
		TreeNode primelogo = new TreeNode("picture", new Document("logo.jpg", "45 KB", "JPEG Image"));
		TreeNode optimus = new TreeNode("picture", new Document("optimusprime.png", "96 KB", "PNG Image"));
		pictures.getChildren().add(barca);
        pictures.getChildren().add(primelogo);
        pictures.getChildren().add(optimus);
        
        return root;
    }
    
    @GET
    @Path("/lazydocuments")
    @Produces(MediaType.APPLICATION_JSON)
    public Collection<TreeNode> getLazyDocuments() {
        List<TreeNode> root = new ArrayList<TreeNode>();
        
		TreeNode document1 = new TreeNode(new Document("Folder X", "-", "Folder"));
		TreeNode document2 = new TreeNode(new Document("Folder Y", "-", "Folder"));
		TreeNode document3 = new TreeNode(new Document("Folder Z", "-", "Folder"));
        root.add(document1);
        root.add(document2);
        root.add(document3);
        
        return root;
    }
}
