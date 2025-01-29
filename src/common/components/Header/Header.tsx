import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Switch from "@mui/material/Switch";
import Toolbar from "@mui/material/Toolbar";
import { changeThemeAC } from "../../../app/app-reducer";
import { selectThemeMode, setAppStatus } from "../../../app/appSelectors";
import { MenuButton } from "../MenuButton/MenuButton";
import { useAppDispatch, useAppSelector } from "common/hooks";
import { getTheme } from "common/theme";
import { LinearProgress } from "@mui/material";
import { logoutTC } from "features/auth/model/authReducer";
import { selectIsLoggedIn } from "features/auth/model/authSelectors";
export const Header = () => {
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector(selectIsLoggedIn);

  const themeMode = useAppSelector(selectThemeMode);
  const appStatus = useAppSelector(setAppStatus);

  const theme = getTheme(themeMode);

  const changeModeHandler = () => {
    dispatch(changeThemeAC(themeMode === "light" ? "dark" : "light"));
  };

  const logoutHandler = () => {
    dispatch(logoutTC());
  };

  return (
    <AppBar position="static" sx={{ mb: "30px" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <IconButton color="inherit">
          <MenuIcon />
        </IconButton>
        <div>
          {isLoggedIn && (
            <MenuButton onClick={logoutHandler}>Logout</MenuButton>
          )}
          <MenuButton background={theme.palette.primary.dark}>Faq</MenuButton>
          <Switch color={"default"} onChange={changeModeHandler} />
        </div>
      </Toolbar>
      {appStatus === "loading" && <LinearProgress />}
    </AppBar>
  );
};
