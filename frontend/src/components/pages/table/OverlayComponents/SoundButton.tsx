import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import settingsSlice from "../../../../store/slices/settings.slice";
import PaperButton from "../../../common/PaperButton";

export default function SoundButton() {
  const dispatch = useAppDispatch();
  const settings = useAppSelector(settingsSlice.selectors.settings);

  const onClick = () => {
    dispatch(
      settingsSlice.actions.asyncSaveUserSettings({
        ...settings,
        soundOn: !settings.soundOn,
      }),
    );
  };

  return (
    <PaperButton
      id="last-hand-button"
      onClick={onClick}
      startIcon={settings.soundOn ? <VolumeUpIcon /> : <VolumeOffIcon />}
    >
      {settings.soundOn ? "On" : "Off"}
    </PaperButton>
  );
}
