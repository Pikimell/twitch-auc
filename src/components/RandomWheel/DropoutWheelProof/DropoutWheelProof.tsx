import { ChangeEvent, FC, Key, useCallback, useState } from 'react';
import './DropoutWheelProof.scss';
import { useSelector } from 'react-redux';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { DataGrid } from '@mui/x-data-grid';
import { GridColDef } from '@mui/x-data-grid/models/colDef/gridColDef';

import { RootState } from '@reducers';
import { createRandomSlots } from '@reducers/Slots/Slots.ts';
import { percentsFormatter } from '@utils/common.utils.ts';
import DropoutProof from '@assets/pdf/dropout_proof.pdf';
import PredictionService, { SlotChanceDifference } from '@services/PredictionService';
import RadioButtonGroup, { Option } from '@components/RadioButtonGroup/RadioButtonGroup';

enum SlotsPresetType {
  Random,
  Current,
}
const SLOT_PRESETS_OPTIONS: Option[] = [
  { key: SlotsPresetType.Current, label: 'поточні елементи' },
  { key: SlotsPresetType.Random, label: 'рандомні елементи' },
];

const columns: GridColDef[] = [
  {
    headerName: 'Назва',
    field: 'name',
    sortable: true,
    flex: 0.8,
  },
  {
    headerName: 'Сума',
    field: 'amount',
    sortable: true,
    flex: 0.4,
  },
  {
    headerName: 'Звичайне колесо',
    field: 'originalChance',
    sortable: true,
    valueFormatter: percentsFormatter,
    flex: 0.4,
  },
  {
    headerName: 'Вибуття',
    field: 'dropoutChance',
    sortable: true,
    valueFormatter: percentsFormatter,
    flex: 0.4,
  },
  {
    headerName: 'Різниця у шансах',
    field: 'chanceDifference',
    sortable: true,
    valueFormatter: percentsFormatter,
    flex: 0.4,
  },
  {
    headerName: 'Перемоги',
    field: 'winsCount',
    sortable: true,
    flex: 0.4,
  },
];

const DropoutWheelProof: FC = () => {
  const { slots } = useSelector((rootReducer: RootState) => rootReducer.slots);
  const [slotsPresetType, setSlotsPresetType] = useState<Key>(SlotsPresetType.Current);
  const [iterations, setIterations] = useState<number>(5000);
  const [chanceDifference, setChanceDifference] = useState<SlotChanceDifference[]>([]);
  const [preserveLogs, setPreserveLogs] = useState<boolean>(false);

  const predictChances = useCallback(() => {
    console.clear();

    const safeIterations = preserveLogs ? Math.min(30, iterations) : iterations;
    const slotsToPredict = slotsPresetType === SlotsPresetType.Current ? slots : createRandomSlots(20, 2000, 10);
    const predictionService = new PredictionService(slotsToPredict, preserveLogs);
    const difference = predictionService.researchDifference(safeIterations);

    setChanceDifference(difference);
  }, [iterations, preserveLogs, slots, slotsPresetType]);

  const handleIterationsChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setIterations(Number(e.target.value));
  }, []);

  const handlePreserveLogsChange = useCallback((_: any, checked: boolean) => {
    setPreserveLogs(checked);
    setIterations(checked ? 5 : 5000);
  }, []);

  return (
    <div className='dropout-wheel-proof'>
      <h2>Шанси на перемогу</h2>
      <p className='warning important'>
        Дане колесо ПОВНІСТТІ відповідає звичайному класичному колесу. Чим більша сума елемента, тим менше шансів
        вилетіти і тим більше шансів перемогти. Шанси на перемогу в цьому колесі РІВНІ шансам на перемогу у звичайному.
      </p>
      <p>МАТЕМАТИЧНИЙ доказ, що тут немає ніякого наеба, наведено нижче (дякую чаттерсу Dyaka за допомогу в доказі):</p>
      <Button size='large' variant='outlined' className='dropout-wheel-proof-pdf-button'>
        <a target='_blank' href={DropoutProof} rel='noopener noreferrer'>
          Відкрити математичний доказ
        </a>
      </Button>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant='body1'>Симуляція колеса на великій кількості прокруток</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div>
            <p>
              Цей скрипт симулює прокрутки колеса на вибуття до останнього переможця і виводить різницю зі звичайним.
              колесом. Ви можете розрахувати шанси і переконатися, що різниця прагне нуля зі збільшенням ітерацій.
            </p>
            <p className='warning'>
              УВАГА! При натисканні на "Розрахувати шанси" сайт може зависнути на кілька секунд (залежить від кількості
              елементів, кількості ітерацій та вашого пк), просто зачекайте. Але краще збережіть елементи на кожен, якщо
              у вас 50+ позицій)
            </p>
            <p className='warning'>Максимальна кількість ітерацій при включених докладних логах - 30.</p>
            <div className='row'>
              <RadioButtonGroup
                options={SLOT_PRESETS_OPTIONS}
                activeKey={slotsPresetType}
                onChangeActive={setSlotsPresetType}
              />
              <TextField
                className='iteration-input'
                variant='outlined'
                margin='dense'
                label='кількість ітерацій'
                onChange={handleIterationsChange}
                value={iterations}
              />
              <Button variant='contained' color='primary' onClick={predictChances}>
                розрахувати шанси
              </Button>
            </div>
            <FormControlLabel
              control={<Checkbox checked={preserveLogs} onChange={handlePreserveLogsChange} color='primary' />}
              label='Докладні логи ітерацій'
              className='wheel-controls-checkbox'
            />
            {!!chanceDifference.length && preserveLogs && (
              <p>Щоб подивитися логи, натисніть F12 -&gt; вкладка "console"</p>
            )}
            <div style={{ height: '50vh' }} className='history-table'>
              <DataGrid
                rows={chanceDifference}
                columns={columns}
                pagination
                rowHeight={35}
                initialState={{ pagination: { paginationModel: { pageSize: 20 } } }}
                pageSizeOptions={[5, 10, 20, 50, 100]}
                disableRowSelectionOnClick
                disableColumnMenu
              />
            </div>
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default DropoutWheelProof;
