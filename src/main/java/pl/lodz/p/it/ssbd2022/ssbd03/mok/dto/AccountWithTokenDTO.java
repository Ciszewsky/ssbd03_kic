package pl.lodz.p.it.ssbd2022.ssbd03.mok.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class AccountWithTokenDTO {

    @NotNull
    private String token;
    @NotNull
    private String login;
    @NotNull
    private String password;

}
