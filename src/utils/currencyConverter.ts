import { Observable } from 'rxjs';
import { CurrencyExchangeResponse } from '../types/CurrencyExchangeResponse';
import { FormRequest } from '../types/FormRequest';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

function getCurrencyRates(base: string) {
    const url = `https://api.apilayer.com/exchangerates_data/latest?base=${base}`
    const options: AxiosRequestConfig = {
        headers:{
            "apikey": process.env.API_KEY
        }
    };
      
    const currencyExchangeReponse$: Observable<CurrencyExchangeResponse> = new Observable<CurrencyExchangeResponse>((observer) => {
        axios.get(url, options)
          .then((response: AxiosResponse<CurrencyExchangeResponse>) => {
            const data = response.data;
            observer.next(data);
            observer.complete();
        })
        .catch((error) => {
            observer.error(error);
        });
    });

    return currencyExchangeReponse$;
}

export function convert(config: FormRequest) {

    const { fromCurrency, toCurrency, outputAmount = "0", inputAmount = "0" } = config;

      return new Observable<number>(observer => {
        if (fromCurrency === toCurrency) {
          observer.next(Number.parseInt(outputAmount));
          observer.complete();
        } else {
          getCurrencyRates(fromCurrency)
          .subscribe(({ rates }: CurrencyExchangeResponse) => {
            const exchangeRate = rates[toCurrency];
            if (!exchangeRate) {
              observer.error(`Conversion from ${fromCurrency} to ${toCurrency} is not supported.`);
              observer.complete();
            } else {
              const convertedAmount = Number.parseInt(inputAmount) * exchangeRate;
              observer.next(convertedAmount);
              observer.complete();
            }
          });
        }
    });
}
