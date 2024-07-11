import ButtonPrintDispo from "./button-print-dispo";

interface ActionBarProps {
  id: string;
}
const ActionBar = ({ id }: ActionBarProps) => {
  return (
    <div>
      <div className="flex flex-row">
        <ButtonPrintDispo id={id} />
      </div>
    </div>
  );
};

export default ActionBar;
