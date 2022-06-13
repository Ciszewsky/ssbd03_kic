package pl.lodz.p.it.ssbd2022.ssbd03.exceptions.appointment;

import jakarta.ejb.ApplicationException;
import jakarta.ws.rs.core.Response;
import pl.lodz.p.it.ssbd2022.ssbd03.exceptions.AppBaseException;
import pl.lodz.p.it.ssbd2022.ssbd03.exceptions.account.AccountStatusException;

/**
 * Wyjątek reprezentujący błąd związany z próbą anulowania wizyty
 */
@ApplicationException(rollback = true)
public class AppointmentStatusException extends AppBaseException {

    private static final String APPOINTMENT_STATUS_ALREADY_CANCELLED = "server.error.appBase.appointmentAlreadyCancelled";
    private static final String APPOINTMENT_STATUS_ALREADY_FINISHED = "server.error.appBase.appointmentAlreadyFinished";


    /**
     * Metoda będąca konstruktorem odpowiadającym za tworzenie wyjątków dotyczących błędów
     * w ramach anulowania wizyty
     *
     * @param message Wiadomość zawarta w wyjątku
     */

    public AppointmentStatusException(String message) {
        super(message, Response.Status.BAD_REQUEST);
    }

    /**
     * Metoda zwracająca wyjątek w przypadku próby anulowania wizyty, gdy została już ona anulowana
     *
     * @return Wyjątek typu AppointmentStatusException, response status Bad Request
     */
    public static AppointmentStatusException appointmentStatusAlreadyCancelled() {
        return new AppointmentStatusException(APPOINTMENT_STATUS_ALREADY_CANCELLED);
    }

    /**
     * Metoda zwracająca wyjątek w przypadku próby anulowania wizyty, gdy została już ona zakończona
     *
     * @return Wyjątek typu AppointmentStatusException, response status Bad Request
     */
    public static AppointmentStatusException appointmentStatusAlreadyFinished() {
        return new AppointmentStatusException(APPOINTMENT_STATUS_ALREADY_FINISHED);
    }


}
