import * as React from 'react';
import {TOKENS} from './helpers/tokens';
import {NFTS} from './helpers/nfts';
import {getPrice} from './helpers/price';
import {getNftPrice} from './helpers/nft.price';
import * as images from './images';

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

const useNftPrices = () => {
  const intervalRef = React.useRef(null);
  const [prices, setPrices] = React.useState(null);

  React.useEffect(() => {
    intervalRef.current = setInterval(async () => {
      const prices = await Promise.all(
        Object.values(NFTS).map(async nft => {
          try {
            const price = await getNftPrice(nft);
            return {price, nft};
          } catch (err) {
            console.error(err);
            return null;
          }
        })
      );

      setPrices(
        prices
          .filter(Boolean)
          .reduce((acc, {nft, price}) => Object.assign(acc, {[nft]: price}), {})
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
  const nftPrices = useNftPrices();
  return (
    <div className={styles.root}>
      <div className={styles.module}>
        <a href="https://fidi.tech" className={styles.badge}>
          <div className={styles.logo} />
        </a>
      </div>
      {!prices && <div className={styles.module}>Loading...</div>}
      {Boolean(prices) && <div className={styles.module}>
        {Object.entries(prices).map(([token, price]) => (
          <div key={token} className={styles.token}>
            <div className={styles.symbol}>{token}</div>
            <div className={styles.price}>{dollarUSLocale.format(price)}</div>
          </div>
        ))}
      </div>}
      {!nftPrices && <div className={styles.module}>Loading...</div>}
      {Boolean(nftPrices) &&
        <>
        {Object.entries(nftPrices).map(([nft, price]) => (
          <div key={nft} className={styles.module}>
            <img className={styles.image} src={images[nft]} />
            <div className={styles.imagePrice}>Floor price: {dollarUSLocale.format(price).replace('$', 'ETH ')}</div>
          </div>
        ))}
        </>
      }
    </div>
  );
};

export default App;
