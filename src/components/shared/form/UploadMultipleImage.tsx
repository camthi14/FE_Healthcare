import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { Box, IconButton, Paper, Stack } from "@mui/material";
import {
  ChangeEvent,
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { getBlobImg } from "~/helpers/upload.helper";
import { LazyLoadImage } from "..";

type UploadMultipleImageProps = {
  defaultImages?: string[];
  onChange?: (files: FileList) => void;
  onRemove?: (index: number) => void;
  onRemoveAll?: () => void;
};

export type UploadMultipleImagePropsRef = {
  resetImages: () => void;
};

const SPACING = 100;

const UploadMultipleImage = forwardRef<UploadMultipleImagePropsRef, UploadMultipleImageProps>(
  function UploadMultipleImage({ onChange, onRemove, onRemoveAll, defaultImages }, ref) {
    const imageRef = useRef<HTMLInputElement | null>(null);
    const [imageBlob, setImageBlob] = useState<string[]>([]);

    console.log(`imageBlob`, imageBlob);

    useEffect(() => {
      if (!defaultImages || !defaultImages.length) return;
      setImageBlob(defaultImages);
    }, [defaultImages, imageRef.current]);

    const handleClickUpload = useCallback(() => {
      if (!imageRef.current) return;
      imageRef.current.click();
    }, [imageRef.current]);

    const handleChangeImage = useCallback(
      async (event: ChangeEvent<HTMLInputElement>) => {
        const {
          target: { files },
        } = event;

        if (!files || !files?.length) return;

        const blobs = await Promise.all(
          Array.from(files).map(
            (file): Promise<string> =>
              new Promise(async (resolve, reject) => {
                try {
                  const { url } = await getBlobImg(file);
                  resolve(url);
                } catch (error) {
                  reject(error);
                }
              })
          )
        );

        setImageBlob((prev) => [...prev, ...blobs]);

        if (!onChange) return;

        onChange(files);
      },
      [onChange]
    );

    const removeImage = useCallback(
      (index: number) => {
        setImageBlob((prev) => [...prev.filter((_, i) => i !== index)]);

        if (!onRemove) return;
        onRemove(index);
      },
      [onRemove]
    );

    const handleRemoveAll = useCallback(() => {
      setImageBlob([]);
      if (!onRemoveAll) return;
      onRemoveAll();
    }, [onRemoveAll]);

    useImperativeHandle(
      ref,
      () => {
        return {
          resetImages() {
            setImageBlob([]);
          },
        };
      },
      []
    );

    return (
      <Stack width={"100%"} flexWrap={"wrap"} flexDirection={"row"} gap={1}>
        <Stack
          width={SPACING}
          height={SPACING}
          borderRadius={2}
          sx={{ background: "rgba(0,0,0,0.2)", color: "black", cursor: "pointer" }}
          alignItems={"center"}
          justifyContent={"center"}
          component={Paper}
          elevation={3}
          onClick={handleClickUpload}
        >
          <input
            accept="image/*"
            multiple={true}
            type="file"
            tabIndex={-1}
            style={{ display: "none" }}
            ref={imageRef}
            onChange={handleChangeImage}
          />
          <IconButton color="inherit" size="large">
            <CloudUploadIcon fontSize="inherit" />
          </IconButton>
        </Stack>

        {imageBlob.length
          ? imageBlob.map((src, index) => (
              <Stack
                key={index}
                sx={{ borderRadius: 2, overflow: "hidden" }}
                component={Paper}
                elevation={3}
                position={"relative"}
              >
                <LazyLoadImage
                  src={src}
                  sxBox={{
                    width: SPACING,
                    height: SPACING,
                    borderRadius: 2,
                    transition: "all 0.25s ease-in-out",
                    "&:hover": { transform: "scale(1.2)" },
                  }}
                  sxImage={{
                    width: SPACING,
                    height: SPACING,
                    borderRadius: 2,
                  }}
                />

                <Box
                  position={"absolute"}
                  top={0}
                  right={0}
                  sx={{
                    background: "rgba(0,0,0,0.5)",
                    borderRadius: "36px 0px 18px 36px",
                    color: "white",
                    transition: "all 0.5s ease-in-out",
                    "&:hover": {
                      transform: "rotate(360deg)",
                      borderRadius: "100%",
                      background: (theme) => theme.palette.error.main,
                    },
                  }}
                >
                  <IconButton onClick={() => removeImage(index)} color="inherit">
                    <HighlightOffIcon />
                  </IconButton>
                </Box>
              </Stack>
            ))
          : null}

        {imageBlob.length ? (
          <Stack
            width={SPACING}
            height={SPACING}
            borderRadius={2}
            sx={{ background: "rgba(0,0,0,0.2)", color: "black", cursor: "pointer" }}
            alignItems={"center"}
            justifyContent={"center"}
            component={Paper}
            elevation={3}
          >
            <IconButton onClick={handleRemoveAll} color="error" size="large">
              <DeleteIcon fontSize="inherit" />
            </IconButton>
          </Stack>
        ) : null}
      </Stack>
    );
  }
);

export default memo(
  UploadMultipleImage,
  (prevProps, nextProps) => prevProps.defaultImages?.length === nextProps.defaultImages?.length
);
