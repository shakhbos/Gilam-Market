import React from "react";

interface InputCostomProps {
  required?: boolean;
  label?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: any;
  className?: string;
  placeholder?: string;
  type?: string;
}

export default function InputCostom({ required, label, onChange, value, className, placeholder, type }: InputCostomProps) {
  return (
    <label className={`w-full ${className && className}`}>
      {label && <p className="text-[12px] leading-[14px] mb-[15px]">{label}</p>}
      <input
        type={type}
        required={required}
        onChange={onChange}
        value={value}
        className="py-[11px] w-full px-[12px] outline-none border-[#EEEEEE] border-[1px] border-solid mb-4"
        placeholder={placeholder}
      />
    </label>
  );
}
