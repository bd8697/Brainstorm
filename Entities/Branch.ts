import Transform from "./Transform";

class Branch {
  id: number;
  name: string;
  upvotes: number;
  downvotes: number;
  termId: number;
  transform: Transform;
  color: string;

  constructor(id: number, name: string, upvotes: number, downvotes: number, termId: number, transform: Transform, color: string) {
    this.id = id;
    this.name = name;
    this.upvotes = upvotes;
    this.downvotes = downvotes;
    this.termId = termId;
    this.transform = transform;
    this.color = color;
  }
}
export default Branch;
