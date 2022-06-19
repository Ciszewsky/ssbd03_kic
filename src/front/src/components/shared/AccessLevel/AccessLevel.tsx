import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useStoreSelector } from "../../../redux/reduxHooks";
import { changeLevel } from "../../../redux/userSlice";
import styles from "./style.module.scss";

interface AccessLevelProps {
    accessLevel: AccessLevelType;
    clickable?: boolean;
    selectable?: boolean;
    onClick?: () => void;
    grayed?: boolean;
}

const getAccessLevel = (accessLevel: string) => {
    switch (accessLevel) {
        case "ADMINISTRATOR": {
            return "Administrator";
        }
        case "SPECIALIST": {
            return "Specialista";
        }
        case "CLIENT": {
            return "Klient";
        }
        default: {
            return "";
        }
    }
};

const AccessLevel = ({
    accessLevel,
    clickable = false,
    selectable = false,
    grayed = false,
    onClick,
}: AccessLevelProps) => {
    const user = useStoreSelector((state) => state.user);
    const level = useStoreSelector((state) => state.user.cur);
    const dispatch = useDispatch();

    const handleClick = () => {
        if (!clickable) return;
        if (selectable) {
            for (let i = 0; i < user.auth.length; i++) {
                if (user.auth[i] === accessLevel) {
                    dispatch(
                        changeLevel({
                            sub: user.sub,
                            auth: user.auth,
                            index: i,
                            exp: user.exp,
                        })
                    );
                }
            }
        }
        if (onClick) onClick();
    };

    useEffect(() => {}, []);

    return (
        <div
            onClick={handleClick}
            className={styles.access_level_wrapper}
            style={{ cursor: `${clickable ? "pointer" : "default"}` }}
        >
            <p
                className={`${styles.text}  ${
                    grayed ? styles.grayed : styles[accessLevel.toLowerCase()]
                } ${
                    accessLevel === level &&
                    styles.selected &&
                    clickable &&
                    selectable
                        ? styles.selected
                        : null
                }`}
            >
                {getAccessLevel(accessLevel)}
            </p>
        </div>
    );
};

export default AccessLevel;
