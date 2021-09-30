import Branch from "./Branch";

class Term {
  id: number;
  name: string;
  visits: number;
  branches: Branch[];

  constructor(
    id: number,
    name: string,
    visits: number,
    branches: Branch[]
  ) {
    this.id = id;
    this.name = name;
    this.visits = visits;
    this.branches = branches;
  }
}
export default Term;
