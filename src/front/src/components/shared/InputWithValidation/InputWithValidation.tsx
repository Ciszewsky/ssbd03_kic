import { useContext, useState } from "react";
import { faCheck, faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    ActionType,
    validationContext,
} from "../../../context/validationContext";
import styles from "./style.module.scss";
import { CSSObject } from "@emotion/react";
import CSS from "csstype";

interface InputWithValidationProps {
    title: string;
    value: string | undefined;
    validationType: ActionType;
    isValid: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    styleWidth?: CSS.Properties;
    type?: string;
}

const InputWithValidation = ({
    title,
    value,
    validationType,
    isValid,
    required,
    styleWidth,
    type,
    onChange,
}: InputWithValidationProps) => {
    const [input, setInput] = useState<string | undefined>(value);
    const { state, dispatch } = useContext(validationContext);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
        dispatch({
            type: validationType,
            payload: { ...state, input: e.target.value },
        });
        if (onChange) {
            onChange(e);
        }
    };

    return (
        <div className={styles.edit_field_wrapper}>
            {required ? (
                <>
                    <p className={styles.title}>
                        {title} <span style={{ color: "red" }}>*</span>
                    </p>
                </>
            ) : (
                <>
                    <p className={styles.title}>{title}</p>
                </>
            )}

            <div className={styles.input_wrapper} style={styleWidth}>
                <input
                    value={input}
                    type={type}
                    onChange={handleChange}
                    className={`${styles.input} ${
                        isValid ? styles.valid : styles.invalid
                    }`}
                />
                <FontAwesomeIcon
                    className={`${styles.icon} ${
                        isValid ? styles.valid : styles.invalid
                    }`}
                    icon={isValid ? faCheck : faClose}
                    color="#00FF66"
                />
            </div>
        </div>
    );
};
InputWithValidation.defaultProps = {
    type: "text",
};
export default InputWithValidation;
