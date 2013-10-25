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

import java.util.Arrays;
import java.util.Date;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

@Path("/terminal")
public class TerminalService {
    
    @GET
    @Path("{command}")
    @Produces(MediaType.TEXT_PLAIN)
    public String handleCommand(@PathParam("command") String command) {
        String tokens[] = command.split(" ");
		String commandName = tokens[0];
		String[] args = Arrays.copyOfRange(tokens, 1, tokens.length);
        
		if(commandName.equals("greet")) {
            if(args.length > 0)
                return "Hello " + args[0];
            else
                return "Hello Stranger";
        }
		else if(commandName.equals("date"))
			return new Date().toString();
		else
			return commandName + " not found";
	}  
}
