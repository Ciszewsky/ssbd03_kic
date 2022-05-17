package pl.lodz.p.it.ssbd2022.ssbd03.mappers;

import jakarta.ejb.Stateless;
import jakarta.inject.Inject;
import pl.lodz.p.it.ssbd2022.ssbd03.common.AbstractEntity;
import pl.lodz.p.it.ssbd2022.ssbd03.common.TaggedDto;
import pl.lodz.p.it.ssbd2022.ssbd03.entities.Account;
import pl.lodz.p.it.ssbd2022.ssbd03.entities.access_levels.DataClient;
import pl.lodz.p.it.ssbd2022.ssbd03.mok.dto.AccountDto;
import pl.lodz.p.it.ssbd2022.ssbd03.mok.dto.AccountWithAccessLevelsDto;
import pl.lodz.p.it.ssbd2022.ssbd03.mok.dto.CreateAccountDto;
import pl.lodz.p.it.ssbd2022.ssbd03.mok.dto.RegisterClientAccountDto;
import pl.lodz.p.it.ssbd2022.ssbd03.mok.dto.RegisterClientAccountDto;
import pl.lodz.p.it.ssbd2022.ssbd03.mok.dto.access_levels.AccessLevelDto;
import pl.lodz.p.it.ssbd2022.ssbd03.utils.HashAlgorithm;
@Stateless
public class AccountMapper {

    @Inject
    private HashAlgorithm hashAlgorithm;

    @Inject
    private AccessLevelMapper accessLevelMapper;

    public Account createAccountfromCreateAccountDto(CreateAccountDto createAccountDto) {
        Account account = new Account();
        account.setLogin(createAccountDto.getLogin());
        account.setFirstName(createAccountDto.getFirstName());
        account.setLastName(createAccountDto.getLastName());
        account.setEmail(createAccountDto.getEmail());
        account.setPassword(hashAlgorithm.generate(createAccountDto.getPassword().toCharArray()));
        account.setActive(true);
        account.setConfirmed(true);
        account.setLanguage(createAccountDto.getLanguage());

        return account;
    }

    public Account createAccountfromCreateClientAccountDto(RegisterClientAccountDto registerClientAccountDto) {
        Account account = new Account();
        account.setLogin(registerClientAccountDto.getLogin());
        account.setFirstName(registerClientAccountDto.getFirstName());
        account.setLastName(registerClientAccountDto.getLastName());
        account.setEmail(registerClientAccountDto.getEmail());
        account.setPassword(hashAlgorithm.generate(registerClientAccountDto.getPassword().toCharArray()));
        account.setActive(true);
        account.setConfirmed(false);
        DataClient dataClient = new DataClient();
        dataClient.setPesel(registerClientAccountDto.getPesel());
        dataClient.setPhoneNumber(registerClientAccountDto.getPhoneNumber());
        account.addAccessLevel(dataClient);
        return account;
    }

    public Account createAccountFromDto(AccountWithAccessLevelsDto accountDto) {
        Account account = new Account();
        account.setLogin(accountDto.getLogin());
        account.setFirstName(accountDto.getFirstName());
        account.setLastName(accountDto.getLastName());

        for (AccessLevelDto accessLevelDto : accountDto.getAccessLevels()) {
            account.addAccessLevel(accessLevelMapper.createAccessLevelFromDto(accessLevelDto));
        }
        return account;
    }

    public TaggedDto tagDto(TaggedDto dto, AbstractEntity entity) {
        dto.setTag(hashAlgorithm.generateDtoTag(
                entity.getId(),
                entity.getVersion()
        ));
        return dto;
    }

    public AccountDto createAccountDtoFromAccount(Account account) {
        AccountDto accountDto = new AccountDto(
                account.getLogin(),
                account.getFirstName(),
                account.getLastName(),
                account.isActive(),
                account.isConfirmed(),
                account.getEmail(),
                account.getLanguage()
        );
        return (AccountDto) tagDto(accountDto, account);
    }

    public AccountWithAccessLevelsDto createAccountWithAccessLevelsDtoFromAccount(Account account) {
        AccountWithAccessLevelsDto accountDto = new AccountWithAccessLevelsDto(
                account.getLogin(),
                account.getFirstName(),
                account.getLastName(),
                account.isActive(),
                account.isConfirmed(),
                account.getLanguage(),
                accessLevelMapper.createListOfAccessLevelDTO(account.getAccessLevelCollection())

        );
        return (AccountWithAccessLevelsDto) tagDto(accountDto, account);
    }



}
