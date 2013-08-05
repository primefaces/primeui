package org.primefaces.primeui.client;

import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.api.client.WebResource;
import com.sun.jersey.api.client.config.ClientConfig;
import com.sun.jersey.api.client.config.DefaultClientConfig;
import java.net.URI;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.UriBuilder;

public class HelloServletClient {
 
    public static void main(String[] args) {
        ClientConfig config = new DefaultClientConfig();
        Client client = Client.create(config);
        WebResource service = client.resource(getBaseURI());
        

        System.out.println(service.path("rest").path("hello").accept(MediaType.TEXT_PLAIN).get(ClientResponse.class).toString());

        System.out.println(service.path("rest").path("hello").accept(MediaType.TEXT_PLAIN).get(String.class));

        System.out.println(service.path("rest").path("hello").accept(MediaType.TEXT_XML).get(String.class));

        System.out.println(service.path("rest").path("hello").accept(MediaType.TEXT_HTML).get(String.class));
    }

    private static URI getBaseURI() {
        return UriBuilder.fromUri("http://localhost:8080/prime-ui").build();
    }
}
