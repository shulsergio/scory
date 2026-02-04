"use client";
import React from "react";

import css from "./ButtonBox.module.css";
import Link from "next/link";

interface ButtonBoxProps {
  option: "link" | "button";
  variant?: "white" | "primary" | "transparent";
  type?: "submit" | "button";
  children?: React.ReactNode;
  href?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | (() => void);
  disabled?: boolean;
  className?: string;
}

export default function ButtonBox({
  option = "button",
  variant = "primary",
  type = "button",
  href = "",
  onClick,
  children = null,
  disabled = false,
  className = "",
}: ButtonBoxProps) {
  const combinedClass = `${css.linkBox} ${css[variant]} ${className}`;
  if (option === "link") {
    return (
      <Link href={href} className={combinedClass}>
        {children}
      </Link>
    );
  }
  if (option === "button") {
    return (
      <button
        type={type}
        onClick={onClick}
        className={combinedClass}
        disabled={disabled}
      >
        {children}
      </button>
    );
  }
}
