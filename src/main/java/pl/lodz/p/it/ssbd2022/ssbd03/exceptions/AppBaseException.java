package pl.lodz.p.it.ssbd2022.ssbd03.exceptions;

import jakarta.ejb.ApplicationException;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Response;

@ApplicationException(rollback = true)
public class AppBaseException extends WebApplicationException {

    protected AppBaseException(String message, Response.Status status) {
        super(message, status);
    }
}
