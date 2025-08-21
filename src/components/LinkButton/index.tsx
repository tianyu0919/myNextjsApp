// nextjs 中使用antd的Button组件，兼容Link的prefetch

"use client";

import React from "react";
import { Button, ButtonProps } from "antd";
import Link from "next/link";

interface LinkButtonProps extends ButtonProps {
  href: string;
}

const LinkButton: React.FC<LinkButtonProps> = ({
  href,
  children,
  ...btnProps
}) => {
  return (
    <Link href={href}>
      <Button {...btnProps}>{children}</Button>
    </Link>
  );
};

export default LinkButton;
