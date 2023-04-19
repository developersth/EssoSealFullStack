import { Injectable } from "@angular/core";
import { Seal } from "./seal.model";
import { Observable, of } from "rxjs";
import { delay, tap } from "rxjs/operators";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { environment } from "environments/environment";

const headers = new HttpHeaders().set("Content-Type", "application/json");
@Injectable()
export class SealService {
  constructor(private http: HttpClient) {}

  private sealPack: number[] = [3, 4, 5];
  private seals: any[] = [];
  private readonly apiUrl = `${environment.apiUrl}`;

  calculateSeal(sealTotal: number, sealStartNo: number): Observable<any> {
    //reset values
    this.seals = [];

    let total: number = sealTotal;
    let currentEnd: number = sealStartNo + total;
    let currentNumber: number = sealStartNo;
    for (let i = 0; i < total; i++) {
      let currentSize: number = this.sealPack[i % this.sealPack.length];
      let sealNo: string = `${currentNumber}-${
        currentNumber + currentSize - 1
      }`;
      if (currentNumber + currentSize <= currentEnd) {
        this.seals.push({ sealNo: sealNo, pack: currentSize, isUsed: false });
      } else if (currentEnd - currentNumber === 1) {
        this.seals.push({
          sealNo: currentNumber.toString(),
          pack: 1,
          isUsed: false,
        });
      } else if (currentEnd - currentNumber === 2) {
        this.seals.push(currentNumber.toString(), 1, false);
        this.seals.push({
          sealNo: (currentNumber + 1).toString(),
          pack: 1,
          isUsed: false,
        });
      }
      currentNumber += currentSize;
    }
    delay(200);
    return of(this.seals);
  }
  addSeal(item: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/sealin/create`,
      JSON.stringify(item),
      { headers }
    );
  }
  getSeal(startDate: string, endDate: string): Observable<any> {
    const body = { startDate: startDate, endDate: endDate };
    return this.http.post<any[]>(`${this.apiUrl}/sealin`, body, { headers });
  }
  getSealToTxtQRCode(): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/SealIn/GetSealNo`, { headers });
  }
  deleteSeal(id: string): Observable<any> {
    return this.http.delete<any[]>(`${this.apiUrl}/sealin/${id}`, { headers });
  }
  addSealOut(item: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/sealout`, item, {
      headers,
    });
  }
}
