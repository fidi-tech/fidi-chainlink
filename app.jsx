import * as React from 'react';
import {TOKENS} from './helpers/tokens';
import {getPrice} from './helpers/price';

import styles from './styles.css';

const UPDATE_INTERVAL = 10000;

const usePrices = () => {
  const intervalRef = React.useRef(null);
  const [prices, setPrices] = React.useState(null);

  React.useEffect(() => {
    intervalRef.current = setInterval(async () => {
      const prices = await Promise.all(
        Object.values(TOKENS).map(async token => {
          try {
            const price = await getPrice(token);
            return {price, token};
          } catch (err) {
            console.error(err);
            return null;
          }
        })
      );

      setPrices(
        prices
          .filter(Boolean)
          .reduce((acc, {token, price}) => Object.assign(acc, {[token]: price}), {})
      );
    }, UPDATE_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return prices;
};

const dollarUSLocale = Intl.NumberFormat('en-US', {
  maximumFractionDigits: 2,
  style: 'currency',
  currency: 'USD',
});

const App = () => {
  const prices = usePrices();
  return (
    <div className={styles.root}>
      <div className={styles.module}>
        <a href="https://fidi.tech" className={styles.badge}>
          <div className={styles.logo} />
        </a>
      </div>
      {!prices && <div className={styles.module}>Loading...</div>}
      {Boolean(prices) && <div className={`${styles.module} ${styles.flex}`}>
        {Object.entries(prices).map(([token, price]) => (
          <div key={token} className={styles.token}>
            <div className={styles.symbol}>{token}</div>
            <div className={styles.price}>{dollarUSLocale.format(price)}</div>
          </div>
        ))}
      </div>}
    </div>
  );
};

export default App;
