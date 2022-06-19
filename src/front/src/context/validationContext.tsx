import { createContext } from "react";
import { useReducer } from "react";

// STATE

interface ContextState {
    isFirstNameValid: boolean;
    isLastNameValid: boolean;
    isPhoneNumberValidAdministrator: boolean;
    isPhoneNumberValidSpecialist: boolean;
    isPhoneNumberValidClient: boolean;
    isPESELValid: boolean;
    isEmailValidAdministrator: boolean;
    isEmailValidSpecialist: boolean;
    isPasswordValid: boolean;
    isLoginValid: boolean;
    input: string;
}

// ACTION
export type ActionType =
    | "VALIDATE_FIRSTNAME"
    | "VALIDATE_LASTNAME"
    | "VALIDATE_EMAIL_ADMINISTRATOR"
    | "VALIDATE_EMAIL_SPECIALIST"
    | "VALIDATE_PHONENUMBER_ADMINISTRATOR"
    | "VALIDATE_PHONENUMBER_SPECIALIST"
    | "VALIDATE_PHONENUMBER_CLIENT"
    | "VALIDATE_PESEL"
    | "VALIDATE_PASSWORD"
    | "VALIDATE_LOGIN"
    | "R"
    | "RESET_VALIDATION";

interface ValidationAction {
    payload: ContextState;
    type: ActionType;
}

// CONTEXT

interface ValidationContext {
    state: ContextState;
    dispatch: (action: ValidationAction) => void;
}

// INITIAL STATE

const initialState: ContextState = {
    isFirstNameValid: false,
    isLastNameValid: false,
    isPhoneNumberValidAdministrator: false,
    isPhoneNumberValidSpecialist: false,
    isPhoneNumberValidClient: false,
    isPESELValid: false,
    isEmailValidAdministrator: false,
    isEmailValidSpecialist: false,
    isPasswordValid: false,
    isLoginValid: false,
    input: "",
};

const validate = (input: string, pattern: RegExp) => {
    return pattern.test(input);
};

const validationReducer = (state: ContextState, action: ValidationAction) => {
    state.input = "";
    switch (action.type) {
        case "VALIDATE_FIRSTNAME": {
            return {
                ...state,
                isFirstNameValid: validate(
                    action.payload.input,
                    /^[a-zA-Z\u00C0-\u017F'][a-zA-Z-\u00C0-\u017F' ]+[a-zA-Z\u00C0-\u017F']{3,30}$/
                ),
            };
        }
        case "VALIDATE_LASTNAME": {
            return {
                ...state,
                isLastNameValid: validate(
                    action.payload.input,
                    /^[a-zA-Z\u00C0-\u017F'][a-zA-Z-\u00C0-\u017F' ]+[a-zA-Z\u00C0-\u017F']{3,30}$/
                ),
            };
        }
        case "VALIDATE_PHONENUMBER_ADMINISTRATOR": {
            return {
                ...state,
                isPhoneNumberValidAdministrator: validate(
                    action.payload.input,
                    /^\d{9}$/
                ),
            };
        }
        case "VALIDATE_PHONENUMBER_SPECIALIST": {
            return {
                ...state,
                isPhoneNumberValidSpecialist: validate(
                    action.payload.input,
                    /^\d{9}$/
                ),
            };
        }
        case "VALIDATE_PHONENUMBER_CLIENT": {
            return {
                ...state,
                isPhoneNumberValidClient: validate(
                    action.payload.input,
                    /^\d{9}$/
                ),
            };
        }
        case "VALIDATE_PESEL": {
            return {
                ...state,
                isPESELValid: validate(action.payload.input, /^\d{11}$/),
            };
        }
        case "VALIDATE_EMAIL_ADMINISTRATOR": {
            return {
                ...state,
                isEmailValidAdministrator: validate(
                    action.payload.input,
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                ),
            };
        }
        case "VALIDATE_EMAIL_SPECIALIST": {
            return {
                ...state,
                isEmailValidSpecialist: validate(
                    action.payload.input,
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                ),
            };
        }
        case "VALIDATE_LOGIN": {
            return {
                ...state,
                isLoginValid: validate(
                    action.payload.input,
                    // /^[a-zA-Z\u00C0-\u017F'][a-zA-Z-\u00C0-\u017F' ]+[a-zA-Z\u00C0-\u017F']{3,30}$/
                    /^[a-zA-Z\u00C0-\u017F']{3,30}$/
                ),
            };
        }
        case "VALIDATE_PASSWORD": {
            return {
                ...state,
                isPasswordValid: validate(
                    action.payload.input,
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,128}$/
                ),
            };
        }

        case "RESET_VALIDATION": {
            return {
                ...initialState,
            };
        }
        default: {
            return { ...state };
        }
    }
};

const validationContext = createContext<ValidationContext>({
    state: initialState,
    dispatch: () => {},
});

const ValidationProvider = ({ children }: { children: JSX.Element }) => {
    const [state, dispatch] = useReducer(validationReducer, initialState);
    const value = { state, dispatch };
    return (
        <validationContext.Provider value={value}>
            {children}
        </validationContext.Provider>
    );
};

export { validationContext, ValidationProvider };
