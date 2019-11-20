import TopDownCar from "./TopDownCar";
import MovingWithKeyboard from "./MovingWithKeyboard";
import UsingClasses from "./UsingClasses";

interface CodeClubSession {
  sessionNumber: number;
  href: string;
  title: string;
  component: React.FunctionComponent;
}

const sessions: CodeClubSession[] = [
  {
    sessionNumber: 3,
    href: "/codeClub/movingWithKeyboard",
    title: "Moving With Keyboard",
    component: MovingWithKeyboard
  },
  {
    sessionNumber: 4,
    href: "/codeClub/topDownCar",
    title: "Top Down Car",
    component: TopDownCar
  },
  {
    sessionNumber: 6,
    href: "/codeClub/usingClasses",
    title: "Using Classes",
    component: UsingClasses
  }
];

export default sessions;
