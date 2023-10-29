import { Doc } from "../../../convex/_generated/dataModel";

export type RecommendedProps = {
  recco: Doc<"recommendedTasks">;
};

const Recommendations: React.FC<RecommendedProps> = (props) => {
  return <div>{props.recco.reason}</div>;
};

export default Recommendations;
