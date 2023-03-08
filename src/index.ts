import express, { Express, Request, Response } from 'express';
import cons from "consolidate";
import { data } from 'currency-codes';
import dotenv from 'dotenv';
import { convert } from './utils/currencyConverter';
import Handlebars from 'handlebars';

dotenv.config();

Handlebars.registerHelper({
  eq: (v1, v2) => v1 === v2,
  ne: (v1, v2) => v1 !== v2,
  lt: (v1, v2) => v1 < v2,
  gt: (v1, v2) => v1 > v2,
  lte: (v1, v2) => v1 <= v2,
  gte: (v1, v2) => v1 >= v2,
  and() {
      return Array.prototype.every.call(arguments, Boolean);
  },
  or() {
      return Array.prototype.slice.call(arguments, 0, -1).some(Boolean);
  }
});

const app: Express = express();
const port = process.env.PORT || 3000;

//Sets our app to use the handlebars engine
app.engine('hbs', cons.handlebars);
app.set('view engine', 'hbs');
app.set('views', __dirname +'/views');

// Clear Handlebars cache on server start

app.use(express.urlencoded({ extended: false }))

//Serves static files (we need it to import a css file)
app.use(express.static('public'));

app.get('/', (req: Request, res: Response) => {

  // Get currency codes
  res.render('mainRender', 
    { 
      layout: 'index',
      currencies: data.sort((a, b)=> a.currency.localeCompare(b.currency))
    }
  );
});

// Handle currency conversion form submission
app.post('/', async (req, res) => {
  
  console.log(req.body); // Debug

  convert(req.body).subscribe((outputAmount)=>{
    res.render('mainRender', {
      layout: 'index',
      output: outputAmount.toFixed(2),
      currencies: data.sort((a, b)=> a.currency.localeCompare(b.currency)),
      input: req.body.inputAmount,
      from: req.body.fromCurrency,
      to: req.body.toCurrency,
      
    });
  }, (error)=>{
    console.error(error);
    res.status(500).send('Error retrieving conversion data');
  })

});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});