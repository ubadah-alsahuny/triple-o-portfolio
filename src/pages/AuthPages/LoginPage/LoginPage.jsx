import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import ErrorMessageBox from "../../../components/ErrorMessageBox/ErrorMessageBox.jsx";
import { useAuth } from "../../../contexts/AuthContext";
import axios from "axios";
import Input from "../../../components/Input/Input.jsx";
import Button from "../../../components/Button/Button.jsx";
import Logo from "../../../assets/Logo.png";
import image from "../../../assets/BuisnessHandshake.jpeg"

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      // تسجيل الدخول والحصول على التوكن
      const loginResponse = await fetch(
        "http://127.0.0.1:8000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!loginResponse.ok) {
        const errorData = await loginResponse.json();
        setErrorMessage(errorData.message || "Login failed.");
        setIsLoading(false);
        return;
      }

      const loginData = await loginResponse.json();
      const token = loginData.token;
      localStorage.setItem("auth_token", token);

      // جلب معلومات المستخدم
      const profileResponse = await axios.get(
        "http://127.0.0.1:8000/api/profile/auth",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setUser(profileResponse.data.data);
      navigate("/home/home");
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("An error occurred while logging in.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`clear-both md:flex w-screen h-screen ${styles.background}`}>
      <div className={`w-3/5 h-full flex flex-col justify-center items-center bg-black overflow-hidden drop-shadow`}>
        <img
          src={
            image
          }
          alt={""}
          className={`${styles.image} w-fit h-fit`}
        />
      </div>

      <div className={`w-2/5 flex flex-col p-5 justify-evenly`}>
        <div className={`rounded-2xl w-15 h-15 place-content-start`}>
          <img
            className={`rounded-full cursor-pointer ${styles.logo}`}
            src={Logo}
            alt={""}
          />
        </div>

        <div className={`h-full w-full content-center`}>
          <div className={`w-full justify-items-center mb-5`}>
            <p className={`${styles.title}`}>Login</p>
            <p className={`${styles.subtitle}`}>
              Get back in for another chance
            </p>
          </div>

          <div className={`text-black w-full flex-wrap justify-items-center`}>
            <form onSubmit={handleLogin} className={`w-3/5`}>
              <Input
                label="Email address:"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autocomplete="email"
              />

              <Input
                label="Password:"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type={"submit"} label="Login" loading={isLoading} />
            </form>

            {errorMessage && <ErrorMessageBox message={errorMessage} />}
          </div>
        </div>

        <div>
          <p className={`${styles.aap} italic mb-7`}>
            Not a Portfolier yet?{" "}
            <a
              href="/signup"
              className={`text-black no-underline hover:underline`}
            >
              Create an account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
