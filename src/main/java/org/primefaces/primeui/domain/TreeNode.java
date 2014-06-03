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
package org.primefaces.primeui.domain;

import java.util.ArrayList;
import java.util.List;

public class TreeNode {
    
    private String label;
    private Object data;
    private boolean leaf;
    private List<TreeNode> children;
    
    public TreeNode(Object data) {
        this.data = data;
        this.children = new ArrayList<TreeNode>();
    }
    
    public TreeNode(String label, Object data) {
        this.label = label;
        this.data = data;
        this.children = new ArrayList<TreeNode>();
    }

    public TreeNode(String label, Object data, boolean leaf) {
        this.label = label;
        this.data = data;
        this.leaf = leaf;
        this.children = new ArrayList<TreeNode>();
    }

    public String getLabel() {
        return label;
    }
    public void setLabel(String label) {
        this.label = label;
    }

    public Object getData() {
        return data;
    }
    public void setData(Object data) {
        this.data = data;
    }

    public boolean isLeaf() {
        return leaf;
    }
    public void setLeaf(boolean leaf) {
        this.leaf = leaf;
    }

    public List<TreeNode> getChildren() {
        return children;
    }
    public void setChildren(List<TreeNode> children) {
        this.children = children;
    }    
}
