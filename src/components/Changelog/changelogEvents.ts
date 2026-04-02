export const CHANGELOG_REQUEST_EVENT = "erp:update-changelog";

export interface UpdateChangelogRequestDetail {
  version: number;
}

export const getChangelogDismissKey = (version: number) => `erp_changelog_dismissed_v${version}`;

export const shouldSuppressChangelog = (version: number) => {
  return localStorage.getItem(getChangelogDismissKey(version)) === "1";
};

export const suppressChangelog = (version: number) => {
  localStorage.setItem(getChangelogDismissKey(version), "1");
};

export const requestChangelogPopup = (version: number) => {
  window.dispatchEvent(
    new CustomEvent<UpdateChangelogRequestDetail>(CHANGELOG_REQUEST_EVENT, {
      detail: { version },
    })
  );
};