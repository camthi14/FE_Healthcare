import { Box } from "@mui/material";
import { Iconify } from "..";
import { Colors, Shadows, Transform } from "~/constants";
import { keyframes } from "@emotion/react";
import { useEffect, useState } from "react";

type Props = {};
const transfrom = Transform.translateY;

const bounce = keyframes`
  
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0);
  }

`;

const ButtonTop = (_props: Props) => {
  const [backToTopButton, setBackToTopButton] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 150) {
        setBackToTopButton(true);
      } else {
        setBackToTopButton(false);
      }
    });
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <Box>
        {backToTopButton && (
          <Box
            sx={{
              position: "fixed",
              right: "20px",
              bottom: "20px",
              width: "43px",
              height: "44px",
              lineHeight: "40px",
              color: Colors.blue,
              backgroundColor: Colors.white,
              boxShadow: Shadows.boxShadow2,
              borderRadius: "50%",
              opacity: "0.8",
              zIndex: "12",
              transform: Transform.translateY,
              transition: `${transfrom} 0.25s ease-in-out`,
              "&:hover": { opacity: 1, animation: `${bounce} 1s ease-in-out infinite` },
            }}
            onClick={scrollToTop}
          >
            <Iconify icon="iconoir:fast-up-circle" sx={{ width: "43px", height: "44px" }} />
          </Box>
        )}
      </Box>
    </>
  );
};

export default ButtonTop;
