import React from "react";
import { BiImageAlt } from "react-icons/bi";
import { twMerge } from "tailwind-merge";

export default function Image(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <div className="w-full pt-[100%] relative">
      <div className="absolute top-0 left-0 bottom-0 right-0 h-full">
        <img {...props} className={twMerge("object-cover w-full h-full ", props.className)}></img>
      </div>
    </div>
  );
}

export function ImageSlider(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <div className="w-full pt-[56.25%] relative">
      <div className="absolute top-0 left-0 bottom-0 right-0 h-full">
        <img {...props} className={twMerge("object-cover w-full h-full ", props.className)}></img>
      </div>
    </div>
  );
}

export function ImageDefault() {
  return (
    <div className="w-full pt-[56.25%] relative">
      <div className="absolute top-0 left-0 bottom-0 right-0 h-full">
        <BiImageAlt className="text-[#C4C4C4] w-1/2 h-1/2 mx-auto" />
      </div>
    </div>
  );
}
