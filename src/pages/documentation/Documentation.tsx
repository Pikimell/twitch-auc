import { FC } from 'react';
import './Documentation.scss';

// Імпорти скріншотів (приклади)
import AuctionPanel from '@assets/img/documentation/1.png';
import ListBid from '@assets/img/documentation/2.png';
import AddBid from '@assets/img/documentation/3.png';
import TimerBlock from '@assets/img/documentation/4.png';
import SettingsScreen from '@assets/img/documentation/5.png';
import WheelScreen from '@assets/img/documentation/6.png';
import StatsScreen from '@assets/img/documentation/7.png';
import HistoryScreen from '@assets/img/documentation/8.png';

const Documentation: FC = () => {
  return (
    <div className='documentation'>
      <h2 id='instruction'>Інструкція користувача</h2>

      <h3 id='create-auction'>1. Початок роботи</h3>
      <div>
        Для початку роботи достатньо відкрити вебдодаток у браузері. Ніяка реєстрація або авторизація не потрібна — ви
        одразу потрапляєте до панелі керування, де можете керувати аукціоном.
      </div>
      <figure>
        <img src={AuctionPanel} width={500} alt='Панель керування аукціоном' />
        <figcaption>Головна панель</figcaption>
      </figure>

      <h3 id='elements-view'>2. Відображення елементів</h3>
      <div>
        Усі додані елементи відображаються у відповідному списку. У стрімера є можливість швидко редагувати цей список,
        видаляти та додавати нові елементи до нього.
      </div>
      <figure>
        <img src={ListBid} width={500} alt='Список елементів' />
        <figcaption>Список елементів</figcaption>
      </figure>

      <h3 id='add-bid'>3. Додавання елементів</h3>
      <div>
        Елементи можна додавати вручну, натиснувши кнопку "Додати елемент". Введіть ім’я глядача, суму та виберіть
        елемент, на який йде ставка. Якщо інтеграції увімкнені — елементи можуть також зʼявлятися автоматично.
      </div>
      <figure>
        <img src={AddBid} width={500} alt='Форма додавання елементів вручну' />
        <figcaption>Додавання елементів вручну</figcaption>
      </figure>

      <h3 id='timer'>4. Керування часом</h3>
      <div>
        Таймер розіграшу дозволяє чітко обмежити час для подачі ставок. Ви можете запускати, зупиняти, скидати таймер
        або додавати/віднімати хвилини вручну.
      </div>
      <figure>
        <img src={TimerBlock} width={500} alt='Блок таймера аукціону' />
        <figcaption>Таймер керування розіграшем</figcaption>
      </figure>

      <h3 id='settings'>5. Налаштування аукціону</h3>
      <div>
        У вкладці налаштувань можна змінити кольорову тему інтерфейсу, активувати режим кульок, увімкнути/вимкнути
        додаткові функції, налаштувати зовнішній вигляд та поведінку системи.
      </div>
      <figure>
        <img src={SettingsScreen} width={500} alt='Сторінка налаштувань' />
        <figcaption>Налаштування зовнішнього вигляду і логіки</figcaption>
      </figure>

      <h3 id='wheel'>6. Колесо шансів</h3>
      <div>
        Після завершення прийому ставок можна запустити колесо шансів. Воно обирає переможця випадковим чином, з
        урахуванням суми ставок кожного гравця.
      </div>
      <figure>
        <img src={WheelScreen} width={500} alt='Колесо шансів' />
        <figcaption>Інструмент вибору переможця</figcaption>
      </figure>

      <h3 id='stats'>7. Статистика</h3>
      <div>
        Після завершення аукціону система автоматично генерує статистику — графіки ставок, активність, популярність
        елементів. Це допомагає краще планувати наступні розіграші.
      </div>
      <figure>
        <img src={StatsScreen} width={500} alt='Сторінка зі статистикою' />
        <figcaption>Аналітика активності аукціону</figcaption>
      </figure>

      <h3 id='history'>8. Історія</h3>
      <div>
        У вкладці "Історія" відображаються всі попередні розіграші з детальними даними: хто робив ставки, на які суми,
        які елементи перемагали. Ви можете фільтрувати та аналізувати інформацію.
      </div>
      <figure>
        <img src={HistoryScreen} width={500} alt='Журнал дій' />
        <figcaption>Повна історія ставок і розіграшів</figcaption>
      </figure>

      <h2 id='features'>Додаткові можливості</h2>
      <div>
        Якщо потрібно — можна увімкнути інтеграцію з платформами донатів та поінтів. Усі отримані пожертви будуть
        автоматично оброблятися і додаватися до відповідних елементів розіграшу.
      </div>
    </div>
  );
};

export default Documentation;
