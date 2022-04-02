package pl.lodz.p.it.ssbd2022.ssbd03.facades;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import pl.lodz.p.it.ssbd2022.ssbd03.model.DataAdministrator;

public class DataAdministratorFacade extends AbstractFacade{
    @PersistenceContext(unitName = "ssbd03adminPU")
    private EntityManager em;


    public DataAdministratorFacade(Class entityClass) {
        super(entityClass);
    }

    @Override
    protected EntityManager getEntityManager() {
        return em;
    }
}
