import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  FormControlLabel,
  Stack,
  Typography,
  Chip,
  Divider,
} from "@mui/material";
import type { ChangelogEntry } from "./changelogData";
import "./ChangelogDialog.scss";

interface ChangelogDialogProps {
  open: boolean;
  entry: ChangelogEntry | null;
  onClose: (skipForThisVersion: boolean) => void;
  onUpdateNow: (skipForThisVersion: boolean) => void;
}

export default function ChangelogDialog({ open, entry, onClose, onUpdateNow }: ChangelogDialogProps) {
  const [skipThisVersion, setSkipThisVersion] = useState(false);

  useEffect(() => {
    if (!open) return;
    setSkipThisVersion(false);
  }, [open, entry?.version]);

  if (!entry) {
    return null;
  }

  const handleDismiss = () => {
    onClose(skipThisVersion);
  };

  const handleUpdate = () => {
    onUpdateNow(skipThisVersion);
  };

  return (
    <Dialog
      open={open}
      onClose={(_, reason) => {
        if (reason === "backdropClick" || reason === "escapeKeyDown") {
          handleDismiss();
        }
      }}
      maxWidth="md"
      fullWidth
      className="changelogDialog"
      PaperProps={{ className: "changelogDialog__paper" }}
    >
      <Box className="changelogDialog__hero">
        <div className="changelogDialog__heroGlow" />
        <Stack spacing={1} className="changelogDialog__heroContent">
          <Chip className="changelogDialog__versionChip" label={`Version ${entry.version}`} />
          <Typography className="changelogDialog__label" variant="overline">
            What's new
          </Typography>
          <Typography className="changelogDialog__title" variant="h4">
            {entry.label}
          </Typography>
          <Typography className="changelogDialog__summary" variant="body2">
            {entry.summary}
          </Typography>
        </Stack>
      </Box>

      <DialogContent className="changelogDialog__content">
        <Box className="changelogDialog__grid">
          {entry.highlights.map((highlight) => (
            <Box key={`${entry.version}-${highlight.title}`} className="changelogDialog__card">
              <Typography className="changelogDialog__cardTitle" variant="subtitle2">
                {highlight.title}
              </Typography>
              <Typography className="changelogDialog__cardDetail" variant="body2">
                {highlight.detail}
              </Typography>
            </Box>
          ))}
        </Box>

        <Divider className="changelogDialog__divider" />

        <Box className="changelogDialog__footerNote">
          <Typography variant="body2">{entry.closingNote}</Typography>
        </Box>
      </DialogContent>

      <DialogActions className="changelogDialog__actions">
        <FormControlLabel
          className="changelogDialog__checkbox"
          control={<Checkbox checked={skipThisVersion} onChange={(event) => setSkipThisVersion(event.target.checked)} />}
          label="Không show lại"
        />

        <Box className="changelogDialog__actionSpacer" />

        <Button variant="text" onClick={handleDismiss} className="changelogDialog__secondaryButton">
          Để sau
        </Button>
        <Button variant="contained" onClick={handleUpdate} className="changelogDialog__primaryButton">
          Cập nhật ngay
        </Button>
      </DialogActions>
    </Dialog>
  );
}