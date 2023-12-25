export interface NavConfigItem {
  title: string;
  icon: JSX.Element;
  path?: string;
}

export interface INavConfig extends NavConfigItem {
  info?: string;
  children?: Array<Required<NavConfigItem>>;
}
