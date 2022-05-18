package pl.lodz.p.it.ssbd2022.ssbd03.exceptions;

import jakarta.ejb.ApplicationException;
import jakarta.ws.rs.core.Response;

// TODO: Dodanie Javadoc
@ApplicationException(rollback = true)
public class MethodNotImplementedException extends AppBaseException{

    public static final String MESSAGE = "server.error.appBase.methodNotImplemented";

    public MethodNotImplementedException() {
        super(MESSAGE, Response.Status.NOT_IMPLEMENTED);
    }

}
