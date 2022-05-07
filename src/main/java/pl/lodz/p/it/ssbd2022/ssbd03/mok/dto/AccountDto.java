package pl.lodz.p.it.ssbd2022.ssbd03.mok.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import pl.lodz.p.it.ssbd2022.ssbd03.mok.model.Account;

@Data
@NoArgsConstructor
public class AccountDto {

    @NotNull
    private String login;
    @NotNull
    private String firstName;
    @NotNull
    private String surname;
    @NotNull
    private String email;

    // na późniejszą wersję (na innym branchy)
    // @NotNull
    private String phoneNumber;

    private Long version;

    public AccountDto(Account account) {
        this.login = account.getLogin();
        this.firstName = account.getFirstName();
        this.surname = account.getSurname();
        this.email = account.getEmail();
        this.version = account.getVersion();
    }

}
