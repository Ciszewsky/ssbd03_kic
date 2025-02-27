import {
    faCancel,
    faClose,
    faEdit,
    faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChronoUnit, Instant, LocalDateTime } from "@js-joda/core";
import { showNotification } from "@mantine/notifications";
import { useEffect, useState } from "react";
import ReactLoading from "react-loading";
import ImplantDetails from "../../../../components/ImplantDetails/ImplantDetails";
import ActionButton from "../../../../components/shared/ActionButton/ActionButton";
import Modal from "../../../../components/shared/Modal/Modal";
import { useStoreSelector } from "../../../../redux/reduxHooks";
import {
    failureNotificationItems,
    successNotficiationItems,
} from "../../../../utils/showNotificationsItems";
import styles from "./style.module.scss";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ConfirmActionModal from "../../../../components/shared/ConfirmActionModal/ConfirmActionModal";
import {
    cancelAnyAppointment,
    cancelOwnAppointment,
    finishAppointment,
    getAppointmentDetails,
} from "../../../../api";

interface AccountDetailsProps {
    isOpened: boolean;
    appointmentId: string;
    onClose: () => void;
}
export const AppointmentDetails = ({
    isOpened,
    appointmentId,
    onClose,
}: AccountDetailsProps) => {
    const aLevel = useStoreSelector((state) => state.user.cur);
    const [loading, setLoading] = useState<Loading>({
        pageLoading: true,
        actionLoading: false,
    });
    let navigate = useNavigate();
    const routeChange = (id: string) => {
        let path = `/visit/edit/${id}`;
        navigate(path);
    };
    const [implantModal, setImplantModal] = useState<boolean>(false);
    const [appointment, setAppointment] = useState<AppointmentDto>();
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [implantId, setImplantId] = useState<string>("");
    const [etag, setEtag] = useState<string>("");
    const [appointmentBlockModalOpen, setAppointmentBlockModalOpen] =
        useState<boolean>(false);
    const [isFinishVisitModalOpen, setFinishVisitModalOpen] =
        useState<boolean>(false);
    const [isFinishOwnVisitModalOpen, setFinishOwnVisitModalOpen] =
        useState<boolean>(false);

    const handleGetAppointmentDetails = async () => {
        const data = await getAppointmentDetails(appointmentId);
        if ("errorMessage" in data) {
            showNotification(failureNotificationItems(data.errorMessage));
            return;
        }
        setAppointment(data);
        setImplantId(data.implant.id);
        setEtag(data.etag);
        setLoading({ pageLoading: false, actionLoading: false });
    };

    const { t } = useTranslation();

    const handleCancelVisit = async () => {
        setLoading({ ...loading, actionLoading: true });
        const response = await cancelAnyAppointment(
            appointmentId as string,
            etag as string
        );
        setLoading({ ...loading, actionLoading: false });
        if ("errorMessage" in response) {
            showNotification(failureNotificationItems(response.errorMessage));
            onClose();
            return;
        }
        showNotification(successNotficiationItems("Wizyta została anulowana"));
        onClose();
        return;
    };

    const handleCancelOwnVisit = async () => {
        setLoading({ ...loading, actionLoading: true });
        const response = await cancelOwnAppointment(
            appointmentId as string,
            etag as string
        );
        setLoading({ ...loading, actionLoading: false });
        if ("errorMessage" in response) {
            showNotification(failureNotificationItems(response.errorMessage));
            onClose();
            return;
        }
        showNotification(successNotficiationItems("Wizyta została anulowana"));
        onClose();
        return;
    };

    const handleFinishVisit = async () => {
        setLoading({ ...loading, actionLoading: true });
        const response = await finishAppointment(
            appointmentId as string,
            etag as string
        );
        setLoading({ ...loading, actionLoading: false });
        if ("errorMessage" in response) {
            showNotification(failureNotificationItems(response.errorMessage));
            onClose();
            return;
        }
        showNotification(successNotficiationItems("Wizyta została zakończona"));
        onClose();
        return;
    };

    useEffect(() => {
        if (!appointment) return;
        const startDate = Instant.parse(appointment.startDate);
        const fixedStartDate = LocalDateTime.ofInstant(startDate);
        const endDate = Instant.parse(appointment.endDate);
        const fixedEndDate = LocalDateTime.ofInstant(endDate);
        setStartDate(
            fixedStartDate
                .truncatedTo(ChronoUnit.MINUTES)
                .toString()
                .replace("T", " ")
        );
        setEndDate(
            fixedEndDate
                .truncatedTo(ChronoUnit.MINUTES)
                .toString()
                .replace("T", " ")
        );
    }, [appointment]);

    useEffect(() => {
        handleGetAppointmentDetails();
    }, [isOpened]);

    return (
        <Modal isOpen={isOpened}>
            <section className={styles.account_details_page}>
                {loading.pageLoading ? (
                    <ReactLoading
                        type="cylon"
                        color="#fff"
                        width="10rem"
                        height="10rem"
                        className={styles.loading}
                    />
                ) : (
                    <div className={styles.content}>
                        <FontAwesomeIcon
                            className={styles.close_icon}
                            icon={faClose}
                            onClick={onClose}
                        />
                        <div className={styles.account_details}>
                            <p className={styles.account_details_title}>
                                {t("appointmentDetails.title")}
                            </p>
                            <div className={styles.details_wrapper}>
                                <div className={styles.detail_wrapper}>
                                    <p className={styles.title}>
                                        {aLevel === "SPECIALIST"
                                            ? t("appointmentDetails.clientName")
                                            : t(
                                                  "appointmentDetails.specialistName"
                                              )}
                                    </p>
                                    <p className={styles.description}>
                                        {aLevel === "SPECIALIST"
                                            ? appointment?.client.firstName +
                                              " " +
                                              appointment?.client.lastName
                                            : appointment?.specialist
                                                  .firstName +
                                              " " +
                                              appointment?.specialist.lastName}
                                    </p>
                                </div>
                                <div className={styles.detail_wrapper}>
                                    <p className={styles.title}>
                                        {t("appointmentDetails.email")}
                                    </p>
                                    <p className={styles.description}>
                                        {appointment?.specialist.email}
                                    </p>
                                </div>
                                <div className={styles.detail_wrapper}>
                                    <p className={styles.title}>
                                        {t("appointmentDetails.status")}{" "}
                                    </p>
                                    <p className={styles.description}>
                                        {appointment?.status}
                                    </p>
                                </div>
                                <div className={styles.detail_wrapper}>
                                    <p className={styles.title}>
                                        {" "}
                                        {t("appointmentDetails.price")}
                                    </p>
                                    <p className={styles.description}>
                                        {appointment?.price + "zł"}
                                    </p>
                                </div>
                                <div className={styles.detail_wrapper}>
                                    <p className={styles.title}>
                                        {t("appointmentDetails.dateStart")}{" "}
                                    </p>
                                    <p className={styles.description}>
                                        {startDate}
                                    </p>
                                </div>
                                <div className={styles.detail_wrapper}>
                                    <p className={styles.title}>
                                        {t("appointmentDetails.dateEnd")}{" "}
                                    </p>
                                    <p className={styles.description}>
                                        {endDate}
                                    </p>
                                </div>
                                <div className={styles.detail_wrapper}>
                                    <p className={styles.title}>
                                        {t("appointmentDetails.implant")}{" "}
                                    </p>
                                    <div className={styles.description}>
                                        <ActionButton
                                            title={t(
                                                "appointmentDetails.button"
                                            )}
                                            color="cyan"
                                            icon={faInfoCircle}
                                            onClick={() =>
                                                setImplantModal(true)
                                            }
                                        ></ActionButton>
                                    </div>
                                </div>
                                <div className={styles.detail_wrapper}>
                                    <p className={styles.title}>
                                        {" "}
                                        {t("appointmentDetails.description")}
                                    </p>
                                    <p className={styles.description}>
                                        {appointment?.description}
                                    </p>
                                </div>
                            </div>
                            <div className={styles.button_holder}>
                                {appointment?.status !== "REJECTED" &&
                                    appointment?.status !== "FINISHED" &&
                                    ["SPECIALIST", "CLIENT"].includes(
                                        aLevel
                                    ) && (
                                        <ActionButton
                                            title={t(
                                                "appointmentDetails.buttonCancel"
                                            )}
                                            color="red"
                                            icon={faCancel}
                                            onClick={() => {
                                                setFinishOwnVisitModalOpen(
                                                    true
                                                );
                                            }}
                                        ></ActionButton>
                                    )}
                                {appointment?.status !== "REJECTED" &&
                                appointment?.status !== "FINISHED" &&
                                aLevel === "SPECIALIST" ? (
                                    <ActionButton
                                        title={t(
                                            "appointmentDetails.buttonFinish"
                                        )}
                                        color="orange"
                                        icon={faInfoCircle}
                                        onClick={() => {
                                            setFinishVisitModalOpen(true);
                                        }}
                                    ></ActionButton>
                                ) : null}
                                <ActionButton
                                    title={t("appointmentDetails.buttonEdit")}
                                    color="green"
                                    icon={faEdit}
                                    onClick={() => routeChange(appointmentId)}
                                ></ActionButton>
                                {appointment?.status !== "REJECTED" &&
                                appointment?.status !== "FINISHED" &&
                                aLevel === "ADMINISTRATOR" ? (
                                    <ActionButton
                                        title={t(
                                            "appointmentDetails.buttonCancel"
                                        )}
                                        color="red"
                                        icon={faCancel}
                                        onClick={() => {
                                            setAppointmentBlockModalOpen(true);
                                        }}
                                    ></ActionButton>
                                ) : null}

                                <ConfirmActionModal
                                    title={t(
                                        "appointmentDetails.modal.cancel.title"
                                    )}
                                    isLoading={loading.actionLoading as boolean}
                                    isOpened={isFinishOwnVisitModalOpen}
                                    handleFunction={async () => {
                                        await handleCancelOwnVisit();
                                        setFinishOwnVisitModalOpen(false);
                                        window.location.reload();
                                    }}
                                    onClose={() => {
                                        setFinishOwnVisitModalOpen(false);
                                    }}
                                >
                                    {t("appointmentDetails.modal.cancel.text")}
                                </ConfirmActionModal>
                                <ConfirmActionModal
                                    title={t(
                                        "appointmentDetails.modal.cancel.title"
                                    )}
                                    isLoading={loading.actionLoading as boolean}
                                    isOpened={appointmentBlockModalOpen}
                                    handleFunction={async () => {
                                        await handleCancelVisit();
                                        setAppointmentBlockModalOpen(false);
                                        window.location.reload();
                                    }}
                                    onClose={() => {
                                        setAppointmentBlockModalOpen(false);
                                    }}
                                >
                                    {t("appointmentDetails.modal.cancel.text")}
                                </ConfirmActionModal>
                                <ConfirmActionModal
                                    title={t(
                                        "appointmentDetails.modal.finish.title"
                                    )}
                                    isLoading={loading.actionLoading as boolean}
                                    isOpened={isFinishVisitModalOpen}
                                    handleFunction={async () => {
                                        await handleFinishVisit();
                                        setFinishVisitModalOpen(false);
                                        window.location.reload();
                                    }}
                                    onClose={() => {
                                        setFinishVisitModalOpen(false);
                                    }}
                                >
                                    {t("appointmentDetails.modal.finish.text")}
                                </ConfirmActionModal>
                            </div>
                        </div>
                        <ImplantDetails
                            id={implantId}
                            isOpened={implantModal}
                            onClose={() => {
                                setImplantModal(false);
                            }}
                        />
                    </div>
                )}
            </section>
        </Modal>
    );
};
