import classes from "../App/App.module.scss";
type MachieEncodingProps = {
  encodedRules: string[][];
};

const MachineEncoding = ({ encodedRules }: MachieEncodingProps) => {
  const ruleCodes = encodedRules.map((rule, index) => {
    return <span key={index}>{rule.join("1")}</span>;
  });
  // Celý stroj zabalíme do startovních a koncových značek '111', přechody oddělíme '11'
  return (
    <div className={classes.encoding} style={{}}>
      <span className={classes.separator}>111</span>
      {ruleCodes.map((ruleCode, index) => (
        <span key={index}>
          {ruleCode}
          {index < ruleCodes.length - 1 && <span className={classes.separator}>11</span>}
        </span>
      ))}
      <span className={classes.separator}>111</span>
    </div>
  );
};

export default MachineEncoding;
