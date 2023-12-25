export const JWT_CODE_COMMON = "1212";
export const INVALID_SIGNATURE_CODE = "02";
export const JWT_EXPIRED_CODE = "01";

export const FORBIDDEN_CODE_COMMON = "0000";
export const MISSING_CLIENT_ID_CODE = "03";
export const NOT_FOUND_TOKEN_PAIR_CODE = "04";
export const INVALID_DECODE_RF_ID_CODE = "05";
export const INVALID_DECODE_AC_ID_CODE = "06";
export const MISSING_ACCESS_TOKEN_CODE = "07";

export const isErrorCode = (code: string) =>
  [
    JWT_CODE_COMMON,
    INVALID_SIGNATURE_CODE,
    MISSING_CLIENT_ID_CODE,
    NOT_FOUND_TOKEN_PAIR_CODE,
    INVALID_DECODE_RF_ID_CODE,
    INVALID_DECODE_AC_ID_CODE,
    MISSING_ACCESS_TOKEN_CODE,
  ].includes(code);
