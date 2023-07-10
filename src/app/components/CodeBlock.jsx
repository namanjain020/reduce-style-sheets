import React from "react";

const CodeBlock = (props) => {
  return (
    <div>
      <pre class=" m-4 pl-5 drop-shadow-xl">
        <code class="language-javascript">{props.content}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;
