import { memo, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { appActions } from "~/features/app";
import { useAppDispatch } from "~/stores";

type HeadSeoProps = {
  title: string;
  content?: string;
};

const HeadSeo = ({ title, content }: HeadSeoProps) => {
  const dispatch = useAppDispatch();

  title = `${title} | HealthyCare`;
  content = content || "Description" + title;

  useEffect(() => {
    dispatch(appActions.setTitle(title));
  }, [title]);

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={content} />
    </Helmet>
  );
};

export default memo(HeadSeo);
