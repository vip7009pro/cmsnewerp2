import React, { useEffect, useState } from "react";

const fallbackAvatar = "/noimage.webp";
const avatarStatus = new Map<string, "loaded" | "failed">();

interface PrecisionUserAvatarProps {
  employeeNo?: string;
  hasImage?: boolean;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
}

const PrecisionUserAvatar: React.FC<PrecisionUserAvatarProps> = ({
  employeeNo,
  hasImage,
  alt = "Avatar",
  className,
  style,
}) => {
  const avatarUrl = hasImage && employeeNo
    ? `/Picture_NS/NS_${employeeNo}.jpg`
    : fallbackAvatar;
  const cachedStatus = avatarStatus.get(avatarUrl);
  const [src, setSrc] = useState(
    cachedStatus === "failed" ? fallbackAvatar : avatarUrl
  );

  useEffect(() => {
    const status = avatarStatus.get(avatarUrl);
    setSrc(status === "failed" ? fallbackAvatar : avatarUrl);
  }, [avatarUrl]);

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      onLoad={() => {
        if (src === avatarUrl) avatarStatus.set(avatarUrl, "loaded");
      }}
      onError={() => {
        avatarStatus.set(avatarUrl, "failed");
        setSrc(fallbackAvatar);
      }}
    />
  );
};

export default React.memo(PrecisionUserAvatar);