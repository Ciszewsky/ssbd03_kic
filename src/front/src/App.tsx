import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/unprotected/HomePage/HomePage";
import ErrorPage from "./pages/unprotected/ErrorPage/ErrorPage";
import {RegisterPage} from "./pages/unprotected/RegisterPage";
import { useStoreSelector, useStoreDispatch } from "./redux/reduxHooks";
import jwtDecode from "jwt-decode";
import { login as loginDispatch } from "./redux/userSlice";
import ActivateAccountPage from "./pages/unprotected/ActivatePage/ActivateAccountPage";
import ResetPasswordForm from "./components/Form/resetPasswordForm/ResetPasswordForm";
import ResetPasswordTokenForm from "./components/Form/resetPasswordTokenForm/ResetPasswordTokenForm";
import { ValidationProvider } from "./context/validationContext";
import AccountDetailsPage from "./pages/protected/shared/AccountDetailsPage/AccountDetailsPage";
import EditOwnAccountPage from "./pages/protected/shared/EditOwnAccountPage/EditOwnAccountPage";
import authorizedRoutes from "./security/authorizedRoutes";
import PageLayout from "./pages/PageLayout/PageLayout";
import { ImplantListPage } from "./pages/unprotected/ImplantListPage";
import LoginPage from "./pages/unprotected/LoginPage/LoginPage";

function App() {
    const user = useStoreSelector((state) => state.user);

    const dispatch = useStoreDispatch();
    const token = localStorage.getItem("ACCESS_TOKEN");
    try {
        if (user.exp === "" && token) {
            const decoded_token = jwtDecode(token);

            if (decoded_token) {
                dispatch(loginDispatch(decoded_token));
            }
        }
    } catch (error) {
        console.error(error);
    }

    return (
        <Router>
            <ValidationProvider>
                <Routes>
                    <Route path="/*" element={<ErrorPage />} />
                    <Route element={<PageLayout />}>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/implants" element={<ImplantListPage />} />
                        {user.cur ? (
                            <>
                                <Route
                                    path="/account"
                                    element={<AccountDetailsPage />}
                                />
                                <Route
                                    path="/account/edit"
                                    element={<EditOwnAccountPage />}
                                />
                                {authorizedRoutes(user.cur as AccessLevelType)}
                            </>
                        ) : (
                            <>
                                <Route path="/login" element={<LoginPage />} />
                                <Route
                                    path="/register"
                                    element={<RegisterPage />}
                                />
                                <Route
                                    path="/active"
                                    element={<ActivateAccountPage />}
                                />
                                <Route
                                    path="/reset-password"
                                    element={<ResetPasswordForm />}
                                />
                                <Route
                                    path="/reset-password-token"
                                    element={<ResetPasswordTokenForm />}
                                />
                            </>
                        )}
                    </Route>
                </Routes>
            </ValidationProvider>
        </Router>
    );
}

export default App;
