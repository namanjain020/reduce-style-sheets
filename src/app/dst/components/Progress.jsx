"use client"
// use the component in your app!
import * as React from "react";
import { Progress as ProgressBar} from '@chakra-ui/react'

export default function Progress(props) {
  const [value, setValue] = React.useState(props.val);
  return (
    <div>
        <ProgressBar colorScheme={props.color} value={value}  />  
    </div>
        
  );
}
