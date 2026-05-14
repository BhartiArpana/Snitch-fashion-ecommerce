import { setUser, setLoading, setError } from "../state/auth.slice";
import { register, login, getMe } from "../services/auth.api";
import { useDispatch } from "react-redux";

export const useAuth = () => {
  const dispatch = useDispatch();
  async function handleRegister({
    fullname,
    email,
    contact,
    password,
    isSeller = false,
  }) {
    try {
      dispatch(setLoading(true));
      const data = await register({
        fullname,
        email,
        contact,
        password,
        isSeller,
      });
      //  console.log(data);
      dispatch(setUser(data.user));
      return data.user;
    } catch (err) {
      dispatch(setError(err));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  }
  async function handleLogin({ email, password }) {
    try {
      dispatch(setLoading(true));
      const data = await login({ email, password });
      dispatch(setUser(data.user));
      return data.user;
    } catch (err) {
      dispatch(setError(err));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleGetMe() {
    try {
      dispatch(setLoading(true));
      const data = await getMe();
      //  console.log(data.user);
      dispatch(setUser(data.user));
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(setLoading(false));
    }
  }

  return {
    handleRegister,
    handleLogin,
    handleGetMe,
  };
};
