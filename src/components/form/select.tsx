import { Select } from "antd";
import React from "react";

export default function SelectCostom({ label,onChange, options,className, placeholder }) {
  return (
    <label className={`w-full ${className && className}`}>
      <p className="text-[12px] leading-[14px] mb-[15px]">{label}</p>
      <Select
        placeholder={placeholder}
        className=" w-full  outline-none border-[#EEEEEE] border-[1px] border-solid mb-4"
        onChange={onChange}
        options={options}
      />
    </label>
  );
}
