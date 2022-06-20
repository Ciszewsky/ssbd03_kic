import {
    faClose,
    faEdit,
    faKey,
    faLock,
    faUnlockAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import ReactLoading from "react-loading";
import avatar from "../../../../assets/images/avatar.jpg";
import AccessLevel from "../../../../components/shared/AccessLevel/AccessLevel";
import flagPL from "../../../../assets/images/PL.png";
import flagEN from "../../../../assets/images/EN.png";
import {
    activateAccount,
    addAccesLevel,
    AddAccessLevelResponse,
    deactivateAccount,
    getAccount,
    GetAccountResponse,
    removeAccessLevel,
} from "../../../../api";
import { useNavigate } from "react-router";
import styles from "./style.module.scss";
import ConfirmActionModal from "../../../../components/shared/ConfirmActionModal/ConfirmActionModal";
import { showNotification } from "@mantine/notifications";
import Modal from "../../../../components/shared/Modal/Modal";
import ChangeUserPasswordPage from "../ChangeUserPasswordPage/ChangeUserPasswordPage";
import {
    failureNotificationItems,
    successNotficiationItems,
} from "../../../../utils/showNotificationsItems";
import ActionButton from "../../../../components/shared/ActionButton/ActionButton";
import InputWithValidation from "../../../../components/shared/InputWithValidation/InputWithValidation";
import ValidationMessage from "../../../../components/shared/ValidationMessage/ValidationMessage";
import { validationContext } from "../../../../context/validationContext";
import AddAccessLevelPage from "../AddAccessLevelPage/AddAccessLevelPage";

interface AccountDetailsPageProps {
    login: string;
    isOpened: boolean;
    onClose: () => void;
    isAdmin: boolean;
}

const AccountDetailsPage = ({
    login,
    isOpened,
    isAdmin,
    onClose,
}: AccountDetailsPageProps) => {
    const [account, setAccount] = useState<GetAccountResponse>();
    const [loading, setLoading] = useState<Loading>({
        pageLoading: true,
        actionLoading: false,
    });
    const [changePasswordModal, setChangePasswordModal] =
        useState<boolean>(false);

    const [accessLevelToProcess, setAccessLevelToProcess] =
        useState<AccessLevelType>("ADMINISTRATOR");
    const [isAccountBlockModalOpen, setAccountBlockModalOpen] =
        useState<boolean>(false);
    const [isAccountRemoveAccessLevelOpen, setAccountRemoveAccessLevelOpen] =
        useState<boolean>(false);
    const [isAddAccessLevelModalOpen, setAddAccessLevelModalOpen] =
        useState<boolean>(false);
    const accountsAccessLevels =
        account?.accessLevels.map((level) => level.level) ?? [];
    const navigate = useNavigate();

    const handleAccessLevelClick = async (
        level: AccessLevelType,
        alreadyHas: boolean
    ) => {
        setAccessLevelToProcess(level);
        if (alreadyHas) {
            setAccountRemoveAccessLevelOpen(true);
        } else {
            setAddAccessLevelModalOpen(true);
        }
    };

    const handleRemoveAccessLevel = async () => {
        setLoading({ ...loading, actionLoading: true });
        const level = accessLevelToProcess;
        if (!account) return;
        const response = await removeAccessLevel(account.login, {
            etag: account.etag,
            level,
        });
        if ("errorMessage" in response) {
            setLoading({ ...loading, actionLoading: false });
            showNotification(failureNotificationItems(response.errorMessage));
            return;
        }
        showNotification(
            successNotficiationItems("Poziom dostępu został usunięty")
        );
        setAccount(response);
        setLoading({ ...loading, actionLoading: false });
    };

    const handleGetAccount = async () => {
        setLoading({ pageLoading: true });
        const data = await getAccount(login);
        if ("errorMessage" in data) {
            showNotification(failureNotificationItems(data.errorMessage));
            return;
        }
        setAccount(data as GetAccountResponse);
        setLoading({ pageLoading: false });
    };

    const handleDeactivateActivateAccount = async (deactivate: boolean) => {
        if (!account) return;
        setLoading({ ...loading, actionLoading: true });
        if (deactivate) {
            const response = await deactivateAccount(
                account?.login as string,
                account?.etag as string
            );
            setLoading({ ...loading, actionLoading: false });
            if ("errorMessage" in response) {
                showNotification(
                    failureNotificationItems(response.errorMessage)
                );
                onClose();
                return;
            }
            showNotification(
                successNotficiationItems("Konto zostało deaktywowane")
            );
            onClose();
            return;
        } else {
            const response = await activateAccount(account.login, account.etag);
            if ("errorMessage" in response) {
                setLoading({ ...loading, actionLoading: false });
                showNotification(
                    failureNotificationItems(response.errorMessage)
                );
                onClose();
                return;
            }
            setLoading({ ...loading, actionLoading: false });
            showNotification(
                successNotficiationItems("Konto zostało aktywowane")
            );
            onClose();
            setLoading({ pageLoading: false });
        }
    };
    useEffect(() => {
        handleGetAccount();
    }, [isOpened]);

    return (
        <Modal isOpen={isOpened}>
            <section className={styles.account_details_page}>
                {loading.pageLoading ? (
                    <ReactLoading
                        type="bars"
                        color="#fff"
                        width="10rem"
                        height="10rem"
                    />
                ) : (
                    <div className={styles.content}>
                        <FontAwesomeIcon
                            className={styles.close_icon}
                            icon={faClose}
                            onClick={onClose}
                        />
                        <div className={styles.account_general_details}>
                            <img
                                className={styles.avatar}
                                src={avatar}
                                alt="Account general: Avatar"
                            />
                            <p className={styles.login}>{account?.login}</p>
                            <div className={styles.access_levels_wrapper}>
                                <p className={styles.title}>Poziomy dostępu:</p>

                                {["ADMINISTRATOR", "CLIENT", "SPECIALIST"].map(
                                    (entry) => (
                                        <AccessLevel
                                            key={entry}
                                            accessLevel={
                                                entry as AccessLevelType
                                            }
                                            clickable={true}
                                            selectable={false}
                                            grayed={
                                                !accountsAccessLevels.includes(
                                                    entry as AccessLevelType
                                                )
                                            }
                                            onClick={() => {
                                                handleAccessLevelClick(
                                                    entry as AccessLevelType,
                                                    accountsAccessLevels.includes(
                                                        entry as AccessLevelType
                                                    )
                                                );
                                            }}
                                        />
                                    )
                                )}
                            </div>
                            <div className={styles.actions_wrapper}>
                                <ActionButton
                                    isDisabled={isAdmin}
                                    onClick={() => {
                                        navigate(`/accounts/${login}`);
                                    }}
                                    title="Edytuj konto"
                                    color="green"
                                    icon={faEdit}
                                />
                                <ActionButton
                                    isDisabled={isAdmin}
                                    onClick={() => {
                                        setChangePasswordModal(true);
                                    }}
                                    title="Zmień hasło"
                                    color="purple"
                                    icon={faKey}
                                />
                                <ActionButton
                                    isDisabled={isAdmin}
                                    title={
                                        account?.active
                                            ? "Zablokuj konto"
                                            : "Odblokuj konto"
                                    }
                                    color="orange"
                                    icon={
                                        account?.active ? faLock : faUnlockAlt
                                    }
                                    onClick={() => {
                                        setAccountBlockModalOpen(true);
                                    }}
                                />
                            </div>
                        </div>
                        <div className={styles.account_details}>
                            <p className={styles.account_details_title}>
                                Dane szczegółowe
                            </p>
                            <div className={styles.details_wrapper}>
                                <div className={styles.detail_wrapper}>
                                    <p className={styles.title}>Imię:</p>
                                    <p className={styles.description}>
                                        {account?.firstName}
                                    </p>
                                </div>
                                <div className={styles.detail_wrapper}>
                                    <p className={styles.title}>Nazwisko:</p>
                                    <p className={styles.description}>
                                        {account?.lastName}
                                    </p>
                                </div>
                                <div className={styles.detail_wrapper}>
                                    <p className={styles.title}>Email:</p>
                                    <p className={styles.description}>
                                        {account?.email}
                                    </p>
                                </div>
                                {account?.accessLevels.some((level) => {
                                    return level.level === "CLIENT";
                                }) && (
                                    <div className={styles.detail_wrapper}>
                                        <p className={styles.title}>
                                            Numer PESEL:
                                        </p>
                                        <p className={styles.description}>
                                            {account?.accessLevels
                                                .filter(
                                                    (level) =>
                                                        level.level === "CLIENT"
                                                )
                                                .map((level) => level.pesel)}
                                        </p>
                                    </div>
                                )}
                                {account?.accessLevels.some((level) => {
                                    return (
                                        level.level === "ADMINISTRATOR" ||
                                        level.level === "SPECIALIST"
                                    );
                                }) && (
                                    <div className={styles.detail_wrapper}>
                                        <p className={styles.title}>
                                            Numer telefonu:
                                        </p>
                                        <p className={styles.description}>
                                            {account?.accessLevels
                                                .filter(
                                                    (level) =>
                                                        level.level ===
                                                            "ADMINISTRATOR" ||
                                                        "SPECIALIST"
                                                )
                                                .map(
                                                    (level) => level.phoneNumber
                                                )}
                                        </p>
                                    </div>
                                )}
                                <div className={styles.detail_wrapper}>
                                    <p className={styles.title}>Język:</p>
                                    <img
                                        src={
                                            account?.language?.language === "pl"
                                                ? flagPL
                                                : flagEN
                                        }
                                        alt="Detail description: language"
                                        className={styles.flag}
                                    />
                                </div>
                            </div>
                        </div>
                        <ChangeUserPasswordPage
                            isOpen={changePasswordModal}
                            onClose={() => {
                                setChangePasswordModal(false);
                            }}
                            login={login}
                        />
                        <ConfirmActionModal
                            title={
                                account?.active
                                    ? "Zablokuj konto"
                                    : "Odblokuj konto"
                            }
                            isLoading={loading.actionLoading as boolean}
                            isOpened={isAccountBlockModalOpen}
                            handleFunction={async () => {
                                await handleDeactivateActivateAccount(
                                    account?.active as boolean
                                );
                                setAccountBlockModalOpen(false);
                            }}
                            onClose={() => {
                                setAccountBlockModalOpen(false);
                            }}
                        >
                            Czy na pewno chcesz{" "}
                            {account?.active ? "zablokować" : "odblokować"}{" "}
                            konto? Operacja jest nieodwracalna.
                        </ConfirmActionModal>
                        <ConfirmActionModal
                            title="Usuń poziom dostępu"
                            isLoading={loading.actionLoading as boolean}
                            isOpened={isAccountRemoveAccessLevelOpen}
                            handleFunction={async () => {
                                await handleRemoveAccessLevel();
                                setAccountRemoveAccessLevelOpen(false);
                            }}
                            onClose={() => {
                                setAccountRemoveAccessLevelOpen(false);
                            }}
                        >
                            Czy na pewno chcesz usunąć poziom dostępu ? Operacja
                            jest nieodwracalna.
                        </ConfirmActionModal>
                        <AddAccessLevelPage
                            isLoading={loading.actionLoading as boolean}
                            isOpened={isAddAccessLevelModalOpen}
                            account={account}
                            onClose={() => {
                                setAddAccessLevelModalOpen(false);
                            }}
                            setAccount={async (account: GetAccountResponse) => {
                                setAccount(account);
                            }}
                            accessLevel={accessLevelToProcess}
                        />
                    </div>
                )}
            </section>
        </Modal>
    );
};

export default AccountDetailsPage;