
class Vote {
  fingerprintId: number;
  branchId: number;

  constructor( 
    fingerprintId: number,
    branchId: number,
  ) {
    this.fingerprintId = fingerprintId;
    this.branchId = branchId;
  }
}
export default Vote;
