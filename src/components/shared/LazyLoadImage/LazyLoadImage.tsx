import { Box, styled } from "@mui/material";
import { FC, memo, useEffect, useRef } from "react";
import { SXProps } from "~/types";

type LazyLoadImageProps = {
  src: string;
  sxBox: SXProps;
  sxImage?: SXProps;
};

const ImageStyle = styled("img")(() => ({
  transition: "all 0.5s ease-in-out .5s",
  opacity: 0,
  visibility: "hidden",
  background: "rgba(0,0,0,0.2)",
  flexShrink: 0,

  width: "100%",
  height: "100%",
  objectFit: "cover",
  objectPosition: "center",

  "&.active": {
    opacity: 1,
    visibility: "visible",
  },
}));

const BoxStyle = styled(Box)(({ theme }) => ({
  background: theme.palette.grey[400],
  width: "100%",
  height: "100%",
  textDecoration: "none",
  color: "inherit",

  "&.active": {
    background: "unset",
  },
}));

const LazyLoadImage: FC<LazyLoadImageProps> = ({ src, sxBox, sxImage }) => {
  const ref = useRef<HTMLImageElement | null>(null);
  const boxRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const img = ref.current;
    let timer: NodeJS.Timeout;

    if (!img) return;

    let observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        img.setAttribute("src", src);
        img.classList.add("active");
        timer = setTimeout(() => {
          boxRef.current?.classList.add("active");
        }, 500);
      }
    });

    observer.observe(img);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [src]);

  return (
    <BoxStyle ref={boxRef} sx={sxBox}>
      <ImageStyle sx={sxImage} ref={ref} />
    </BoxStyle>
  );
};

export default memo(LazyLoadImage);
