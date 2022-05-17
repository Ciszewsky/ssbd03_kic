import { useTranslation } from "react-i18next";
import { FaPhoneAlt, FaInstagram, FaFacebook } from "react-icons/fa";
import { HiOutlineMailOpen } from "react-icons/hi";
import "./style.scss";

const ContactBar = () => {
  const { t } = useTranslation();

  return (
    <div className="contact_section">
      <div className="contact">
        <div className="contact_section_title1">{t("contact")}</div>
        <div className="contact_section_items">
          <div className="contact_section_item">
            <FaPhoneAlt className="contact_icon" />
            +48 303030300
          </div>
          <div className="contact_section_item">
            <HiOutlineMailOpen className="contact_icon" />
            KIC@kic.agency
          </div>
        </div>
      </div>
      <div className="social_media">
        <div className="contact_section_title2">{t("social_media")}</div>
        <div className="contact_section_items">
          <div className="contact_section_item">
            <FaFacebook className="contact_icon" />
            KIC
          </div>
          <div className="contact_section_item">
            <FaInstagram className="contact_icon" />
            @KIC
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactBar;
