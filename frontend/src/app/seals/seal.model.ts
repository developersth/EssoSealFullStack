export class Seal {
  public sealNo: string;
  public pack: number;
  public isUsed: boolean;

  constructor(sealNo: string, pack: number, isUsed: boolean) {
    this.sealNo = sealNo;
    this.pack = pack;
    this.isUsed = isUsed;
  }
}
