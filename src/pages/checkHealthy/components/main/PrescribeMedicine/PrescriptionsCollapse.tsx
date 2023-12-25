import DeleteIcon from "@mui/icons-material/Delete";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { Collapse, InputAdornment, Stack, TextField, Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { FC } from "react";
import { TransitionGroup } from "react-transition-group";
import { SelectInput } from "~/components";
import { Colors } from "~/constants";
import { MedicineOptionsInPrescription } from "~/models/prescriptions.model";
import { fNumber } from "~/utils/formatNumber";

const options = [
  {
    value: "1",
    label: "1",
  },
  {
    value: "2",
    label: "2",
  },
  {
    value: "3",
    label: "3",
  },
];

type RenderItemOptions = {
  item: MedicineOptionsInPrescription;
  index: number;
  onRemove?: (index: string) => void;
  disabled?: boolean;
  onChangeValue?: (
    key: keyof MedicineOptionsInPrescription,
    value: string | number,
    index: number
  ) => void;
};

function RenderItem({ item, index, onRemove, onChangeValue, disabled }: RenderItemOptions) {
  return (
    <ListItem
      secondaryAction={
        disabled ? undefined : (
          <IconButton
            edge="end"
            aria-label="delete"
            title="Delete"
            onClick={() => onRemove?.(item.id!)}
            color="error"
          >
            <DeleteIcon />
          </IconButton>
        )
      }
      sx={{ background: Colors.blueLight, my: 0.3, borderRadius: 1 }}
    >
      <Stack sx={{ py: 1 }}>
        <Stack flexDirection={"row"} gap={2}>
          <Typography fontSize={14}>
            STT: <b>{index + 1}</b>
          </Typography>
          <Typography fontSize={14}>
            Nhóm thuốc: <b>{item.typeName}</b>
          </Typography>
          <Typography fontSize={14}>
            Tên thuốc: <b>{item.name}</b>
          </Typography>
          <Typography fontSize={14}>
            Giá niêm yết: <b>{fNumber(item.infoData?.price_sell || 0)}</b>
          </Typography>
          <Typography fontSize={14}>
            Đơn vị: <b>{`${item?.unit?.name} (${item?.unit?.character})`}</b>
          </Typography>
        </Stack>

        <Stack mt={2} flexDirection={"row"} gap={2}>
          <Stack width={100}>
            <Typography fontSize={14} fontWeight={700}>
              Số lượng
            </Typography>
            <TextField
              disabled
              size="small"
              value={item.quantity_ordered}
              onChange={({ target: { value } }) =>
                onChangeValue?.("quantity_ordered", value, index)
              }
              inputProps={{ style: { padding: "6px 8px" } }}
              sx={{
                "& input": {
                  fontSize: 14,
                  color: (theme) => theme.palette.success.main,
                  WebkitTextFillColor: "unset !important",
                  fontWeight: 700,
                },
              }}
            />
          </Stack>

          <Stack width={150}>
            <Typography fontSize={14} fontWeight={700}>
              Ngày uống
            </Typography>
            <SelectInput
              disabled={disabled}
              options={options}
              value={item.amount_use_in_day}
              onChange={({ target: { value } }) =>
                onChangeValue?.("amount_use_in_day", value as string, index)
              }
              SelectDisplayProps={{ style: { padding: "6px 8px" } }}
              margin="none"
              size="small"
              sx={{ p: "0" }}
              endAdornment={
                <InputAdornment position="end" sx={{ mr: 4 }}>
                  <Typography fontSize={14} fontWeight={"bold"}>
                    lần
                  </Typography>
                </InputAdornment>
              }
            />
          </Stack>

          <Stack width={150}>
            <Typography fontSize={14} fontWeight={700}>
              SLSD cho 1 lần
            </Typography>
            <TextField
              disabled={disabled}
              type="number"
              value={item.amount_of_medication_per_session}
              onChange={({ target: { value } }) =>
                onChangeValue?.("amount_of_medication_per_session", value, index)
              }
              size="small"
              inputProps={{ style: { padding: "6px 8px" } }}
            />
          </Stack>

          <Stack width={230}>
            <Typography fontSize={14} fontWeight={700}>
              Buổi sử dụng thuốc
            </Typography>
            <TextField
              disabled={disabled}
              fullWidth
              value={item.session}
              onChange={({ target: { value } }) => onChangeValue?.("session", value, index)}
              size="small"
              inputProps={{ style: { padding: "6px 8px" } }}
            />
          </Stack>
        </Stack>

        <Stack mt={1}>
          <Stack>
            <TextField
              disabled={disabled}
              multiline
              value={item.note}
              size="small"
              onChange={({ target: { value } }) => onChangeValue?.("note", value, index)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EditNoteIcon />
                  </InputAdornment>
                ),
              }}
              variant="standard"
            />
          </Stack>
        </Stack>
      </Stack>
    </ListItem>
  );
}

type PrescriptionsCollapseProps = {
  data: MedicineOptionsInPrescription[];
} & Pick<RenderItemOptions, "onChangeValue" | "onRemove" | "disabled">;

const PrescriptionsCollapse: FC<PrescriptionsCollapseProps> = ({ data, ...props }) => {
  return (
    <List sx={{ mt: 1, gap: 2 }}>
      <TransitionGroup>
        {data.length ? (
          data.map((item, index) => (
            <Collapse key={index}>
              <RenderItem index={index} item={item} {...props} />
            </Collapse>
          ))
        ) : (
          <Collapse>
            <ListItem
              sx={{
                background: Colors.blueLight,
                my: 0.3,
                borderRadius: 1,
                fontWeight: 700,
                fontSize: 14,
                py: 2,
              }}
            >
              Chưa có toa thuốc chỉ định
            </ListItem>
          </Collapse>
        )}
      </TransitionGroup>
    </List>
  );
};

export default PrescriptionsCollapse;
