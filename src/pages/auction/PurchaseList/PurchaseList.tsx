import { ReactText, useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Typography } from '@mui/material';
import { ThunkDispatch } from 'redux-thunk';
import { useTranslation } from 'react-i18next';

import { RootState } from '@reducers';
import { addPurchase, processRedemption, Purchase } from '@reducers/Purchases/Purchases.ts';
import { addTestPurchase } from '@reducers/Purchases/Purchases.ts'; // Екшен для додавання тестових покупок
import { PURCHASE_SORT_OPTIONS } from '@constants/purchase.constants.ts';
import donatePay from '@components/Integration/DonatePay';

import DraggableRedemption from '../DraggableRedemption/DraggableRedemption';
import DragBidContext from '../DragBidContext/DragBidContext';

import './PurchaseList.scss';

const generateRandomPurchase = (): Purchase => {
  const randomId = Date.now().toString();
  const randomCost = Math.floor(Math.random() * 1000) + 1; // Випадкова сума від 1 до 1000
  const randomColors = ['#469291', '#FF5733', '#33FF57', '#3357FF', '#FF33A1'];
  const randomMessages = ['Buy Now!', 'Great Deal!', 'Exclusive Offer!', 'Flash Sale!', 'Limited Time!'];
  const randomUsername = `User${Math.floor(Math.random() * 1000)}`;

  return {
    id: randomId,
    cost: randomCost,
    username: randomUsername,
    message: randomMessages[Math.floor(Math.random() * randomMessages.length)],
    timestamp: new Date().toISOString(),
    color: randomColors[Math.floor(Math.random() * randomColors.length)],
    source: 'API',
  };
};

const PurchaseList: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const { purchases } = useSelector((root: RootState) => root.purchases);
  const { globalSocket, twitchSocket, daSocket } = useSelector((root: RootState) => root.socketIo);
  const {
    settings: { purchaseSort },
  } = useSelector((root: RootState) => root.aucSettings);

  const handleRedemption = useCallback(
    (redemption: Purchase): void => {
      dispatch(processRedemption(redemption));
    },
    [dispatch],
  );

  const handleAddTestPurchase = useCallback(() => {
    const testPurchase: Purchase = generateRandomPurchase();
    dispatch(addPurchase(testPurchase));
  }, [dispatch]);

  const compareValues = (a: ReactText, b: ReactText): number => {
    if (a === b) {
      return 0;
    }
    return a > b ? 1 : -1;
  };

  const sortedPurchases = useMemo(() => {
    const { key, order } = PURCHASE_SORT_OPTIONS[purchaseSort || 0];
    const orderModifier = order === 'ascend' ? 1 : -1;

    return [...purchases].sort((a: Purchase, b: Purchase) => compareValues(a[key], b[key]) * orderModifier);
  }, [purchaseSort, purchases]);

  useEffect(() => {
    globalSocket?.on('Bid', (bid) => handleRedemption({ ...bid, source: 'API' }));
    twitchSocket?.on('Bid', (bid) => handleRedemption({ ...bid, source: 'twitch' }));

    const handleDaBid = (bid: Purchase) => handleRedemption({ ...bid, source: 'da' });
    daSocket?.on('Bid', handleDaBid);

    const donatePayUnsub = donatePay.pubsubFlow.events.on('bid', (bid: Bid.Item) =>
      handleRedemption({ ...bid, source: 'donatePay' }),
    );

    return () => {
      donatePayUnsub();
      daSocket?.off('Bid', handleDaBid);
    };
  }, [daSocket, handleRedemption, twitchSocket, globalSocket]);

  return (
    <div className='purchase-container'>
      <DragBidContext />
      <Button style={{ marginBottom: '15px' }} variant='contained' color='primary' onClick={handleAddTestPurchase}>
        {t('common.addTestPurchase')}
      </Button>
      <div className='purchase-list'>
        {sortedPurchases.map((purchase) => (
          <DraggableRedemption {...purchase} key={purchase.id} />
        ))}
      </div>
      {!!purchases.length && (
        <Typography className='total-purchases'>
          <span>{t('bid.totalBids')}</span>
          <span>{purchases.length}</span>
        </Typography>
      )}
    </div>
  );
};

export default PurchaseList;
