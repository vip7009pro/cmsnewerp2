import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ChangelogDialog from "./ChangelogDialog";
import { getChangelogEntry } from "./changelogData";
import {
  CHANGELOG_REQUEST_EVENT,
  requestChangelogPopup,
  shouldSuppressChangelog,
  suppressChangelog,
  type UpdateChangelogRequestDetail,
} from "./changelogEvents";

export { requestChangelogPopup } from "./changelogEvents";

export default function ChangelogHost() {
  const [activeVersion, setActiveVersion] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const seenVersionsRef = useRef<Set<number>>(new Set());

  const openChangelog = useCallback((version: number) => {
    if (!Number.isFinite(version) || version <= 0) {
      return;
    }

    if (shouldSuppressChangelog(version)) {
      return;
    }

    if (seenVersionsRef.current.has(version)) {
      return;
    }

    seenVersionsRef.current.add(version);
    setActiveVersion(version);
    setOpen(true);
  }, []);

  useEffect(() => {
    const onRequest = (event: Event) => {
      const customEvent = event as CustomEvent<UpdateChangelogRequestDetail>;
      const version = Number(customEvent.detail?.version);
      openChangelog(version);
    };

    window.addEventListener(CHANGELOG_REQUEST_EVENT, onRequest as EventListener);
    return () => {
      window.removeEventListener(CHANGELOG_REQUEST_EVENT, onRequest as EventListener);
    };
  }, [openChangelog]);

  const entry = useMemo(() => {
    if (activeVersion === null) {
      return null;
    }

    return getChangelogEntry(activeVersion);
  }, [activeVersion]);

  const handleClose = useCallback((skipForThisVersion: boolean) => {
    if (activeVersion !== null && skipForThisVersion) {
      suppressChangelog(activeVersion);
    }

    setOpen(false);
  }, [activeVersion]);

  const handleUpdateNow = useCallback((skipForThisVersion: boolean) => {
    if (activeVersion !== null && skipForThisVersion) {
      suppressChangelog(activeVersion);
    }

    setOpen(false);
    window.location.reload();
  }, [activeVersion]);

  return (
    <ChangelogDialog
      open={open}
      entry={entry}
      onClose={handleClose}
      onUpdateNow={handleUpdateNow}
    />
  );
}