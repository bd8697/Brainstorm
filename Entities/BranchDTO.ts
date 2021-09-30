class Branch {
    id: number;
    name: string;
    upvotes: number;
    downvotes: number;
    termId: number;
  
    constructor(id: number, name: string, upvotes: number, downvotes: number, termId: number) {
      this.id = id;
      this.name = name;
      this.upvotes = upvotes;
      this.downvotes = downvotes;
      this.termId = termId;
        }
  }
  export default Branch;
  