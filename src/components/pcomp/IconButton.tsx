import React from "react";

const IconButton = ({
  icon,
  title,
  desc,
}: {
  icon?: React.ReactNode;
  title: string;
  desc?: string;
}) => {
  return (
    <span className="flex flex-row w-min p-2 rounded-lg gap-3 cursor-pointer hover:bg-foreground/5 items-center overflow-hidden">
      <div className="aspect-square p-2 rounded-lg bg-foreground/5 flex justify-center items-center">
        {icon}
      </div>
      <div className="flex flex-col justify-center h-full text-nowrap pr-2 text-sm">
        <h3 className="text-foreground font-semibold">{title}</h3>
        <p className="text-foreground/60">{desc}</p>
      </div>
    </span>
  );
};

export default IconButton;
