import React, { memo, ReactElement } from "react";
import _get from "lodash/get";
import _isNil from "lodash/isNil";
import style from "../Icons/iconstyle.module.scss";
import { ICON_NAME_VS_CMP } from "./constants";

interface iconProps {
    type : string,
}

const Icons : React.FC<iconProps> = ({
  type 
}) : ReactElement | null => {
   const RenderIcon = _get(ICON_NAME_VS_CMP , type , null) as unknown as  React.ComponentType<any>;

   if(_isNil(RenderIcon)) return null;

   return (
      <RenderIcon/>
  );
}

export default memo(Icons);