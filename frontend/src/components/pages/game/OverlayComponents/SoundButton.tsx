import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import settingsSlice from "../../../../store/slices/settings.slice";
import PaperButton from "../../../common/PaperButton";

export default function SoundButton() {
  const dispatch = useAppDispatch();
  const soundOn = useAppSelector(settingsSlice.selectors.soundOn);

  const onClick = () => {
    dispatch(
      settingsSlice.actions.asyncUpdateSettings({
        soundOn: !soundOn,
      }),
    );
  };

  return (
    <PaperButton
      id="last-hand-button"
      onClick={onClick}
      startIcon={soundOn ? <VolumeUpIcon /> : <VolumeOffIcon />}
    >
      {soundOn ? "On" : "Off"}
    </PaperButton>
  );
}
