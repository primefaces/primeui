
package org.primefaces.primeui.servlet;

import java.io.IOException;
import java.io.Writer;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class TabContentServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        int index = Integer.parseInt(req.getParameter("tabindex")) + 1;
        Writer w = resp.getWriter();
        
        w.write("<div>");
        w.write("<p>Dynamic Content for Tab " + index + "</p>");
        w.write("</div>");
        
        resp.setContentType("text/html");
    }
}

