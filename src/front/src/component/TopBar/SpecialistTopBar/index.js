import { useNavigate } from "react-router-dom";
import "./style.scss";
import {Logout} from "../SelectorTopBar";
import LangSelect from "../../LangSelect/LangSelect";

const SpecialistTopBar = () => {
  const navigate = useNavigate();

  return (
    <div className="topBar">
      <div className="logo" onClick={() => navigate("/", { replace: false })}>
        <img src="logo.jpg" alt="Logo" height="80px" />
      </div>
      <div className="links">
        <div className="item">CYBERWSZCZEPY</div>
        <div className="item">SPECJALIŚCI</div>
        <div
          className="item"
          onClick={() => navigate("/specialist", { replace: false })}
        >
          SPECIALISTPAGE
        </div>
        <div className="item">
          <LangSelect />
        </div>
          <Logout/>
      </div>
    </div>
  );
};

export default SpecialistTopBar;
