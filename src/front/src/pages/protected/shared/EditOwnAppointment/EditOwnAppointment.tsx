import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import {
    ChronoUnit,
    Instant,
    LocalDateTime,
    ZoneId,
    ZoneOffset,
} from "@js-joda/core";
import { showNotification } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ReactLoading from "react-loading";
import { useNavigate, useParams } from "react-router";
import { editOwnAppointment, getAppointmentDetails } from "../../../../api";
import ActionButton from "../../../../components/shared/ActionButton/ActionButton";
import { useStoreSelector } from "../../../../redux/reduxHooks";
import { failureNotificationItems } from "../../../../utils/showNotificationsItems";
import styles from "./style.module.scss";

export const EditOwnAppointment = () => {
    const aLevel = useStoreSelector((state) => state.user.cur);
    const [count, setCount] = useState<number>(0);
    const [version, setVersion] = useState(0);
    const [appointment, setAppointment] = useState<AppointmentDto>();
    const [etag, setEtag] = useState<string>("");
    const [inputStatus, setInputStatus] = useState<Status>("PENDING");
    const [loading, setLoading] = useState<Loading>({
        pageLoading: true,
        actionLoading: false,
    });
    const [inputDescription, setInputDescription] = useState<string>("");
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    let { id } = useParams();
    const navigate = useNavigate();

    const handleGetAppointmentDetails = async () => {
        if (!id) return;
        const data = await getAppointmentDetails(id);
        if ("errorMessage" in data) {
            showNotification(failureNotificationItems(data.errorMessage));
            return;
        }
        setEtag(data.etag);
        setVersion(data.version);
        setInputStatus(data.status);
        setInputDescription(data.description);
        setAppointment(data);
        setCount(data.description.length);
        setLoading({ pageLoading: false, actionLoading: false });
    };
    useEffect(() => {
        handleGetAppointmentDetails();
    }, []);

    const handleEditOwnAppointment = async () => {
        if (!id || !etag || !appointment) return;
        let status;
        if (aLevel === "SPECIALIST") status = inputStatus;
        else status = appointment.status;
        let description;
        if (aLevel === "SPECIALIST") description = inputDescription;
        else description = appointment.description;
        let editedDate = LocalDateTime.parse(startDate).toInstant(
            ZoneOffset.of(ZoneId.UTC.id())
        );
        editedDate = editedDate.minus(2, ChronoUnit.HOURS);
        const data = await editOwnAppointment({
            version,
            id,
            etag,
            status,
            description,
            startDate: editedDate,
        });
        if ("errorMessage" in data) {
            showNotification(failureNotificationItems(data.errorMessage));
            return;
        }
        navigate("/visits");
    };
    useEffect(() => {
        if (!appointment) return;
        const startDate = Instant.parse(appointment.startDate);
        const fixedStartDate = LocalDateTime.ofInstant(startDate);
        const endDate = Instant.parse(appointment.endDate);
        const fixedEndDate = LocalDateTime.ofInstant(endDate);
        setStartDate(fixedStartDate.truncatedTo(ChronoUnit.MINUTES).toString());
        setEndDate(fixedEndDate.truncatedTo(ChronoUnit.MINUTES).toString());
    }, [appointment]);

    const { t } = useTranslation();

    return (
        <div className={styles.edit_appointment_page}>
            {loading.pageLoading ? (
                <ReactLoading
                    type="cylon"
                    color="#fff"
                    width="10rem"
                    height="10rem"
                    className={styles.loading}
                />
            ) : (
                <div className={styles.account_details}>
                    <p className={styles.account_details_title}>
                        {t("editOwnAppointment.title")}
                    </p>
                    <div className={styles.details_wrapper}>
                        <div className={styles.detail_wrapper}>
                            <p className={styles.title}>
                                {aLevel === "SPECIALIST"
                                    ? t("editOwnAppointment.clientName")
                                    : t("editOwnAppointment.specialistName")}
                            </p>
                            <p className={styles.description}>
                                {aLevel === "SPECIALIST"
                                    ? appointment?.client.firstName +
                                      " " +
                                      appointment?.client.lastName
                                    : appointment?.specialist.firstName +
                                      " " +
                                      appointment?.specialist.lastName}
                            </p>
                        </div>
                        <div className={styles.detail_wrapper}>
                            <p className={styles.title}>
                                {t("editOwnAppointment.email")}
                            </p>
                            <p className={styles.description}>
                                {appointment?.specialist.email}
                            </p>
                        </div>
                        <div className={styles.detail_wrapper}>
                            <p className={styles.title}>
                                {t("editOwnAppointment.status")}
                            </p>
                            <p className={styles.description}>
                                {appointment?.status}
                            </p>
                            {aLevel === "SPECIALIST" &&
                                appointment?.status !== "ACCEPTED" && (
                                    <>
                                        <input
                                            className={styles.input_checkbox}
                                            type="checkbox"
                                            value={inputDescription}
                                            onChange={(e) => {
                                                if (e.target.value)
                                                    setInputStatus("ACCEPTED");
                                                else {
                                                    setInputStatus("PENDING");
                                                }
                                            }}
                                        />
                                        <p className={styles.title}>
                                            {t("editOwnAppointment.accept")}
                                        </p>
                                    </>
                                )}
                        </div>
                        <div className={styles.detail_wrapper}>
                            <p className={styles.title}>
                                {t("editOwnAppointment.price")}
                            </p>
                            <p className={styles.description}>
                                {appointment?.price + "zł"}
                            </p>
                        </div>
                        <div className={styles.detail_wrapper}>
                            <p className={styles.title}>
                                {t("editOwnAppointment.dateStart")}
                            </p>
                            <p className={styles.description}>{startDate}</p>
                            <input
                                className={styles.input_checkbox}
                                type="datetime-local"
                                onChange={(e) => {
                                    setStartDate(e.target.value);
                                }}
                            />
                        </div>
                        <div className={styles.detail_wrapper}>
                            <p className={styles.title}>
                                {t("editOwnAppointment.dateEnd")}
                            </p>
                            <p className={styles.description}>{endDate}</p>
                        </div>
                        <div className={styles.detail_wrapper}>
                            <p className={styles.title}>
                                {t("editOwnAppointment.implantName")}
                            </p>
                            <p className={styles.description}>
                                {appointment?.appointmentImplant.name}
                            </p>
                        </div>
                        <div className={styles.detail_wrapper}>
                            <p className={styles.title}>
                                {t("editOwnAppointment.implantPrice")}
                            </p>
                            <p className={styles.description}>
                                {appointment?.appointmentImplant.price + "zł"}
                            </p>
                        </div>
                        <div className={styles.detail_wrapper}>
                            <p className={styles.title}>
                                {t("editOwnAppointment.implantDuration")}
                            </p>
                            <p className={styles.description}>
                                {appointment!.appointmentImplant.duration/60 + ' min'}
                            </p>
                        </div>
                        <div className={styles.detail_wrapper}>
                            <p className={styles.title}>
                                {t("editOwnAppointment.implantManufacturer")}
                            </p>
                            <p className={styles.description}>
                                {appointment?.appointmentImplant.manufacturer + "zł"}
                            </p>
                        </div>
                        <div className={styles.detail_wrapper}>
                            <p className={styles.title}>
                                {t("editOwnAppointment.description")}
                            </p>
                            <p className={styles.description}>
                                {aLevel === "CLIENT" &&
                                    appointment?.description}
                            </p>
                            {aLevel === "SPECIALIST" && (
                                <>
                                    <textarea
                                        className={styles.description_input}
                                        value={inputDescription}
                                        maxLength={950}
                                        onChange={(e) => {
                                            setInputDescription(e.target.value);
                                            setCount(e.target.value.length);
                                        }}
                                    />
                                    <div className={styles.description_length}>
                                        {count}/950
                                    </div>
                                </>
                            )}
                        </div>
                        <div className={styles.detail_wrapper}>
                            {
                                <ActionButton
                                    title={t("editOwnAppointment.button")}
                                    color="cyan"
                                    icon={faInfoCircle}
                                    onClick={() => handleEditOwnAppointment()}
                                ></ActionButton>
                            }
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
