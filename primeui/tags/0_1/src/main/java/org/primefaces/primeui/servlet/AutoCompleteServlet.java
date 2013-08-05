
package org.primefaces.primeui.servlet;

import java.io.IOException;
import java.io.Writer;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class AutoCompleteServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String query = req.getParameter("query");
        Writer w = resp.getWriter();
        
        
        w.write("[");
        for(int i = 0; i < 10; i++) {
            String item = query + i;
            
            w.write("{");
            w.write("\"label\":\"" + item + "\"");
            w.write(",\"value\":\"" + item + "\"");
            w.write("}");   
            
            if(i != 9) {
                w.write(",");
            }
        }
        w.write("]");
        
        resp.setContentType("application/json");
    }
}

