'use client';

import { useMemo, useState } from 'react';
import styles from './bill-calculator.module.css';

function formatMoney(value: number) {
  return value.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function BillCalculatorForm() {
  const [category, setCategory] = useState('');
  const [volume, setVolume] = useState('');
  const [sewer, setSewer] = useState<'yes' | 'no'>('no');
  const [show, setShow] = useState(false);

  const parsedVolume = Number(volume);

  const results = useMemo(() => {
    const validVolume = Number.isFinite(parsedVolume) && parsedVolume > 0;
    const volumeValue = validVolume ? parsedVolume : 0;

    const computeTiered = (
      usage: number,
      tiers: Array<{ limit: number; rate: number }>,
    ) => {
      let remaining = usage;
      let total = 0;
      let prevLimit = 0;
      for (const tier of tiers) {
        if (remaining <= 0) break;
        const span = Math.min(remaining, tier.limit - prevLimit);
        total += span * tier.rate;
        remaining -= span;
        prevLimit = tier.limit;
      }
      return total;
    };

    const water = (() => {
      if (!category || volumeValue <= 0) return 0;
      switch (category) {
        case 'domestic':
          return computeTiered(volumeValue, [
            { limit: 6, rate: 92 },
            { limit: 20, rate: 118 },
            { limit: 50, rate: 123 },
            { limit: 100, rate: 128 },
            { limit: 300, rate: 133 },
            { limit: Number.POSITIVE_INFINITY, rate: 143 },
          ]);
        case 'mdu':
          return volumeValue * 118;
        case 'commercial':
          return computeTiered(volumeValue, [
            { limit: 50, rate: 123 },
            { limit: 100, rate: 128 },
            { limit: 300, rate: 133 },
            { limit: Number.POSITIVE_INFINITY, rate: 143 },
          ]);
        case 'kiosk':
          return volumeValue * 70;
        case 'bowsing':
          return volumeValue * 118;
        case 'bulk':
          return volumeValue * 118;
        case 'schools':
          return computeTiered(volumeValue, [
            { limit: 600, rate: 123 },
            { limit: 1200, rate: 128 },
            { limit: Number.POSITIVE_INFINITY, rate: 138 },
          ]);
        default:
          return 0;
      }
    })();

    const sewerCharge = sewer === 'yes' ? water * 0.75 : 0;
    const total = water + sewerCharge;
    return { water, sewer: sewerCharge, total };
  }, [parsedVolume, sewer, category]);

  const onCalculate = () => {
    setShow(true);
  };

  return (
    <div className="col-lg-8">
      <div className={styles.billWrap}>
        <div className={styles.billHeader}>
          <h1>
            Bill <b>Calculator</b>
          </h1>
          <p>Estimate your monthly charges in a few quick steps.</p>
        </div>

        <div className={styles.formGrid}>
          <div className={styles.fieldGroup}>
            <label htmlFor="cat">Consumer Category</label>
            <select
              name="cat"
              id="cat"
              className="form-control"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Consumer Category</option>
              <option value="domestic">1. Domestic/Residential</option>
              <option value="mdu">2. Multi-dwelling units/Gated Communities</option>
              <option value="commercial">
                3. Commercial/Industrial/Government/Institutions
              </option>
              <option value="schools">4. Public Schools, Universities and Colleges</option>
              <option value="kiosk">5. Water Kiosks</option>
              <option value="bowsing">6. Bowsing Points (Own Tanker)</option>
              <option value="bulk">7. Bulk Water Supply / Water Projects</option>
            </select>
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="volume">Volume Consumed</label>
            <input
              type="text"
              name="volume"
              id="volume"
              className="form-control"
              placeholder="e.g. 35"
              required
              autoFocus
              value={volume}
              onChange={(e) => setVolume(e.target.value)}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label>Connected to Sewer</label>
            <div className={styles.radioRow}>
              <label htmlFor="no">
                <input
                  type="radio"
                  id="no"
                  name="sewer"
                  value="no"
                  checked={sewer === 'no'}
                  onChange={() => setSewer('no')}
                />{' '}
                No
              </label>
              <label htmlFor="yes">
                <input
                  type="radio"
                  id="yes"
                  name="sewer"
                  value="yes"
                  checked={sewer === 'yes'}
                  onChange={() => setSewer('yes')}
                />{' '}
                Yes
              </label>
            </div>
          </div>
        </div>

        <div className={styles.buttonRow}>
          <button
            type="button"
            name="search"
            id="search"
            className="btn btn-primary"
            onClick={onCalculate}
          >
            Calculate Monthly Bill
          </button>
        </div>

        <div
          className={`table-responsive ${styles.resultCard}`}
          id="bill_details"
          style={{ display: show ? 'block' : 'none' }}
        >
          <table className="table table-bordered">
            <tbody>
              <tr>
                <td width="40%" align="right">
                  <b>Water</b>
                </td>
                <td width="60%">KSh {formatMoney(results.water)}</td>
              </tr>
              <tr>
                <td width="40%" align="right">
                  <b>Sewer</b>
                </td>
                <td width="60%">KSh {formatMoney(results.sewer)}</td>
              </tr>
              <tr className={styles.resultTotal}>
                <td width="40%" align="right">
                  <h2>Total</h2>
                </td>
                <td width="60%">
                  <h2>KSh {formatMoney(results.total)}</h2>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
