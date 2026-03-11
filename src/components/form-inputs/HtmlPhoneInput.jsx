"use client";

import React, { useState } from "react";
import CountryPhoneInput from "react-country-phone-input";
import "react-country-phone-input/lib/style.css";

const HtmlPhoneInput = () => {
  const [value, setValue] = useState("");

  return (
    <CountryPhoneInput
      value={value}
      onChange={(val) => setValue(val)}
      placeholder="Enter phone number"
      inputClass="!w-full h-8 text-sm px-2 border rounded-md"
      country="us"
    />
  );
};

export default HtmlPhoneInput;
