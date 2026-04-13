import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../state/theme.slice";
import '../styles/themeButton.css'
function ThemeButton() {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.theme);

  return (
    <div
      className={`toggle ${theme}`}
      onClick={() => {
  console.log("before:", theme);
  dispatch(toggleTheme());
}}
    >
      <div className="circle"></div>
    </div>
  );
}

export default ThemeButton;