import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { Box, IconButton, Typography } from "@mui/material";
import {
  ChangeEvent,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { getBlobImg } from "~/helpers/upload.helper";
import { LazyLoadImage } from "..";

type UploadAvatarProps = {
  defaultImage?: string;
  onChange?: (file: File) => void;
};

export type UploadAvatarRefProps = {
  clearState: () => void;
};

const SPACING = 150;
const SPACING_CHILD = 150 - 16;

const UploadAvatar = forwardRef<UploadAvatarRefProps, UploadAvatarProps>(
  ({ defaultImage, onChange }, ref) => {
    const imageRef = useRef<HTMLInputElement | null>(null);
    const [imageBlob, setImageBlob] = useState<string>("");

    useEffect(() => {
      if (!defaultImage) {
        return;
      }
      setImageBlob(defaultImage);
    }, [defaultImage, imageRef]);

    const handleChangeImage = useCallback(
      async (event: ChangeEvent<HTMLInputElement>) => {
        const {
          target: { files },
        } = event;

        if (!files || !files?.length) return;

        const { url } = await getBlobImg(files[0]);

        setImageBlob(url);

        if (!onChange) return;

        onChange(files[0]);
      },
      [onChange]
    );

    const handleClickUpload = useCallback(() => {
      if (!imageRef.current) return;
      imageRef.current.click();
    }, [imageRef.current]);

    const clearState = () => {
      setImageBlob("");
    };

    useImperativeHandle(ref, () => ({ clearState }), [clearState]);

    return (
      <Box
        width={SPACING}
        height={SPACING}
        borderRadius={3}
        border={(theme) => `1px dashed ${theme.palette.grey[300]}`}
        p={1}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Box
          textAlign={"center"}
          width={SPACING_CHILD}
          height={SPACING_CHILD}
          borderRadius="12px"
          sx={{
            background: (theme) =>
              theme.palette.mode === "dark" ? theme.palette.grey[900] : theme.palette.grey[300],
            cursor: "pointer",
            px: 2,
          }}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          flexDirection={"column"}
          onClick={handleClickUpload}
        >
          <input
            accept="image/*"
            multiple={false}
            type="file"
            tabIndex={-1}
            style={{ display: "none" }}
            ref={imageRef}
            onChange={handleChangeImage}
          />
          {imageBlob ? (
            <LazyLoadImage
              src={imageBlob}
              sxBox={{
                display: "flex",
                height: SPACING_CHILD,
                width: SPACING_CHILD,
                borderRadius: "12px",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
              sxImage={{
                height: SPACING_CHILD,
                width: SPACING_CHILD,
                borderRadius: "12px",
              }}
            />
          ) : (
            <>
              <IconButton aria-label="upload photo">
                <AddAPhotoIcon color="inherit" />
              </IconButton>
              <Typography color={"inherit"}>Chọn ảnh</Typography>
            </>
          )}
        </Box>
      </Box>
    );
  }
);

export default UploadAvatar;
