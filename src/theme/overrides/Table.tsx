// ----------------------------------------------------------------------

export default function Table(theme: any) {
  return {
    MuiTableCell: {
      styleOverrides: {
        root: {
          border: "1px dashed rgba(224, 224, 224, 1)",
        },
        head: {
          color: theme.palette.text.secondary,
          backgroundColor: theme.palette.background.neutral,
        },
      },
    },
  };
}
